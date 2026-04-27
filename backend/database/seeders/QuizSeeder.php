<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
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

            // Validasi data minimal
            if (
                !isset(
                    $quizData['traditional_game'],
                    $quizData['title'],
                    $quizData['total_questions'],
                    $quizData['min_score'],
                    $quizData['time_limit'],
                    $quizData['questions']
                )
            ) {
                $this->command->warn('Struktur quiz tidak lengkap, dilewati');
                $skipped++;
                continue;
            }

            // Cari traditional game
            $game = TraditionalGame::where(
                'title',
                $quizData['traditional_game']
            )->first();

            if (!$game) {
                $this->command->warn(
                    "Traditional game '{$quizData['traditional_game']}' tidak ditemukan"
                );
                $skipped++;
                continue;
            }

            // Cegah duplikasi quiz
            if (Quiz::where('traditional_game_id', $game->id)->exists()) {
                $this->command->warn(
                    "Quiz untuk game '{$quizData['traditional_game']}' sudah ada"
                );
                $skipped++;
                continue;
            }

            // Validasi jumlah soal
            if (count($quizData['questions']) !== (int) $quizData['total_questions']) {
                $this->command->warn(
                    "Jumlah soal tidak sesuai pada quiz '{$quizData['title']}'"
                );
                $skipped++;
                continue;
            }

            // Insert quiz
            $quiz = Quiz::create([
                'traditional_game_id' => $game->id,
                'title'               => $quizData['title'],
                'subtitle'            => $quizData['subtitle'] ?? null,
                'total_questions'     => $quizData['total_questions'],
                'min_score'           => $quizData['min_score'],
                'time_limit'          => $quizData['time_limit'],
                'is_active'           => $quizData['is_active'] ?? true,
            ]);

            // Insert questions & options
            foreach ($quizData['questions'] as $questionData) {

                if (
                    !isset($questionData['question'], $questionData['options']) ||
                    count($questionData['options']) !== 4
                ) {
                    $this->command->warn(
                        "Format soal tidak valid pada quiz '{$quizData['title']}'"
                    );
                    continue;
                }

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
        }

        //  summary 
        $this->command->info('Quiz Seeder Selesai');
        $this->command->info("Total data   : {$total}");
        $this->command->info("Berhasil     : {$success}");
        $this->command->warn("Dilewati     : {$skipped}");
        $this->command->line('');
    }
}
