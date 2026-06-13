<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    protected $fillable = [
        'agency_id', 'plan', 'amount', 'max_properties',
        'unlimited_properties', 'can_message', 'has_advanced_stats',
        'has_priority_support', 'has_featured', 'max_collaborators',
        'start_date', 'end_date', 'status',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'unlimited_properties' => 'boolean',
        'can_message' => 'boolean',
        'has_advanced_stats' => 'boolean',
        'has_priority_support' => 'boolean',
        'has_featured' => 'boolean',
        'max_collaborators' => 'integer',
    ];

    public function agency()
    {
        return $this->belongsTo(Agency::class);
    }
}
