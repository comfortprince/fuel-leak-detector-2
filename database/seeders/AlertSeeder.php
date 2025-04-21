<?php

namespace Database\Seeders;

use App\Models\Alert;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AlertSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(){
        $user = User::with([
            'fuelTanks.alertPolicies',
            'fuelTanks.sensors'
        ])->first();
    
        foreach ($user->fuelTanks as $fuelTank) {
            $activePolicies = $fuelTank->alertPolicies->where('policy_status', 'active');
            if ($activePolicies->isEmpty()) continue;
    
            $sensors = $fuelTank->sensors;
            $sensorMap = $sensors->keyBy('id');
            $sensorIds = $sensorMap->keys();
    
            DB::table('sensor_readings')
                ->whereIn('sensor_id', $sensorIds)
                ->orderBy('recorded_at', 'desc')
                ->chunk(1000, function ($readingsChunk) use ($sensorMap, $activePolicies) {
                    $grouped = $readingsChunk->groupBy('recorded_at');
    
                    foreach ($grouped as $readings) {
                        $mq2Reading = $this->getReadingByType($readings, $sensorMap, 'mq2');
                        $bmp180Reading = $this->getReadingByType($readings, $sensorMap, 'bmp180');
    
                        if (!$mq2Reading || !$bmp180Reading) continue;
    
                        foreach ($activePolicies as $policy) {
                            $mq2Value = $mq2Reading->value;
                            $bmpValue = $bmp180Reading->value;
    
                            $mq2InRange = $mq2Value > $policy->mq2_min && $mq2Value < $policy->mq2_max;
                            $bmpInRange = $bmpValue > $policy->bmp180_min && $bmpValue < $policy->bmp180_max;
    
                            if ($mq2InRange && $bmpInRange) {
                                Alert::create([
                                    'alert_policy_id' => $policy->id,
                                    'mq2_reading_id' => $mq2Reading->id,
                                    'bmp180_reading_id' => $bmp180Reading->id,
                                    'triggered_at' => $bmp180Reading->recorded_at,
                                    'resolved' => false,
                                ]);
                            }
                        }
                    }
                });
    
            // break; // optional: only run for first tank
        }
    }

    private function getReadingByType($readings, $sensorMap, $type)
    {
        return $readings->first(function ($reading) use ($sensorMap, $type) {
            $sensor = $sensorMap[$reading->sensor_id] ?? null;
            return $sensor && $sensor->type === $type;
        });
    }
}
