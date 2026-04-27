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
    }

    public function down(): void
    {
        Schema::dropIfExists('regions');
    }
};
