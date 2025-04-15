<?php

namespace Database\Seeders;

use App\Models\Sensor;
use App\Models\SensorReading;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SensorReadingSeeder extends Seeder
{
    // Generate a normally distributed random number
    private function normalDistribution($mean, $stdDev)
    {
        $x = mt_rand() / mt_getrandmax();
        $y = mt_rand() / mt_getrandmax();
        
        return $stdDev * sqrt(-2 * log($x)) * cos(2 * M_PI * $y) + $mean;
    }

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sensors = Sensor::all();
        $now = Carbon::now();
        
        // Create readings for each sensor
        foreach ($sensors as $sensor) {
            $readings = [];
            $currentTime = clone $now;
            
            // Preffered num of readings = 17280

            // Generate 17,280 readings per sensor (10-minute intervals going backwards)
            for ($i = 0; $i < 1000; $i++) {
                // Generate somewhat realistic values with some natural variation
                if ($sensor->type === 'mq2') {
                    // MQ2 values (gas concentration): typically 5-20 with occasional spikes
                    $baseValue = 15.0;
                    $variation = $this->normalDistribution(0, 5);
                    
                    // Add a rare spike every now and then
                    $spike = (rand(1, 1000) > 995) ? rand(10, 60) : 0;
                    $value = max(0, min(100, $baseValue + $variation + $spike));
                } else {
                    // BMP180 values (pressure in bars): typically around 1-3 bars
                    $baseValue = 2.5;
                    $variation = $this->normalDistribution(0, 0.5);
                    $value = max(0.1, min(6.0, $baseValue + $variation));
                }
                
                $readings[] = [
                    'sensor_id' => $sensor->id,
                    'value' => round($value, 2),
                    'recorded_at' => $currentTime->format('Y-m-d H:i:s'),
                    'created_at' => $currentTime->format('Y-m-d H:i:s'),
                    'updated_at' => $currentTime->format('Y-m-d H:i:s'),
                ];
                
                // Move back 10 minutes
                $currentTime->subMinutes(10);
                
                // Save in chunks to avoid memory issues
                if (count($readings) >= 1000) {
                    SensorReading::insert($readings);
                    $readings = [];
                }
            }
            
            // Insert any remaining readings
            if (count($readings) > 0) {
                SensorReading::insert($readings);
            }
        }
    }
}
