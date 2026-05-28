<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Models\TraditionalGame;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class TraditionalGamesController extends Controller
{
    public function index(Request $request)
    {
        /** @var User $user */

        $user = Auth::user();

        if (!$user) {
            return ApiResponse::unauthorized();
        }

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

    public function show(int $id)
    {
        /** @var User $user */
        $user = Auth::user();

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

    public function markCompleted(int $gameId)
    {
        /** @var User $user */
        $user = Auth::user();

        $game = TraditionalGame::with('region')
            ->find($gameId);

        if (!$game) {
            return ApiResponse::notFound('Game tidak ditemukan');
        }

        $user->traditionalGames()->syncWithoutDetaching([
            $game->id => [
                'is_completed' => true,
                'completed_at' => now()
            ]
        ]);

        $this->updateRegionProgress($user, $game);

        return ApiResponse::success([
            'game_id' => $game->id,
            'is_completed' => true,
        ], 'Game berhasil ditandai selesai');
    }

    public function popularThisWeek()
    {

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

    private function transformGame(
        TraditionalGame $game,
        bool $isCompleted = false,
        bool $withDetail = false
    ) {
        $cover = $game->media
            ->where('type', 'image')
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

            'cover_img' => $cover
                ? asset('storage/' . ltrim($cover->url, '/'))
                : null,
        ];

        if ($withDetail) {

            $data = array_merge($data, [

                'description' => $game->description,

                'how_to_play' => $game->how_to_play,

                'min_players' => $game->min_players,

                'max_players' => $game->max_players,

                'media' => $game->media->map(function ($m) {

                    $url = $m->type === 'image'
                        ? asset('storage/' . ltrim($m->url, '/'))
                        : $m->url;

                    return [
                        'type' => $m->type,
                        'url' => $url,
                        'source_page' => $m->source_page,
                        'caption' => $m->caption,
                    ];
                }),
            ]);
        }

        return $data;
    }

    private function baseGameQuery()
    {
        return TraditionalGame::with([
            'region',
            'media' => function ($q) {
                $q->orderByRaw("CASE WHEN type = 'image' THEN 0 ELSE 1 END")
                    ->orderBy('id');
            }
        ]);
    }

    private function updateRegionProgress(
        User $user,
        TraditionalGame $game
    ): void {

        $region = $game->region;

        if (! $region) {
            return;
        }

        $totalGames = $region->traditionalGames()->count();

        $completedGames = $region->traditionalGames()
            ->whereHas('users', function ($query) use ($user) {
                $query->where('user_id', $user->id)
                    ->where('is_completed', true);
            })
            ->count();

        $isCompleted = (
            $totalGames > 0 &&
            $totalGames === $completedGames
        );

        $user->regionProgress()->syncWithoutDetaching([
            $region->id => [
                'is_completed' => $isCompleted,
                'completed_at' => $isCompleted
                    ? now()
                    : null,
            ]
        ]);
    }
}
