<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AlertPolicy extends Model
{
    protected $guarded = [];

    public function fuelTank() : BelongsTo {
        return $this->belongsTo(FuelTank::class);
    }

    public function alerts() : HasMany {
        return $this->hasMany(Alert::class);
    }
}
