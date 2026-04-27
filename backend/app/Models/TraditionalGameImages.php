<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TraditionalGameImages extends Model
{
    protected $fillable = [
        'traditional_game_id',
        'image_url',
        'order',
    ];

    public function game()
    {
        return $this->belongsTo(TraditionalGame::class);
    }
}
