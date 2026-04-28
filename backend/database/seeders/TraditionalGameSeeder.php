<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
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

        if (!is_array($data) || !array_is_list($data)) {
            throw new \Exception('Format JSON harus berupa array of regions');
        }

        $insertedGames = 0;
        $skippedGames  = 0;

        DB::transaction(function () use ($data, &$insertedGames, &$skippedGames) {

            foreach ($data as $regionData) {

                if (
                    !isset($regionData['region_bps_code']) ||
                    !isset($regionData['games']) ||
                    !is_array($regionData['games'])
                ) {
                    continue;
                }

                $region = Region::where('bps_code', $regionData['region_bps_code'])->first();

                if (!$region) {
                    Log::warning('Region tidak ditemukan', [
                        'bps_code' => $regionData['region_bps_code'],
                    ]);
                    continue;
                }

                foreach ($regionData['games'] as $game) {

                    // VALIDASI FIELD
                    $requiredFields = [
                        'title',
                        'description',
                        'how_to_play',
                        'min_players',
                        'max_players',
                        'duration'
                    ];

                    foreach ($requiredFields as $field) {
                        if (!isset($game[$field])) {
                            Log::warning('Game dilewati karena field wajib kosong', [
                                'region' => $region->bps_code,
                                'field'  => $field,
                                'game'   => $game['title'] ?? '(tanpa judul)',
                            ]);
                            $skippedGames++;
                            continue 2;
                        }
                    }

                    // VALIDASI DOMAIN
                    if ($game['min_players'] > $game['max_players']) {
                        Log::warning('Game dilewati karena min_players > max_players', [
                            'region' => $region->bps_code,
                            'game'   => $game['title'],
                        ]);
                        $skippedGames++;
                        continue;
                    }

                    $slug = $game['slug'] ?? Str::slug($game['title']);

                    // UPSERT GAME
                    $traditionalGame = TraditionalGame::updateOrCreate(
                        ['slug' => $slug],
                        [
                            'region_id'   => $region->id,
                            'title'       => $game['title'],
                            'subtitle'    => $game['subtitle'] ?? null,
                            'description' => $game['description'],
                            'how_to_play' => $game['how_to_play'],
                            'min_players' => $game['min_players'],
                            'max_players' => $game['max_players'],
                            'duration'    => $game['duration'],
                        ]
                    );

                    // RESET MEDIA
                    DB::table('traditional_game_media')
                        ->where('traditional_game_id', $traditionalGame->id)
                        ->delete();

                    // INSERT MEDIA
                    if (!empty($game['media']) && is_array($game['media'])) {

                        $mediaData = [];

                        foreach ($game['media'] as $index => $media) {

                            // VALIDASI
                            if (
                                !isset($media['type']) ||
                                !isset($media['url'])
                            ) {
                                continue;
                            }

                            if (!in_array($media['type'], ['image', 'video'])) {
                                Log::warning('Media type tidak valid', [
                                    'type' => $media['type'],
                                    'game' => $game['title']
                                ]);
                                continue;
                            }

                            $mediaData[] = [
                                'traditional_game_id' => $traditionalGame->id,
                                'type'  => $media['type'],
                                'url'   => $media['url'],
                                'order' => $media['order'] ?? $index,
                            ];
                        }

                        if (!empty($mediaData)) {
                            DB::table('traditional_game_media')->insert($mediaData);
                        }
                    }

                    $insertedGames++;
                }
            }
        });

        $this->command->info("TraditionalGamesSeeder selesai:");
        $this->command->info("✔ Game masuk  : {$insertedGames}");
        $this->command->warn("⚠ Game dilewati: {$skippedGames}");
    }
}
