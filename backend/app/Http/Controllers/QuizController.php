<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Helpers\ApiResponse;
use App\Http\Requests\SubmitQuizRequest;
use App\Models\TraditionalGame;
use Illuminate\Support\Facades\DB;
use App\Models\Quiz;
use App\Models\QuizQuestion;
use App\Models\QuizOptions;
use App\Models\QuizResult;

class QuizController extends Controller
{
    public function showByGame(TraditionalGame $game)
    {
        $game->load('quiz.questions.options');

        if (!$game->quiz) {
            return ApiResponse::notFound('Quiz tidak tersedia untuk permainan ini');
        }

        $quiz = $game->quiz;

        $result = [
            'id' => $quiz->id,
            'title' => $quiz->title,
            'min_score' => $quiz->min_score,
            'time_limit' => $quiz->time_limit,
            'is_active' => $quiz->is_active,
            'questions' => $quiz->questions->map(function ($question) {
                return [
                    'id' => $question->id,
                    'question' => $question->question,
                    'options' => $question->options
                ];
            })
        ];

        return ApiResponse::success($result, 'Quiz berhasil diambil');
    }

    public function submit(SubmitQuizRequest $request, TraditionalGame $game)
    {
        $user = $request->user();

        $game->load('quiz.questions.options');

        // Ambil quiz lengkap dengan questions & options
        $quiz = $game->quiz;

        if (!$quiz || !$quiz->is_active) {
            return ApiResponse::notFound('Quiz tidak ditemukan atau tidak aktif');
        }

        // Cegah submit ulang
        if (QuizResult::where('user_id', $user->id)
            ->where('quiz_id', $quiz->id)
            ->exists()
        ) {
            return ApiResponse::error('Quiz sudah dikerjakan', null, 409);
        }

        $answers = collect($request->answers);

        // Validasi jumlah jawaban
        if ($answers->count() !== $quiz->total_questions) {
            return ApiResponse::error(
                'Jumlah jawaban tidak sesuai',
                null,
                422
            );
        }

        // Ambil semua option benar dari quiz
        $correctOptionIds = QuizOptions::whereIn(
            'quiz_question_id',
            $quiz->questions->pluck('id')
        )
            ->where('is_correct', true)
            ->pluck('id')
            ->toArray();

        // Hitung jumlah jawaban benar
        $score = $answers
            ->whereIn('option_id', $correctOptionIds)
            ->count();

        // Hitung persentase score
        $scorePercentage = round(
            ($score / $quiz->total_questions) * 100,
            1
        );

        // Minimal kelulusan (persentase)
        $minScorePercentage = (float) $quiz->min_score;

        // Tentukan kelulusan
        $passed = $scorePercentage >= $minScorePercentage;
        // Simpan hasil quiz
        DB::transaction(function () use ($user, $quiz, $score, $passed, $answers) {
            QuizResult::create([
                'user_id' => $user->id,
                'quiz_id' => $quiz->id,
                'score' => $score,
                'passed' => $passed,
                'answers' => $answers->values()->toArray(),
            ]);
        });

        return ApiResponse::success([
            'correct' => $score,
            'total_questions' => $quiz->total_questions,
            'Score' => $scorePercentage,
            'passed' => $passed,
        ], 'Quiz berhasil disubmit');
    }

    public function showResult(Request $request, TraditionalGame $game)
    {
        $user = $request->user();

        $game->load('quiz.questions.options');

        $quiz = $game->quiz;

        if (!$quiz) {
            return ApiResponse::notFound('Quiz tidak ditemukan');
        }

        $result = QuizResult::where('user_id', $user->id)
            ->where('quiz_id', $quiz->id)
            ->first();

        if (!$result) {
            return ApiResponse::notFound('Quiz belum dikerjakan');
        }

        $userAnswers = collect($result->answers ?? [])
            ->pluck('option_id', 'question_id');

        $questions = $quiz->questions->map(function ($question) use ($userAnswers) {

            $selectedOptionId = $userAnswers->get($question->id);

            $options = $question->options->map(function ($option) use ($selectedOptionId) {
                return [
                    'id' => $option->id,
                    'text' => $option->option_text,
                    'is_correct' => $option->is_correct,
                    'is_selected' => $option->id === $selectedOptionId,
                ];
            });

            return [
                'id' => $question->id,
                'question' => $question->question,
                'options' => $options,
            ];
        });

        $percentage = round(
            ($result->score / $quiz->total_questions) * 100,
            1
        );

        return ApiResponse::success([
            'quiz_id' => $quiz->id,
            'title' => $quiz->title,
            'score' => $result->score,
            'percentage' => $percentage,
            'passed' => $result->passed,
            'questions' => $questions,
        ], 'Hasil quiz berhasil diambil');
    }
}
