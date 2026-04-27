<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Models\Region;
use App\Models\TraditionalGame;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;

class TraditionalGamesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(string $kode_bps)
    {
        $user = JWTAuth::parseToken()->authenticate();

        $completedGameIds = $user->traditionalGames()
            ->wherePivot('is_completed', true)
            ->pluck('traditional_games.id')
            ->toArray();

        $region = Region::where('bps_code', $kode_bps)
            ->with(['traditionalGames.images'])
            ->first();

        if (!$region) {
            return ApiResponse::notFound(
                'Region dengan kode BPS tersebut tidak ditemukan'
            );
        }

        $response = [
            'province_name' => $region->province_name,
            'bps_code'      => $region->bps_code,
            'total_games'   => $region->traditionalGames->count(),
            'games' => $region->traditionalGames->map(function ($game) use ($completedGameIds) {
                return [
                    'id'           => $game->id,
                    'title'        => $game->title,
                    'subtitle'     => $game->subtitle,
                    'is_completed' => in_array($game->id, $completedGameIds),

                    // 1 gambar saja untuk list
                    'cover_img' => optional(
                        $game->images->sortBy('order')->first()
                    )->image_url,
                ];
            }),
        ];

        return ApiResponse::success(
            $response,
            'Daftar permainan berdasarkan region'
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = JWTAuth::parseToken()->authenticate();

        $game = TraditionalGame::with(['region', 'images'])
            ->find($id);

        if (!$game) {
            return ApiResponse::notFound('Game tidak ditemukan');
        }

        $isCompleted = $user->traditionalGames()
            ->wherePivot('is_completed', true)
            ->where('traditional_games.id', $game->id)
            ->exists();

        $response = [
            'id' => $game->id,
            'title' => $game->title,
            'subtitle' => $game->subtitle,
            'description' => $game->description,
            'how_to_play' => $game->how_to_play,
            'min_players' => $game->min_players,
            'max_players' => $game->max_players,
            'duration' => $game->duration,
            'is_completed' => $isCompleted,
            'region' => [
                'province_name' => $game->region->province_name,
                'bps_code' => $game->region->bps_code,
            ],
            'images' => $game->images->map(fn($img) => [
                'image_url' => $img->image_url,
                'order' => $img->order,
            ]),
        ];

        return ApiResponse::success(
            $response,
            'Detail permainan tradisional'
        );
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function markCompleted(string $gameId)
    {
        $user = JWTAuth::parseToken()->authenticate();

        $game = TraditionalGame::find($gameId);

        if (!$game) {
            return ApiResponse::notFound('Game tidak ditemukan');
        }

        $user->traditionalGames()->syncWithoutDetaching([
            $game->id => [
                'is_completed' => true,
                'completed_at' => now()
            ]
        ]);

        return ApiResponse::success([
            'game_id' => $game->id,
            'is_completed' => true,
        ], 'Game berhasil ditandai selesai');
    }

    public function search(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();

        $validator = Validator::make($request->all(), [
            'q' => 'required|string|min:2'
        ]);

        if ($validator->fails()) {
            return ApiResponse::validationError($validator->errors());
        }

        $keyword = $request->q;

        // game yang sudah completed oleh user
        $completedGameIds = $user->traditionalGames()
            ->wherePivot('is_completed', true)
            ->pluck('traditional_games.id')
            ->toArray();

        $games = TraditionalGame::with(['region', 'images'])
            ->where('title', 'ILIKE', "%{$keyword}%")
            ->orderBy('title')
            ->paginate(10);

        $response = $games->through(function ($game) use ($completedGameIds) {
            return [
                'id' => $game->id,
                'title' => $game->title,
                'subtitle' => $game->subtitle,
                'region' => [
                    'province_name' => $game->region->province_name,
                    'bps_code' => $game->region->bps_code,
                ],
                'duration' => $game->duration,
                'is_completed' => in_array($game->id, $completedGameIds),
                'images' => $game->images->map(fn($img) => [
                    'image_url' => $img->image_url,
                    'order' => $img->order,
                ]),
            ];
        });

        return ApiResponse::success(
            $response,
            'Hasil pencarian permainan tradisional'
        );
    }

    public function popularThisWeek()
    {
        JWTAuth::parseToken()->authenticate();

        $games = TraditionalGame::with(['region', 'images'])
            ->select('traditional_games.*')
            ->join('traditional_game_user', 'traditional_games.id', '=', 'traditional_game_user.traditional_game_id')
            ->where('traditional_game_user.is_completed', true)
            ->whereNotNull('traditional_game_user.completed_at')
            ->where('traditional_game_user.completed_at', '>=', now()->subDays(7))
            ->groupBy('traditional_games.id')
            ->orderByRaw('COUNT(traditional_game_user.user_id) DESC')
            ->limit(5)
            ->get();

        if ($games->isEmpty()) {
            return ApiResponse::success([], 'Belum ada permainan populer minggu ini');
        }

        $response = $games->map(fn($game) => [
            'id' => $game->id,
            'title' => $game->title,
            'subtitle' => $game->subtitle,
            'region' => $game->region ? [
                'province_name' => $game->region->province_name,
                'bps_code' => $game->region->bps_code,
            ] : null,
            'cover_img' => optional(
                $game->images->sortBy('order')->first()
            )->image_url,
        ]);

        return ApiResponse::success(
            $response,
            'Daftar permainan populer minggu ini'
        );
    }
}
