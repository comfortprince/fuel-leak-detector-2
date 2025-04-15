<?php

namespace Database\Seeders;

use App\Models\Alert;
use App\Models\AlertPolicy;
use App\Models\Sensor;
use App\Models\SensorReading;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AlertSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $alertPolicies = AlertPolicy::all();
        $now = Carbon::now();
        $ninetyDaysAgo = (clone $now)->subDays(90);
        
        // Count of alerts based on type (rarer for more severe types)
        $alertCounts = [
            'info' => rand(7, 12),
            'warning' => rand(3, 6),
            'critical' => rand(1, 3),
        ];
        
        foreach ($alertPolicies as $policy) {
            $tankId = $policy->fuel_tank_id;
            $mq2Sensor = Sensor::where('fuel_tank_id', $tankId)
                              ->where('type', 'mq2')
                              ->first();
            $bmp180Sensor = Sensor::where('fuel_tank_id', $tankId)
                                 ->where('type', 'bmp180')
                                 ->first();
            
            // Generate alerts - number depends on alert type
            $alertCount = $alertCounts[$policy->alert_type];
            
            for ($i = 0; $i < $alertCount; $i++) {
                // Random time within the last 90 days
                $days = rand(1, 90);
                $hours = rand(0, 23);
                $minutes = rand(0, 59);
                $alertTime = (clone $now)->subDays($days)->setTime($hours, $minutes);
                
                // Find readings around this time
                $mq2Reading = SensorReading::where('sensor_id', $mq2Sensor->id)
                                          ->where('recorded_at', '<=', $alertTime)
                                          ->orderBy('recorded_at', 'desc')
                                          ->first();
                
                $bmp180Reading = SensorReading::where('sensor_id', $bmp180Sensor->id)
                                             ->where('recorded_at', '<=', $alertTime)
                                             ->orderBy('recorded_at', 'desc')
                                             ->first();
                
                if ($mq2Reading && $bmp180Reading) {
                    Alert::create([
                        'alert_policy_id' => $policy->id,
                        'mq2_reading_id' => $mq2Reading->id,
                        'bmp180_reading_id' => $bmp180Reading->id,
                        'triggered_at' => $alertTime,
                        'resolved' => rand(0, 100) > 30, // 70% chance of being resolved
                    ]);
                }
            }
        }
    }
}
