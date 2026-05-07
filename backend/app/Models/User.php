<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    protected $fillable = [
        'username',
        'email',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    /** Relasi: User → Quiz Results */
    public function quizResults()
    {
        return $this->hasMany(QuizResult::class);
    }

    public function traditionalGames()
    {
        return $this->belongsToMany(TraditionalGame::class)
            ->withPivot('is_completed');
    }
}
