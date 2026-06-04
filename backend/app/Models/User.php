<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'username',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function traditionalGames()
    {
        return $this->belongsToMany(
            TraditionalGame::class,
            'traditional_game_user'
        )
            ->withPivot([
                'is_completed',
                'completed_at'
            ])
            ->withTimestamps();
    }

    public function regionProgress()
    {
        return $this->belongsToMany(
            Region::class,
            'region_user'
        )
            ->withPivot([
                'is_completed',
                'completed_at'
            ])
            ->withTimestamps();
    }

    /** Relasi: User → Quiz Results */
    public function quizResults()
    {
        return $this->hasMany(QuizResult::class);
    }
}
