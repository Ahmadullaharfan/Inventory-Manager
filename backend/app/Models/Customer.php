<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{

    /** @use HasFactory<\Database\Factories\CustomerFactory> */

    protected $fillable = [
        'customer_name', 
        'father_name', 
        'phone_number', 
        'email', 
        'location', 
        'attachment',
    ];
    use HasFactory;
}
