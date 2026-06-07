<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\URL;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (config('app.env') === 'production' || app()->environment('production')) {
            URL::forceScheme('https');
        }

        RateLimiter::for('auth', function (Request $request) {
            return Limit::perMinute(5)
                ->by($request->ip())
                ->response(function () {
                    return response()->json([
                        'success' => false,
                        'message' => 'Terlalu banyak percobaan login. Silakan coba lagi dalam beberapa saat.'
                    ], 429);
                });
        });

        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)
                ->by($request->ip())
                ->response(function () {
                    return response()->json([
                        'success' => false,
                        'message' => 'Terlalu banyak permintaan. Silakan coba lagi nanti.'
                    ], 429);
                });
        });
    }
}
