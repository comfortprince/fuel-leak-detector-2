<?php

use App\Models\Alert;
use App\Models\FuelTank;
use App\Models\Sensor;
use App\Models\SensorReading;
use Illuminate\Support\Str;
use App\Models\User;
use App\Services\DashboardService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

Route::get('test', function (DashboardService $dashboardService) {
    // $tank = FuelTank::first();
    // $owner = $tank->user;
    // $ownerEmail = $owner->email;
    // dd(env('MAIL_FROM_NAME'));
    return '';
});

