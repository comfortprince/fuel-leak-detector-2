<?php

namespace Database\Seeders;

use App\Models\AlertPolicy;
use App\Models\FuelTank;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AlertPolicySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $fuelTanks = FuelTank::all();
        
        foreach ($fuelTanks as $tank) {
            // Critical Alert Policy
            AlertPolicy::create([
                'fuel_tank_id' => $tank->id,
                'mq2_min' => 30,
                'mq2_max' => 70.0, // Critical if gas level goes above 70
                'bmp180_min' => 0.5, // Critical if pressure below 0.5
                'bmp180_max' => 5.0, // Critical if pressure above 5.0
                'alert_type' => 'critical',
                'policy_status' => 'active',
                'alert_message' => "CRITICAL: Unsafe conditions detected in tank {$tank->tank_identifier}",
            ]);
            
            // Warning Alert Policy
            AlertPolicy::create([
                'fuel_tank_id' => $tank->id,
                'mq2_min' => 20,
                'mq2_max' => 50.0, // Warning if gas level goes above 50
                'bmp180_min' => 0.8, // Warning if pressure below 0.8
                'bmp180_max' => 4.5, // Warning if pressure above 4.5
                'alert_type' => 'warning',
                'policy_status' => 'active',
                'alert_message' => "WARNING: Abnormal readings in tank {$tank->tank_identifier}",
            ]);
            
            // Info Alert Policy
            AlertPolicy::create([
                'fuel_tank_id' => $tank->id,
                'mq2_min' => 30,
                'mq2_max' => 30.0, // Info if gas level goes above 30
                'bmp180_min' => 1.0, // Info if pressure below 1.0
                'bmp180_max' => 4.0, // Info if pressure above 4.0
                'alert_type' => 'info',
                'policy_status' => 'active',
                'alert_message' => "INFO: Notable reading changes in tank {$tank->tank_identifier}",
            ]);
        }
    }
}
