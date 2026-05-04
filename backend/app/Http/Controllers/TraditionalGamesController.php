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

    public function index(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();

        $completedGameIds = $user->traditionalGames()
            ->wherePivot('is_completed', true)
            ->pluck('traditional_games.id')
            ->toArray();

        $query = $this->baseGameQuery();

        if ($request->filled('region')) {
            $query->whereHas(
                'region',
                fn($q) =>
                $q->where('bps_code', $request->region)
            );
        }

        if ($request->filled('q')) {
            $query->whereRaw('LOWER(title) LIKE ?', [
                '%' . strtolower($request->q) . '%'
            ]);
        }

        $games = $query->orderBy('title')->paginate(10);

        $data = $games->map(
            fn($game) =>
            $this->transformGame(
                $game,
                in_array($game->id, $completedGameIds)
            )
        );

        return ApiResponse::success($data);
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

        $game = $this->baseGameQuery()->find($id);

        if (!$game) {
            return ApiResponse::notFound('Game tidak ditemukan');
        }

        $isCompleted = $user->traditionalGames()
            ->wherePivot('is_completed', true)
            ->where('traditional_games.id', $game->id)
            ->exists();

        return ApiResponse::success(
            $this->transformGame($game, $isCompleted, true)
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


    public function popularThisWeek()
    {
        JWTAuth::parseToken()->authenticate();

        $games = $this->baseGameQuery()
            ->select('traditional_games.*')
            ->join('traditional_game_user', 'traditional_games.id', '=', 'traditional_game_user.traditional_game_id')
            ->where('traditional_game_user.is_completed', true)
            ->whereNotNull('traditional_game_user.completed_at')
            ->where('traditional_game_user.completed_at', '>=', now()->subDays(7))
            ->groupBy('traditional_games.id')
            ->orderByRaw('COUNT(traditional_game_user.user_id) DESC')
            ->limit(5)
            ->get();

        $data = $games->map(
            fn($game) =>
            $this->transformGame($game)
        );

        return ApiResponse::success($data);
    }
    private function transformGame(TraditionalGame $game, bool $isCompleted = false, bool $withDetail = false)
    {

        $cover = $game->media()
            ->where('type', 'image')
            ->orderBy('id') // atau order kalau ada
            ->first();

        $data = [
            'id' => $game->id,
            'region' => [
                'province_name' => $game->region->province_name,
                'bps_code' => $game->region->bps_code,
            ],
            'title' => $game->title,
            'subtitle' => $game->subtitle,


            'duration' => $game->duration,
            'is_completed' => $isCompleted,
            'cover_img' => optional($cover)->url,
        ];

        if ($withDetail) {
            $data = array_merge($data, [
                'description' => $game->description,
                'how_to_play' => $game->how_to_play,
                'min_players' => $game->min_players,
                'max_players' => $game->max_players,

                'media' => $game->media->map(fn($m) => [
                    'type'  => $m->type,
                    'url'   => $m->url,
                    // 'order' => $m->order,
                ]),
            ]);
        }

        return $data;
    }

    private function baseGameQuery()
    {
        return TraditionalGame::with([
            'region',
            'coverImage',
            'media' => function ($q) {
                $q->orderByRaw("CASE WHEN type = 'image' THEN 0 ELSE 1 END")
                    ->orderBy('order');
            }
        ]);
    }
}
