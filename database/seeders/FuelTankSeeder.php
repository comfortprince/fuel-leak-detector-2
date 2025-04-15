<?php

namespace Database\Seeders;

use App\Models\FuelTank;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FuelTankSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $locations = [
            'North Facility', 
            'South Facility', 
            'East Warehouse', 
            'West Warehouse', 
            'Central Depot',
            'Terminal A'
        ];
        
        $user = User::first();
        
        foreach (range(1, 6) as $index) {
            FuelTank::create([
                'user_id' => $user->id,
                'tank_identifier' => 'TANK-' . str_pad($index, 3, '0', STR_PAD_LEFT),
                'location' => $locations[$index - 1],
            ]);
        }
    }
}
