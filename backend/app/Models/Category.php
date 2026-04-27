<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = [
        'name',
        'description',
    ];

    public function traditionalGames()
    {
        return $this->belongsToMany(
            TraditionalGame::class,
        );
    }
}
