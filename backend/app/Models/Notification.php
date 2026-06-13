<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $fillable = ['message', 'active', 'target_type', 'target_identifier'];

    protected $casts = [
        'active' => 'boolean',
    ];
}
