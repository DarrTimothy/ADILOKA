<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\RegionController;
use App\Http\Controllers\TraditionalGamesController;
use App\Http\Controllers\QuizController;
use Illuminate\Support\Facades\Route;

// login / register

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/refresh', [AuthController::class, 'refresh']);

// authenticated user
Route::middleware('auth:api')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

// regions - public / user (read only)
Route::get('/regions', [RegionController::class, 'index']);

// regions - admin only (CRUD)
Route::middleware(['auth:api', 'role:admin', 'throttle:api'])->group(function () {
    Route::post('/regions', [RegionController::class, 'store']);
    Route::patch('/regions/{id}', [RegionController::class, 'update']);
    Route::delete('/regions/{id}', [RegionController::class, 'destroy']);
});


Route::middleware('auth:api')->group(function () {
    // traditional Games
    Route::get('/traditional-games', [TraditionalGamesController::class, 'index']);
    Route::get('/traditional-games/{id}', [TraditionalGamesController::class, 'show']);
    Route::post('/games/{id}', [TraditionalGamesController::class, 'markCompleted']);
    Route::get('/popular-week', [TraditionalGamesController::class, 'popularThisWeek']);

    // quiz
    Route::get('/traditional-games/quiz/{gameId}', [QuizController::class, 'showByGame']);
    Route::post('/traditional-games/quiz/{quizId}', [QuizController::class, 'submit']);
    Route::get('/traditional-games/quiz/{quizId}/result', [QuizController::class, 'showResult']);
});


Route::fallback(function () {
    return response()->json(['success' => 'false', 'message' => 'Endpoint Not Found, Please recheck the url ...'], 404);
});
