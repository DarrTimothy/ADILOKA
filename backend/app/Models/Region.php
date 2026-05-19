<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Region extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'province_name',
        'bps_code',
        'geometry_type',
        'coordinates',
    ];

    protected $casts = [
        'coordinates' => 'array',
    ];

    public function traditionalGames()
    {
        return $this->hasMany(TraditionalGame::class);
    }

    public function userProgress()
    {
        return $this->belongsToMany(
            User::class,
            'region_user'
        )
            ->withPivot([
                'is_completed',
                'completed_at'
            ])
            ->withTimestamps();
    }
}
