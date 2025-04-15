<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FuelTank extends Model
{
    protected $guarded = [];

    public function sensors(){
        return $this->hasMany(Sensor::class, 'fuel_tank_id');
    }

    public function alertPolicies(){
        return $this->hasMany(AlertPolicy::class, 'fuel_tank_id');
    }
}
