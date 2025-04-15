<?php

use App\Http\Controllers\Api\SensorReadingController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/sensor-readings', [SensorReadingController::class, 'store']);
