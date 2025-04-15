<?php

namespace Database\Seeders;

use App\Models\FuelTank;
use App\Models\Sensor;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class SensorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $fuelTanks = FuelTank::all();
        
        foreach ($fuelTanks as $tank) {
            // Create one MQ2 sensor
            Sensor::create([
                'fuel_tank_id' => $tank->id,
                'sensor_identifier' => Str::uuid()->toString(),
                'type' => 'mq2',
            ]);
            
            // Create one BMP180 sensor
            Sensor::create([
                'fuel_tank_id' => $tank->id,
                'sensor_identifier' => Str::uuid()->toString(),
                'type' => 'bmp180',
            ]);
        }
    }
}
