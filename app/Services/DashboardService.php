<?php

namespace App\Services;

use App\Models\Alert;
use App\Models\AlertPolicy;
use App\Models\FuelTank;
use App\Models\SensorReading;
use Carbon\Carbon;
use Illuminate\Support\Str;

class DashboardService 
{
    /**
     * @param string $userId
     * @param integer $daysFilter
     * @return array "array of daily alert and sensor reading aggregates"
     */
    public function getAggregateTrendsData($userId, $startDate, $endDate) {
        $readings = SensorReading::whereHas('sensor.fuelTank.user', function ($query) use($userId) {
            $query->where('id', $userId);
        })
        ->whereBetween('recorded_at', [$endDate, $startDate])
        ->selectRaw('DATE(recorded_at) as date, COUNT(*) as reading_count')
        ->orderBy('date', 'desc')
        ->groupByRaw('DATE(recorded_at)')
        ->pluck('reading_count', 'date');

        $alerts = Alert::whereHas('alertPolicy.fuelTank.user', function ($query) use($userId) {
            $query->where('id', $userId);
        })
        ->whereBetween('triggered_at', [$endDate, $startDate])
        ->orderBy('triggered_at', 'desc')
        ->whereHas('alertPolicy')
        ->with('alertPolicy')
        ->get()
        ->groupBy(function ($alert) {
            $date = Carbon::parse($alert->triggered_at);
            return $date->toDateString();
        })->map(function ($alertsForDay) {
            return [
                'critical' => $alertsForDay->where('alertPolicy.alert_type', 'critical')->count(),
                'warning'  => $alertsForDay->where('alertPolicy.alert_type', 'warning')->count(),
                'info'     => $alertsForDay->where('alertPolicy.alert_type', 'info')->count(),
            ];
        });

        $ret = [];

        foreach ($readings as $date => $readingCount) {
            $ret[] = [
                'date' => $date,
                'readingCount' => $readingCount,
                'critical' => $alerts[$date]['critical'] ?? 0,
                'warning' => $alerts[$date]['warning'] ?? 0,
                'info' => $alerts[$date]['info'] ?? 0,
            ];
        }

        return $ret;
    }

    /**
     * @param
     * @return
     */
    public function getActivities($user) {
        $latestReadings = SensorReading::whereHas('sensor.fuelTank', function ($query) use($user) {
            $query->where('user_id', $user->id);
        })
            ->orderBy('recorded_at', 'desc')
            ->limit(1)
            ->get();
    
        $latestAlerts = Alert::whereHas('alertPolicy.fuelTank', function ($query) use($user) {
            $query->where('user_id', $user->id);
        })
            ->orderBy('triggered_at', 'desc')
            ->limit(2)
            ->get();
    
        $merged = $latestAlerts->merge($latestReadings)->sortByDesc(function ($item) {
            return $item->triggered_at ?? $item->recorded_at;
        })->values();
    
        $ret = $merged->map(function ($item, $index) {
            if ($item instanceof Alert) {
                $alertType = Str::ucfirst($item->alertPolicy->alert_type);
                return [
                    'id' => $index,
                    'type' => 'alert',
                    'description' => "{$alertType} alert triggered on {$item->alertPolicy->fuelTank->tank_identifier}",
                    'tankId' => $item->alertPolicy->fuelTank->tank_identifier,
                    'timestamp' => $item->triggered_at
                ];
            } elseif ($item instanceof SensorReading) {
                return [
                    'id' => $index,
                    'type' => 'reading',
                    'description' => "Reading recorded on {$item->sensor->fuelTank->tank_identifier}",
                    'tankId' => $item->sensor->fuelTank->tank_identifier,
                    'timestamp' => $item->recorded_at
                ];
            }
        });

        return $ret;
    }

    public function getLocationStats ($user) {
        $locationStats = FuelTank::with('alertPolicies.alerts')
            ->where('user_id', $user->id)
            ->select('id', 'location', 'tank_identifier')
            ->get()
            ->groupBy('location')
            ->map(function ($group, $index) {
                return [
                    'id' => $index,
                    'location' => $group->first()->location,
                    'alertCount' => 0, 
                    'riskLevel' => '',
                    'tanks' => $group->pluck('tank_identifier')->toArray()
                ];
            })
            ->toArray();
        
        foreach ($locationStats as $locationStat) {
            $location = $locationStat['location'];
            $unresolvedAlerts = Alert::with('alertPolicy')
            ->whereHas('alertPolicy.fuelTank', function ($query) use($user, $location) {
                $query->where('user_id', $user->id)
                    ->where('location', $location);
            })
            ->where('resolved', false)
            ->get();
            
            $alertTypes = $unresolvedAlerts->pluck('alertPolicy.alert_type')->unique();
            $alertCount = $unresolvedAlerts->count();
            
            $riskLevel = '';
            if ($alertCount > 0) {
                if ($alertTypes->contains('critical')) {
                    $riskLevel = 'high';
                } elseif ($alertTypes->contains('warning')) {
                    $riskLevel = 'medium';
                } else {
                    $riskLevel = 'low';
                }
            }

            $locationStats[$location]['alertCount'] = $alertCount;
            $locationStats[$location]['riskLevel'] = $riskLevel;
        }
        
        return array_values($locationStats);
    }

    /**
     * 
     */
    public function getAlertCounts ($user) {
        $alertCounts = Alert::whereHas('alertPolicy.fuelTank', function ($query) use($user) {
            $query->where('user_id', $user->id);
        })
            ->join('alert_policies', 'alert_policy_id', '=', 'alert_policies.id')
            ->selectRaw('alert_type, COUNT(*) as count')
            ->groupBy('alert_type')
            ->pluck('count', 'alert_type');
    
        return [
            'critical' => $alertCounts->get('critical', 0),
            'warning' => $alertCounts->get('warning', 0),
            'info' => $alertCounts->get('info', 0)
        ];
    }

    public function getTankSummary($user, $location = '') {
        $totalTanks = 0;
        $tanksWithAlerts = 0;
        $locations = [];

        if ($location) {
            $totalTanks = $user->fuelTanks()->where('location', $location)->count();
            $tanksWithAlerts = $user->fuelTanks()
                ->whereHas('alertPolicies.alerts', function ($query) {
                    $query->where('resolved', false);
                })
                ->where('location', $location)->count();
            $locations[] = $location;
        } else {
            $totalTanks = $user->fuelTanks()->count();
            $tanksWithAlerts = $user->fuelTanks()
                ->whereHas('alertPolicies.alerts', function ($query) {
                    $query->where('resolved', false);
                })->count();
            $locations = $user->fuelTanks->pluck('location')->values()->unique();
        }

        
        return [
            'totalTanks' => $totalTanks,
            'tanksWithAlerts' => $tanksWithAlerts,
            'locations' => $locations
        ];
    }
}