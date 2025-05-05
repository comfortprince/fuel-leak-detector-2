<?php

namespace App\Exports;

use App\Models\FuelTank;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class CriticalLocationsExport implements WithMultipleSheets
{
    protected $fuelTanks;
    private $startDate;
    private $endDate;

    public function __construct($location, $user, $startDate, $endDate) {
        $this->fuelTanks = FuelTank::where('user_id', $user->id)
            ->where('location', $location)
            ->get();
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }
    
    /**
     * @return array
     */
    public function sheets(): array {
        $sheets = [];
        
        foreach ($this->fuelTanks as $fuelTank) {
            $sheets[] = new TankAlertsExport($fuelTank, $this->startDate, $this->endDate);
        }
        
        return $sheets;
    }
}
