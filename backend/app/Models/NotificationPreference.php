<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NotificationPreference extends Model
{
    protected $fillable = [
        'user_id', 'realtime_enabled', 'team_alerts', 'email_notifications',
    ];

    protected $casts = [
        'realtime_enabled'    => 'boolean',
        'team_alerts'         => 'boolean',
        'email_notifications' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}