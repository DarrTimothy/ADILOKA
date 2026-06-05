<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Process;

class SyncGamesToRailway extends Command
{
    protected $signature = 'sync:games';
    protected $description = 'Sync games folder to Railway volume';

    public function handle()
    {
        $source = base_path('storage/app/public/games');
        $volume = config('services.railway.volume') ?? env('RAILWAY_VOLUME');

        // 1. Validasi Environment Variable
        if (!$volume) {
            $this->error("RAILWAY_VOLUME belum diset di .env");
            return 1;
        }

        // 2. Validasi Keberadaan Folder Asal
        if (!File::isDirectory($source)) {
            $this->error("Folder asal tidak ditemukan: {$source}");
            return 1;
        }

        // 3. Ambil Semua File secara Rekursif (Lebih aman dibanding glob)
        $files = File::allFiles($source);

        if (empty($files)) {
            $this->info("Tidak ada file yang perlu disinkronisasi.");
            return 0;
        }

        $this->info("Total files: " . count($files));
        $this->info("Using volume: " . $volume);

        foreach ($files as $file) {
            $filePath = $file->getRealPath();
            
            // Format relative path agar seragam menggunakan forward slash (/)
            $relative = str_replace('\\', '/', $file->getRelativePathname());
            
            // Berikan slash di awal untuk target absolute path Railway
            $target = "/storage/app/public/games/" . ltrim($relative, '/');

            $this->line("Uploading: {$relative} -> {$target}");

            // 4. Perbaikan Struktur Argumen CLI Railway
            $result = Process::run([
                'railway',
                'volume',
                'files',
                '--volume', $volume, // Flag volume diletakkan sebelum subcommand upload
                'upload',
                $filePath,
                $target,
                '--overwrite'        // Flag overwrite diletakkan di paling akhir
            ]);

            if ($result->failed()) {
                $this->error("FAILED: {$relative}");
                $this->error($result->errorOutput() ?: $result->output());
                return 1;
            }
        }

        $this->info("SYNC COMPLETED ....");
        return 0;
    }
}
