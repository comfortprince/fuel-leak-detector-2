<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Alert extends Model
{
    protected $guarded = [];

    public function alertPolicy() : BelongsTo {
        return $this->belongsTo(AlertPolicy::class);
    }

    public function mq2Reading() : BelongsTo {
        return $this->belongsTo(SensorReading::class);
    }

    public function bmp180Reading() : BelongsTo {
        return $this->belongsTo(SensorReading::class);
    }
}
