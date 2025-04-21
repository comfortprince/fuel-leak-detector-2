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
        // Preffered num of readings = 17280
        foreach ($sensors as $sensor) {
            $readings = [];
            $currentTime = clone $now;

            for ($i = 0; $i < 34560; $i++) {
                if ($sensor->type === 'mq2') {
                    $baseValue = 500;
                    $variation = $this->normalDistribution(0, 400);
                    $spike = (rand(1, 1000) > 980) ? rand(1000, 9499) : 0;
                    $value = max(200, min(10000, $baseValue + $variation + $spike));
                } else {
                    $baseValue = 90000;
                    $variation = $this->normalDistribution(0, 10000);
                    $spike = (rand(1, 1000) > 950) ? rand(10000, 80000) : 0;
                    $value = max(30000, min(110000, $baseValue + $variation - $spike));
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
