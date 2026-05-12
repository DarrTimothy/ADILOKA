<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TraditionalGame extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'region_id',
        'title',
        'subtitle',
        'slug',
        'description',
        'how_to_play',
        'min_players',
        'max_players',
        'duration',
    ];

    /** Relasi ke Region */
    public function region()
    {
        return $this->belongsTo(Region::class);
    }

    /** Relasi ke Quiz */
    public function quiz()
    {
        return $this->hasOne(Quiz::class, 'traditional_game_id');
    }

    /** Relasi ke User */
    public function users()
    {
        return $this->belongsToMany(User::class)
            ->withPivot('is_completed');
    }

    /** Relasi ke Media (GENERIC) */
    public function media()
    {
        return $this->hasMany(TraditionalGameMedia::class);
    }

    /** shortcut filter */
    public function images()
    {
        return $this->media()->where('type', 'image');
    }

    public function videos()
    {
        return $this->media()->where('type', 'video');
    }

    public function coverImage()
    {
        return $this->hasOne(TraditionalGameMedia::class)
            ->where('type', 'image')
            ->where('is_cover', true);
    }
}
