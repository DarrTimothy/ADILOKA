<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasTable('regions')) {
            Schema::create('regions', function (Blueprint $table) {
                $table->id();
                $table->string('province_name');
                $table->string('bps_code')->unique()->nullable();
                $table->string('geometry_type'); // MultiPolygon
                $table->jsonb('coordinates');    // array koordinat
            });
        }

        if (!Schema::hasTable('region_user')) {
            Schema::create('region_user', function (Blueprint $table) {
                $table->id();

                $table->foreignId('user_id')
                    ->constrained()
                    ->cascadeOnDelete();

                $table->foreignId('region_id')
                    ->constrained()
                    ->cascadeOnDelete();

                $table->boolean('is_completed')
                    ->default(false);

                $table->timestamp('completed_at')
                    ->nullable();

                $table->timestamps();

                $table->unique([
                    'user_id',
                    'region_id'
                ]);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('regions');
        Schema::dropIfExists('region_user');
    }
};
