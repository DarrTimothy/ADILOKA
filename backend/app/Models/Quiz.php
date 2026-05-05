<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    protected $table = 'quiz';
    protected $fillable = [
        'traditional_game_id',
        'title',
        'total_questions',
        'min_score',
        'time_limit',
        'is_active'
    ];
    protected $casts = [
        'is_active'  => 'boolean',
        'min_score' => 'float',
    ];

    /** Relasi: Quiz → Game */
    public function traditionalGame()
    {
        return $this->belongsTo(TraditionalGame::class);
    }

    /** Relasi: Quiz → Questions */
    public function questions()
    {
        return $this->hasMany(QuizQuestion::class);
    }

    /** Relasi: Quiz → Results */
    public function results()
    {
        return $this->hasMany(QuizResult::class);
    }
}
