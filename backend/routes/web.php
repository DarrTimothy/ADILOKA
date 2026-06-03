<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::get('/debug-storage', function () {
    return [
        'storage_path' => storage_path('app/public'),
        'exists' => is_dir(storage_path('app/public')),
        'realpath' => realpath(storage_path('app/public')),
    ];
});

Route::get('/debug-session', function () {
    return [
        'session_driver' => config('session.driver'),
        'session_domain' => config('session.domain'),
        'same_site' => config('session.same_site'),
        'secure' => config('session.secure'),
    ];
});
