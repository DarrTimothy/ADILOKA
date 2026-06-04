<?php

use App\Http\Controllers\RegionController;
use App\Http\Controllers\TraditionalGamesController;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

/**
 * PUBLIC
 */

// auth 

Route::post('/login', [AuthController::class, 'login'])
    ->middleware('throttle:auth');

Route::post('/register', [AuthController::class, 'register'])
    ->middleware('throttle:auth');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

// regions
Route::get('/regions', [RegionController::class, 'index']);

// traditional games
Route::prefix('/traditional-games')->group(function () {
    Route::get('/popular-week', [TraditionalGamesController::class, 'popularThisWeek']);
    Route::get('/', [TraditionalGamesController::class, 'index']);
});

/**
 * PROTECTED
 */

Route::middleware([
    'auth:sanctum',
    'throttle:api'
])->group(function () {

    // detail games
    Route::get('/traditional-games/{id}', [TraditionalGamesController::class, 'show']);
    // mark complete
    Route::post(
        '/traditional-games/{id}/complete',
        [TraditionalGamesController::class, 'markCompleted']
    );

    // quiz
    Route::prefix('/quiz')->group(function () {
        Route::get('/{game}', [QuizController::class, 'showByGame']);
        Route::post('/{game}', [QuizController::class, 'submit']);
        Route::get('/{game}/result', [QuizController::class, 'showResult']);
    });
});

Route::get('/debug-storage', function () {
    return [
        'storage_path' => storage_path('app/public'),
        'exists' => is_dir(storage_path('app/public')),
        'realpath' => realpath(storage_path('app/public')),
    ];
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
