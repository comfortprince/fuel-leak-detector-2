<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FuelTank extends Model
{
    protected $guarded = [];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    public function sensors(){
        return $this->hasMany(Sensor::class, 'fuel_tank_id');
    }

    public function alertPolicies(){
        return $this->hasMany(AlertPolicy::class, 'fuel_tank_id');
    }

    public function user(){
        return $this->belongsTo(User::class);
    }
}
