<?php

use App\Http\Controllers\RegionController;
use App\Http\Controllers\TraditionalGamesController;
use App\Http\Controllers\QuizController;
use Illuminate\Support\Facades\Route;

/**
 * PUBLIC
 */
Route::get('/regions', [RegionController::class, 'index']);

/**
 * PROTECTED
 */
Route::middleware(['auth:sanctum'])->group(function () {

    // traditional games
    Route::prefix('/traditional-games')->group(function () {
        Route::get('/popular-week', [TraditionalGamesController::class, 'popularThisWeek']);
        Route::get('/', [TraditionalGamesController::class, 'index']);
        Route::get('/{id}', [TraditionalGamesController::class, 'show']);
        Route::post('/{id}/complete', [TraditionalGamesController::class, 'markCompleted']);
    });

    // quiz
    Route::prefix('/quiz')->group(function () {
        Route::get('/{game}', [QuizController::class, 'showByGame']);
        Route::post('/{game}', [QuizController::class, 'submit']);
        Route::get('/{game}/result', [QuizController::class, 'showResult']);
    });
});

/**
 * FALLBACK
 */
Route::fallback(function () {
    return response()->json([
        'success' => false,
        'message' => 'Endpoint Not Found'
    ], 404);
});
