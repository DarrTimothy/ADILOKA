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
        'image_url',
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

    public function users()
    {
        return $this->belongsToMany(User::class)
            ->withPivot('is_completed');
    }

    public function images()
    {
        return $this->hasMany(
            TraditionalGameImages::class,
            'traditional_game_id'
        )->orderBy('order');
    }

    /**
     * NOTE:
     * Ini seharusnya many-to-many
     * Akan lebih benar pakai belongsToMany + pivot table
     */
    public function categories()
    {
        return $this->hasMany(Category::class);
    }
}
