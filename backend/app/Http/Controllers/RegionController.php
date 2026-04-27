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
        $query = Region::query();

        // Search jika ada keyword
        if ($request->filled('q')) {
            $query->where(
                'province_name',
                'ILIKE',
                '%' . $request->q . '%'
            );
        }

        $regions = $query
            ->select(
                'province_name',
                'bps_code',
                'geometry_type',
                'coordinates'
            )
            ->orderBy('province_name')
            ->paginate(10);

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
     * search specified resource.
     */
    public function search(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'q' => 'required|string|min:2'
        ]);

        if ($validator->fails()) {
            return ApiResponse::validationError($validator->errors());
        }

        $keyword = $request->q;

        $regions = Region::where('province_name', 'ILIKE', "%{$keyword}%")
            ->select('province_name', 'bps_code')
            ->orderBy('province_name')
            ->paginate(10);

        return ApiResponse::success(
            $regions,
            'Hasil pencarian region'
        );
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
