<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasTable('quiz')) {
            Schema::create('quiz', function (Blueprint $table) {
                $table->id();
                $table->foreignId('traditional_game_id')
                    ->constrained('traditional_games')
                    ->cascadeOnDelete();
                $table->string('title');
                $table->unsignedInteger('total_questions');
                $table->unsignedInteger('min_score')->default(0);
                $table->unsignedInteger('time_limit')->comment('dalam menit');
                $table->boolean('is_active')->default(true);

                $table->timestamps();
            });
        }

        if (!Schema::hasTable('quiz_question')) {
            Schema::create('quiz_question', function (Blueprint $table) {
                $table->id();
                $table->foreignId('quiz_id')
                    ->constrained('quiz')
                    ->cascadeOnDelete();

                $table->text('question');
            });
        }

        if (!Schema::hasTable('quiz_options')) {
            Schema::create('quiz_options', function (Blueprint $table) {
                $table->id();
                $table->foreignId('quiz_question_id')
                    ->constrained('quiz_question')
                    ->cascadeOnDelete();
                $table->string('option_text');
                $table->boolean('is_correct')->default(false);
            });
        }

        if (!Schema::hasTable('quiz_result')) {
            Schema::create('quiz_result', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')
                    ->constrained('users')
                    ->cascadeOnDelete();

                $table->foreignId('quiz_id')
                    ->constrained('quiz')
                    ->cascadeOnDelete();

                $table->integer('score');
                $table->boolean('passed')->default(false);
                $table->json('answers')->nullable()->after('passed');
                $table->unique(['user_id', 'quiz_id']);
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quiz_question');
        Schema::dropIfExists('quiz_options');
        Schema::dropIfExists('quiz_result');
        Schema::dropIfExists('quiz');
    }
};
