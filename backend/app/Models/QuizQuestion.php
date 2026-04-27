<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuizQuestion extends Model
{
    protected $table = 'quiz_question';
    public $timestamps = false;
    protected $fillable = [
        'quiz_id',
        'question',
    ];

    /** Relasi: Question → Quiz */
    public function quiz()
    {
        return $this->belongsTo(Quiz::class);
    }

    /** Relasi: Question → Options */
    public function options()
    {
        return $this->hasMany(QuizOptions::class);
    }
}
