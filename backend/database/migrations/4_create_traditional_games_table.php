<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Tabel utama
        if (!Schema::hasTable('traditional_games')) {
            Schema::create('traditional_games', function (Blueprint $table) {
                $table->id();

                $table->foreignId('region_id')
                    ->constrained('regions')
                    ->cascadeOnDelete();

                $table->string('title');
                $table->string('subtitle')->nullable();
                $table->string('slug')->unique();

                $table->text('description');
                $table->text('how_to_play');


                $table->unsignedTinyInteger('min_players')->nullable();
                $table->unsignedTinyInteger('max_players')->nullable();
                $table->unsignedSmallInteger('duration')->nullable();
            });
        }

        // Tabel gambar (carousel)
        if (!Schema::hasTable('traditional_game_media')) {
            Schema::create('traditional_game_media', function (Blueprint $table) {
                $table->id();

                $table->foreignId('traditional_game_id')
                    ->constrained('traditional_games')
                    ->cascadeOnDelete();

                $table->enum('type', ['image', 'video']); // image / video
                $table->boolean('is_cover')->default(false);
                $table->text('url');
                $table->text('caption')->nullable();
                $table->text('source_page')->nullable();

                $table->timestamps();
            });
        }

        if (!Schema::hasTable('traditional_game_user')) {
            Schema::create('traditional_game_user', function (Blueprint $table) {
                $table->foreignId('user_id')->constrained()->cascadeOnDelete();
                $table->foreignId('traditional_game_id')->constrained()->cascadeOnDelete();
                $table->boolean('is_completed')->default(false);
                $table->timestamp('completed_at')->nullable()->after('is_completed');
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('traditional_game_media');
        Schema::dropIfExists('traditional_games');
    }
};
