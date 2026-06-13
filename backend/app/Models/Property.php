<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    protected $fillable = [
        'agency_id', 'title', 'price', 'type', 'transaction', 'city', 'commune',
        'country', 'bedrooms', 'bathrooms', 'surface', 'parking', 'furnished',
        'description', 'images', 'amenities', 'google_maps_link',
        'status', 'moderation', 'featured', 'reported', 'draft', 'views', 'rating',
    ];

    protected $casts = [
        'images' => 'array',
        'amenities' => 'array',
        'furnished' => 'boolean',
        'featured' => 'boolean',
        'reported' => 'boolean',
        'draft' => 'boolean',
        'price' => 'integer',
        'views' => 'integer',
        'rating' => 'float',
    ];

    public function agency()
    {
        return $this->belongsTo(Agency::class);
    }

    public function messages()
    {
        return $this->hasMany(Message::class);
    }
}
