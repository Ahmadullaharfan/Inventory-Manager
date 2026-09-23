<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserAddress extends Model
{
    protected $fillable = [
        'user_id', 'country', 'city_state', 'postal_code', 'tax_id', 'is_primary',
    ];

    protected $casts = ['is_primary' => 'boolean'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}