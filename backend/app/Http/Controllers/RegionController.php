<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Models\Region;
use Illuminate\Http\Request;

class RegionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = auth('sanctum')->user();
        
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
}
