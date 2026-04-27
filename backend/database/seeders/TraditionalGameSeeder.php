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

        // VALIDASI STRUKTUR UTAMA
        if (!is_array($data) || !array_is_list($data)) {
            throw new \Exception('Format JSON harus berupa array of regions');
        }

        $insertedGames = 0;
        $skippedGames  = 0;

        DB::transaction(function () use ($data, &$insertedGames, &$skippedGames) {

            foreach ($data as $regionIndex => $regionData) {

                // VALIDASI REGION
                if (
                    !isset($regionData['region_bps_code']) ||
                    !isset($regionData['games']) ||
                    !is_array($regionData['games'])
                ) {
                    Log::warning('Region dilewati karena struktur tidak valid', [
                        'index' => $regionIndex,
                        'data'  => $regionData,
                    ]);
                    continue;
                }

                $region = Region::where('bps_code', $regionData['region_bps_code'])->first();

                if (!$region) {
                    Log::warning('Region tidak ditemukan', [
                        'bps_code' => $regionData['region_bps_code'],
                    ]);
                    continue;
                }

                // LOOP GAME
                foreach ($regionData['games'] as $gameIndex => $game) {

                    // VALIDASI FIELD WAJIB
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

                    // UPSERT GAME (IDEMPOTENT)
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

                    // RESET IMAGES (IDEMPOTENT)
                    DB::table('traditional_game_images')
                        ->where('traditional_game_id', $traditionalGame->id)
                        ->delete();

                    // INSERT IMAGES (BATCH)
                    if (!empty($game['images']) && is_array($game['images'])) {

                        $images = [];

                        foreach ($game['images'] as $image) {
                            if (!isset($image['image_url'])) {
                                continue;
                            }

                            $images[] = [
                                'traditional_game_id' => $traditionalGame->id,
                                'image_url' => $image['image_url'],
                                'order' => $image['order'] ?? 0,
                            ];
                        }

                        if (!empty($images)) {
                            DB::table('traditional_game_images')->insert($images);
                        }
                    }

                    $insertedGames++;
                }
            }
        });

        // OUTPUT
        $this->command->info("TraditionalGamesSeeder selesai:");
        $this->command->info("✔ Game masuk  : {$insertedGames}");
        $this->command->warn("⚠ Game dilewati: {$skippedGames}");
    }
}
