<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Sensor extends Model
{
    protected $guarded = [];

    public function sensorReadings(): HasMany {
        return $this->hasMany(SensorReading::class);
    }

    public function fuelTank()
    {
        return $this->belongsTo(FuelTank::class);
    }
}
