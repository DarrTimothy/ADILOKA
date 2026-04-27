<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuizOptions extends Model
{
    protected $table = 'quiz_options';
    public $timestamps = false;
    protected $fillable = [
        'quiz_question_id',
        'option_text',
        'is_correct',
    ];

    protected $casts = [
        'is_correct' => 'boolean',
    ];

    /** Relasi: Option → Question */
    public function question()
    {
        return $this->belongsTo(QuizQuestion::class, 'quiz_question_id');
    }
}
