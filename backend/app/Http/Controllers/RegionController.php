<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Http\Requests\StoreRegionRequest;
use App\Http\Requests\UpdateRegionRequest;
use App\Models\Region;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RegionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // /** @var User|null $user */
        $user = $request->user();

        $query = Region::query()
            ->select([
                'id',
                'province_name',
                'bps_code',
                'geometry_type',
                'coordinates'
            ])
            ->withExists([
                'userProgress as is_completed' => function ($q) use ($user) {

                    // Guest user
                    if (! $user) {
                        $q->whereRaw('1 = 0');
                        return;
                    }

                    $q->where('user_id', $user->id)
                        ->where('is_completed', true);
                }
            ]);

        // Search
        if ($request->filled('q')) {
            $query->where(
                'province_name',
                'ILIKE',
                '%' . $request->q . '%'
            );
        }

        $regions = $query
            ->orderBy('province_name')
            ->paginate(10);

        // Reorder fields
        $regions->getCollection()->transform(function ($region) {

            return [
                'province_name' => $region->province_name,
                'bps_code' => $region->bps_code,
                'geometry_type' => $region->geometry_type,
                'is_completed' => (bool) $region->is_completed,
                'coordinates' => $region->coordinates,
            ];
        });

        return ApiResponse::success(
            $regions,
            'Daftar region'
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRegionRequest $request)
    {
        $region = Region::create($request->validated());

        return ApiResponse::created($region);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRegionRequest $request, string $id)
    {
        // Cari region berdasarkan id dari parameter URL
        $region = Region::find($id);

        if (!$region) {
            return ApiResponse::notFound('Region not found');
        }

        // Isi data dengan data yang sudah tervalidasi
        $region->fill($request->validated());
        $region->save();

        return ApiResponse::success(
            $region->fresh(),
            'Region updated successfully'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $region = Region::find($id);

        if (!$region) {
            return ApiResponse::notFound('Region not found');
        }

        $region->delete();

        return ApiResponse::success(null, 'Region deleted');
    }
}
