<?php

namespace App\Http\Controllers;

use App\Exports\CriticalLocationsExport;
use App\Exports\FuelTankExport;
use App\Exports\TankAlertsExport;
use App\Models\FuelTank;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Facades\Excel;

class ExportsController extends Controller
{
    public function criticalLocations($location) {
        $start = Carbon::parse(request()->input('startDate'))->format('Y-m-d H:i:s');
        $end   = Carbon::parse(request()->input('endDate'))->format('Y-m-d H:i:s');

        return Excel::download(new CriticalLocationsExport($location, Auth::user(), $start, $end), "{$location}.xlsx");
    }
    
    public function fuelTankExports () {
        return Excel::download(new FuelTankExport(FuelTank::all()), 'fuel_tank.xlsx');  
    }

    public function tankAlertsExport(FuelTank $tank) {
        // dd($tank->toArray());
        return Excel::download(new TankAlertsExport($tank), "{$tank->tank_identifier}.xlsx");
    }
}
