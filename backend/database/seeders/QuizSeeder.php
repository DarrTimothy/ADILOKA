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
        $path = database_path('data/Quiz/ListQuiz.json');

        if (!File::exists($path)) {
            $this->command->error('File ListQuiz.json tidak ditemukan');
            return;
        }

        $quizList = json_decode(File::get($path), true);

        if (!is_array($quizList)) {
            $this->command->error('Format JSON tidak valid');
            return;
        }

        $total   = count($quizList);
        $success = 0;
        $skipped = 0;

        foreach ($quizList as $quizData) {

            // VALIDASI LEVEL QUIZ
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
                $this->command->warn("⚠ Struktur quiz tidak lengkap");
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
                    "⚠ Game slug '{$quizData['traditional_game_slug']}' tidak ditemukan"
                );
                $skipped++;
                continue;
            }

            // DUPLIKASI
            if (Quiz::where('traditional_game_id', $game->id)->exists()) {
                $this->command->warn(
                    "⚠ Quiz untuk '{$quizData['traditional_game_slug']}' sudah ada"
                );
                $skipped++;
                continue;
            }

            // VALIDASI JUMLAH SOAL
            if (count($quizData['questions']) !== (int) $quizData['total_questions']) {
                $this->command->warn(
                    "⚠ Jumlah soal tidak sesuai pada '{$quizData['title']}'"
                );
                $skipped++;
                continue;
            }

            // VALIDASI SEMUA SOAL DULU
            if (!$this->validateQuestions($quizData['questions'], $quizData['title'])) {
                $skipped++;
                continue;
            }

            // INSERT
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
        $this->command->info("✔ Quiz masuk     : {$success}");
        $this->command->warn("⚠ Quiz dilewati  : {$skipped}");
    }

    // VALIDASI SOAL
    private function validateQuestions(array $questions, string $quizTitle): bool
    {
        foreach ($questions as $index => $questionData) {

            // Struktur dasar
            if (
                !isset($questionData['question'], $questionData['options']) ||
                count($questionData['options']) !== 4
            ) {
                $this->command->warn(
                    "⚠ Soal ke-" . ($index + 1) . " pada '{$quizTitle}' tidak valid (struktur/options)"
                );
                return false;
            }

            // Validasi option
            foreach ($questionData['options'] as $optIndex => $option) {
                if (!isset($option['text'], $option['is_correct'])) {
                    $this->command->warn(
                        "⚠ Option ke-" . ($optIndex + 1) . " pada soal ke-" . ($index + 1) . " tidak valid"
                    );
                    return false;
                }
            }

            // Validasi 1 jawaban benar
            $correctCount = collect($questionData['options'])
                ->where('is_correct', true)
                ->count();

            if ($correctCount !== 1) {
                $this->command->warn(
                    "⚠ Soal ke-" . ($index + 1) . " pada '{$quizTitle}' harus punya tepat 1 jawaban benar"
                );
                return false;
            }
        }

        return true;
    }
}
