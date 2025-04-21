<?php

namespace App\Exports;

use App\Models\FuelTank;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class CriticalLocationsExport implements WithMultipleSheets
{
    protected $fuelTanks;

    public function __construct($location, $user) {
        $this->fuelTanks = FuelTank::where('user_id', $user->id)
            ->where('location', $location)
            ->get();
    }
    
    /**
     * @return array
     */
    public function sheets(): array {
        $sheets = [];
        
        foreach ($this->fuelTanks as $fuelTank) {
            $sheets[] = new TankAlertsExport($fuelTank);
        }
        
        return $sheets;
    }
}
