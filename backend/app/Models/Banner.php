<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    protected $fillable = [
        'title', 'image_url', 'positions', 'start_date', 'end_date',
        'link_url', 'active', 'sort_order',
    ];

    protected $casts = [
        'active' => 'boolean',
        'positions' => 'array',
        'start_date' => 'date',
        'end_date' => 'date',
    ];
}
