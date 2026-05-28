<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\Region;
use App\Models\TraditionalGame;

class TraditionalGameSeeder extends Seeder
{
    public function run(): void
    {
        $path = database_path('data/TraditionalGames/traditional-games.json');

        if (!file_exists($path)) {
            throw new \Exception("File tidak ditemukan: {$path}");
        }

        $data = json_decode(file_get_contents($path), true);

        if (!is_array($data)) {
            throw new \Exception('Format JSON tidak valid');
        }

        $insertedGames = 0;
        $skippedGames = 0;

        DB::transaction(function () use ($data, &$insertedGames, &$skippedGames) {

            foreach ($data as $regionData) {

                $region = Region::where(
                    'bps_code',
                    $regionData['region_bps_code'] ?? null
                )->first();

                if (!$region) {

                    $this->command->warn(
                        "Region dengan BPS '{$regionData['region_bps_code']}' tidak ditemukan"
                    );

                    continue;
                }

                foreach ($regionData['games'] ?? [] as $game) {

                    // FIELD WAJIB
                    $requiredFields = [
                        'title',
                        'slug',
                        'description',
                        'how_to_play',
                        'min_players',
                    ];

                    $isInvalid = false;

                    foreach ($requiredFields as $field) {

                        if (
                            !isset($game[$field]) ||
                            $game[$field] === ''
                        ) {

                            Log::warning('Game dilewati karena field wajib kosong', [
                                'field' => $field,
                                'game' => $game['title'] ?? '(tanpa judul)',
                            ]);

                            $this->command->warn(
                                "Game '{$game['title']}' dilewati karena field '{$field}' kosong"
                            );

                            $skippedGames++;
                            $isInvalid = true;

                            break;
                        }
                    }

                    if ($isInvalid) {
                        continue;
                    }

                    // VALIDASI MIN PLAYERS
                    if (
                        !is_numeric($game['min_players']) ||
                        $game['min_players'] <= 0
                    ) {

                        Log::warning('min_players tidak valid', [
                            'game' => $game['title'],
                        ]);

                        $this->command->warn(
                            "Game '{$game['title']}' dilewati karena min_players tidak valid"
                        );

                        $skippedGames++;
                        continue;
                    }

                    // VALIDASI MAX PLAYERS
                    if (
                        isset($game['max_players']) &&
                        $game['max_players'] !== null
                    ) {

                        if (
                            !is_numeric($game['max_players']) ||
                            $game['max_players'] <= 0
                        ) {

                            Log::warning('max_players tidak valid', [
                                'game' => $game['title'],
                            ]);

                            $this->command->warn(
                                "Game '{$game['title']}' dilewati karena max_players tidak valid"
                            );

                            $skippedGames++;
                            continue;
                        }

                        if ($game['min_players'] > $game['max_players']) {

                            Log::warning('min_players > max_players', [
                                'game' => $game['title'],
                            ]);

                            $skippedGames++;
                            continue;
                        }
                    }

                    // UPSERT GAME
                    $traditionalGame = TraditionalGame::updateOrCreate(
                        [
                            'slug' => $game['slug'],
                        ],
                        [
                            'region_id' => $region->id,
                            'title' => $game['title'],
                            'subtitle' => $game['subtitle'] ?? null,
                            'description' => $game['description'],
                            'how_to_play' => $game['how_to_play'],
                            'min_players' => $game['min_players'],
                            'max_players' => $game['max_players'] ?? null,
                            'duration' => $game['duration'] ?? null,
                        ]
                    );

                    // RESET MEDIA
                    DB::table('traditional_game_media')
                        ->where('traditional_game_id', $traditionalGame->id)
                        ->delete();

                    // INSERT MEDIA
                    $mediaData = [];

                    foreach ($game['media'] ?? [] as $media) {

                        if (
                            !isset($media['type']) ||
                            !isset($media['url'])
                        ) {
                            continue;
                        }

                        if (!in_array($media['type'], ['image', 'video'])) {
                            continue;
                        }

                        $mediaData[] = [
                            'traditional_game_id' => $traditionalGame->id,
                            'type' => $media['type'],
                            'url' => $media['url'],
                            'caption' => $media['caption'] ?? null,
                            'source_page' => $media['source_page'] ?? null,
                        ];
                    }

                    if (!empty($mediaData)) {
                        DB::table('traditional_game_media')->insert($mediaData);
                    }

                    $insertedGames++;
                }
            }
        });

        // SUMMARY
        $this->command->info('TraditionalGameSeeder selesai:');
        $this->command->info("✔ Game masuk   : {$insertedGames}");
        $this->command->warn("⚠ Game dilewati: {$skippedGames}");
    }
}
