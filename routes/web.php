<?php

use App\Http\Controllers\AlertController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FuelTankController;
use App\Http\Controllers\SocialiteController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
     return Inertia::render('Welcome');
});

Route::get('/auth/google/redirect', [SocialiteController::class, 'googleRedirect']);
Route::get('/auth/google/callback', [SocialiteController::class, 'googleCallback']);
Route::get('/auth/login', [SocialiteController::class, 'normalLogin'])->name('login');
Route::get('/auth/logout', [SocialiteController::class, 'logout'])->name('logout');

Route::get('/dashboard', [DashboardController::class, 'getDashboardData'])
     ->middleware('auth')->name('dashboard');

Route::resource('tanks', FuelTankController::class)->only(['index', 'create', 'store'])->middleware('auth');

Route::resource('alerts', AlertController::class)->only(['index'])->middleware('auth');
Route::get('alerts/resolve/{id}', [AlertController::class, 'resolve'])->middleware('auth')->name('alerts.resolve');