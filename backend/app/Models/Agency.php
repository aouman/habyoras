<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Str;

class Agency extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'name', 'email', 'password', 'phone_call', 'phone_whatsapp',
        'city', 'description', 'logo', 'verified', 'active', 'invite_code',
    ];

    protected static function booted()
    {
        static::creating(function ($agency) {
            $agency->invite_code = $agency->invite_code ?? Str::random(32);
        });
    }

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'verified' => 'boolean',
        'active' => 'boolean',
    ];

    public function properties()
    {
        return $this->hasMany(Property::class);
    }

    public function subscription()
    {
        return $this->hasOne(Subscription::class);
    }

    public function messages()
    {
        return $this->hasMany(Message::class);
    }
}
