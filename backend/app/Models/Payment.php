<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'agency_id', 'plan', 'amount', 'currency', 'method',
        'mobile_operator', 'phone', 'transaction_id', 'status',
    ];

    protected $casts = [
        'status' => 'string',
    ];

    public function agency()
    {
        return $this->belongsTo(Agency::class);
    }
}
