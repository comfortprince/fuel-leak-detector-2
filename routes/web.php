<?php

use App\Http\Controllers\AlertController;
use App\Http\Controllers\AlertPolicyController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ExportsController;
use App\Http\Controllers\FuelTankController;
use App\Http\Controllers\SocialiteController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
     return Inertia::render('Welcome');
});

Route::get('/auth/google/redirect', [SocialiteController::class, 'googleRedirect']);
Route::get('/auth/google/callback', [SocialiteController::class, 'googleCallback']);
// Route::get('/auth/login', [SocialiteController::class, 'normalLogin'])->name('login');
// Route::get('/auth/logout', [SocialiteController::class, 'logout'])->name('logout');

Route::get('/dashboard', [DashboardController::class, 'getDashboardData'])
     ->middleware('auth')->name('dashboard');

Route::resource('tanks', FuelTankController::class)->only(['index', 'create', 'store', 'destroy', 'show', 'edit', 'update'])->middleware('auth');

Route::resource('alerts', AlertController::class)->only(['index'])->middleware('auth');
Route::resource('alert-policies', AlertPolicyController::class)->only(['destroy'])->middleware('auth');
Route::get('alerts/resolve/{id}', [AlertController::class, 'resolve'])->middleware('auth')->name('alerts.resolve');

Route::post('/auth/login', [AuthController::class, 'createSession'])->name('login');
Route::post('/auth/register', [AuthController::class, 'createUser'])->name('register');
Route::get('/auth/logout', [AuthController::class, 'logout'])->name('logout');
Route::get('/auth/login', [AuthController::class, 'showLoginForm'])->name('auth.show.login.form');
Route::get('/auth/register', [AuthController::class, 'showRegisterForm'])->name('auth.show.register.form');

Route::get('/excel/export/', [ExportsController::class, 'fuelTankExports']);
Route::get('/excel/export/tank-alerts/{tank}', [ExportsController::class, 'tankAlertsExport']);
Route::get('/excel/export/criticalLocations/{location}', [ExportsController::class, 'criticalLocations']);

Route::resource('users', UserController::class)->only('index', 'store', 'update', 'destroy')->middleware('auth');

require __DIR__ . '/del.php';