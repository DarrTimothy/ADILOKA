<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TraditionalGameMedia extends Model
{
    protected $table = 'traditional_game_media';

    protected $fillable = [
        'traditional_game_id',
        'type',
        'url',
        'caption',
        'source_page',
        'is_cover',
    ];

    public $timestamps = false;

    public function game()
    {
        return $this->belongsTo(TraditionalGame::class, 'traditional_game_id');
    }
}
