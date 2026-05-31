<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\DB;
use App\Models\Quiz;
use App\Models\QuizOptions;
use App\Models\QuizQuestion;
use App\Models\TraditionalGame;

class QuizSeeder extends Seeder
{
    public function run(): void
    {
        $path = database_path('data/Quiz/list-quiz.json');

        if (!File::exists($path)) {
            $this->command->error('File list-quiz.json tidak ditemukan');
            return;
        }

        $quizList = json_decode(File::get($path), true);

        if (!is_array($quizList)) {
            $this->command->error('Format JSON tidak valid');
            return;
        }

        $success = 0;
        $skipped = 0;

        foreach ($quizList as $quizData) {

            // VALIDASI FIELD WAJIB
            if (
                !isset(
                    $quizData['traditional_game_slug'],
                    $quizData['title'],
                    $quizData['total_questions'],
                    $quizData['min_score'],
                    $quizData['time_limit'],
                    $quizData['questions']
                )
            ) {

                $title = $quizData['title'] ?? '(tanpa judul)';

                $this->command->warn(
                    "Quiz '{$title}' dilewati karena struktur quiz tidak lengkap"
                );

                $skipped++;
                continue;
            }

            // CARI GAME
            $game = TraditionalGame::where(
                'slug',
                $quizData['traditional_game_slug']
            )->first();

            if (!$game) {

                $this->command->warn(
                    "Quiz '{$quizData['title']}' dilewati karena game '{$quizData['traditional_game_slug']}' tidak ditemukan"
                );

                $skipped++;
                continue;
            }

            // CEK DUPLIKAT QUIZ
            if (
                Quiz::where('traditional_game_id', $game->id)->exists()
            ) {

                $this->command->warn(
                    "Quiz '{$quizData['title']}' dilewati karena quiz sudah ada"
                );

                $skipped++;
                continue;
            }

            // VALIDASI JUMLAH SOAL
            if (
                count($quizData['questions']) !==
                (int) $quizData['total_questions']
            ) {

                $this->command->warn(
                    "Quiz '{$quizData['title']}' dilewati karena total_questions tidak sesuai"
                );

                $skipped++;
                continue;
            }

            $isInvalid = false;

            // VALIDASI SEMUA SOAL
            foreach ($quizData['questions'] as $questionData) {

                // VALIDASI STRUKTUR SOAL
                if (
                    !isset($questionData['question']) ||
                    !isset($questionData['options'])
                ) {

                    $this->command->warn(
                        "Quiz '{$quizData['title']}' memiliki soal dengan struktur tidak valid"
                    );

                    $isInvalid = true;
                    break;
                }

                // Minimal 2 OPTIONS
                if (count($questionData['options']) < 2) {

                    $this->command->warn(
                        "Quiz '{$quizData['title']}' memiliki hanya memiliki 1 pilihan jawaban"
                    );

                    $isInvalid = true;
                    break;
                }

                $correctCount = 0;

                foreach ($questionData['options'] as $option) {

                    // VALIDASI OPTION
                    if (
                        !isset($option['text']) ||
                        !isset($option['is_correct'])
                    ) {

                        $this->command->warn(
                            "Quiz '{$quizData['title']}' memiliki option yang tidak valid"
                        );

                        $isInvalid = true;
                        break 2;
                    }

                    // HITUNG JAWABAN BENAR
                    if ($option['is_correct'] === true) {
                        $correctCount++;
                    }
                }

                // MINIMAL 1 JAWABAN BENAR
                if ($correctCount < 1) {

                    $this->command->warn(
                        "Quiz '{$quizData['title']}' memiliki soal tanpa jawaban benar"
                    );

                    $isInvalid = true;
                    break;
                }
            }

            if ($isInvalid) {
                $skipped++;
                continue;
            }

            // INSERT QUIZ
            DB::transaction(function () use ($quizData, $game, &$success) {

                $quiz = Quiz::create([
                    'traditional_game_id' => $game->id,
                    'title'               => $quizData['title'],
                    'total_questions'     => $quizData['total_questions'],
                    'min_score'           => $quizData['min_score'],
                    'time_limit'          => $quizData['time_limit'],
                    'is_active'           => $quizData['is_active'] ?? true,
                ]);

                foreach ($quizData['questions'] as $questionData) {

                    $question = QuizQuestion::create([
                        'quiz_id'  => $quiz->id,
                        'question' => $questionData['question'],
                    ]);

                    foreach ($questionData['options'] as $optionData) {

                        QuizOptions::create([
                            'quiz_question_id' => $question->id,
                            'option_text'      => $optionData['text'],
                            'is_correct'       => $optionData['is_correct'],
                        ]);
                    }
                }

                $success++;
            });
        }

        // SUMMARY
        $this->command->info("QuizSeeder selesai:");
        $this->command->info("✔ Quiz masuk   : {$success}");
        $this->command->warn("⚠ Quiz dilewati: {$skipped}");
    }
}
