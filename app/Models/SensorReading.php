<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SensorReading extends Model
{
    protected $guarded = [];

    public function sensor()
    {
        return $this->belongsTo(Sensor::class);
    }
}
