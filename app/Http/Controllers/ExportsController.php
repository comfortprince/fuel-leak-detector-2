<?php

namespace App\Http\Controllers;

use App\Exports\CriticalLocationsExport;
use App\Exports\FuelTankExport;
use App\Exports\TankAlertsExport;
use App\Models\FuelTank;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Facades\Excel;

class ExportsController extends Controller
{
    public function criticalLocations($location) {
        $fuelTank = FuelTank::first();
        Excel::download(new TankAlertsExport($fuelTank), "{$fuelTank->tank_identifier}.xlsx");
    }
    
    public function fuelTankExports () {
        return Excel::download(new FuelTankExport(FuelTank::all()), 'fuel_tank.xlsx');  
    }
}
