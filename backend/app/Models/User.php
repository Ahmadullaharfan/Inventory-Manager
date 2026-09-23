<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'first_name', 'last_name', 'email', 'phone_number',
        'role', 'bio', 'avatar_url', 'password',
        'two_fa_enabled', 'two_fa_secret', 'status',
    ];

    protected $hidden = [
        'password', 'remember_token', 'two_fa_secret',
    ];

    protected $casts = [
        'email_verified'   => 'boolean',
        'email_verified_at'=> 'datetime',
        'two_fa_enabled'   => 'boolean',
        'last_login_at'    => 'datetime',
        'password'         => 'hashed',   // Laravel 10+
    ];

    public function address()
    {
        return $this->hasOne(UserAddress::class)->where('is_primary', true);
    }

    public function addresses()
    {
        return $this->hasMany(UserAddress::class);
    }

    public function socialLinks()
    {
        return $this->hasMany(SocialLink::class);
    }

    public function notificationPreference()
    {
        return $this->hasOne(NotificationPreference::class);
    }

    public function devices()
    {
        return $this->hasMany(UserDevice::class);
    }

    public function recoveryCodes()
    {
        return $this->hasMany(TwoFaRecoveryCode::class);
    }
}