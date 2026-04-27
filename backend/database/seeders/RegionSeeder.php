<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class RegionSeeder extends Seeder
{
    public function run(): void
    {
        $path = database_path('data/GeoJSON/indonesia-province.geojson');

        if (!file_exists($path)) {
            throw new \Exception("File GeoJSON tidak ditemukan di {$path}");
        }

        $json = file_get_contents($path);
        $data = json_decode($json, true);

        // VALIDASI JSON
        if (!is_array($data)) {
            throw new \Exception('File GeoJSON tidak valid (gagal decode JSON)');
        }

        // VALIDASI STRUKTUR UTAMA GEOJSON
        if (
            ($data['type'] ?? null) !== 'FeatureCollection' ||
            !isset($data['features']) ||
            !is_array($data['features'])
        ) {
            throw new \Exception(
                'Format GeoJSON harus FeatureCollection dengan key "features"'
            );
        }

        $rows     = [];
        $inserted = 0;
        $skipped  = 0;

        DB::transaction(function () use ($data, &$rows, &$inserted, &$skipped) {

            foreach ($data['features'] as $index => $feature) {

                $properties = $feature['properties'] ?? [];
                $geometry   = $feature['geometry'] ?? [];

                // VALIDASI FIELD WAJIB
                if (
                    empty($properties['kode_bps']) ||
                    empty($properties['Province']) ||
                    empty($geometry['type']) ||
                    empty($geometry['coordinates'])
                ) {
                    Log::warning('Region dilewati karena data tidak lengkap', [
                        'index' => $index,
                        'properties' => $properties,
                    ]);

                    $skipped++;
                    continue;
                }

                $rows[] = [
                    'province_name' => $properties['Province'],
                    'bps_code'      => (string) $properties['kode_bps'],
                    'geometry_type' => $geometry['type'],
                    'coordinates'   => json_encode(
                        $geometry['coordinates'],
                        JSON_THROW_ON_ERROR
                    ),
                ];

                $inserted++;
            }

            if (empty($rows)) {
                throw new \Exception('Tidak ada data region valid yang bisa di-seed');
            }

            // UPSERT → IDEMPOTENT
            DB::table('regions')->upsert(
                $rows,
                ['bps_code'],
                ['province_name', 'geometry_type', 'coordinates']
            );
        });

        // RINGKASAN
        $this->command->info('RegionSeeder selesai');
        $this->command->info("✔ Region masuk  : {$inserted}");
        $this->command->warn("⚠ Region dilewati: {$skipped}");
    }
}
