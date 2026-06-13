<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Collaborator extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $table = 'agency_collaborators';

    protected $fillable = [
        'agency_id', 'name', 'email', 'password',
        'invitation_token', 'active',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'active' => 'boolean',
    ];

    public function agency()
    {
        return $this->belongsTo(Agency::class);
    }
}
