<?php

namespace App\Http\Controllers;

use App\Models\Alert;
use App\Models\SensorReading;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function getDashboardData() {
        // $fuelTanks = Auth::user()->fuelTanks()
        //        ->with(['sensors.sensorReadings', 'alertPolicies.alerts'])
        //        ->get();

        $fuelTanks = [];
        $alertData = $this->getAlertData();
   
        return Inertia::render('Dashboard',[
             'auth' => Auth::user(),
             'fuelTanks' => $fuelTanks,
             'alertTrendsData' => $alertData
        ]);
   }

   private function getAlertData() {
        $dates = SensorReading::select(DB::raw('DATE(recorded_at) as date'))
                ->distinct()
                ->orderBy('date', 'desc') // optional
                ->pluck('date');

        $ret = [];
        $retObj = [
            'date' => '',
            'critical' => 0,
            'warning' => 0,
            'info' => 0,
            'readingCount' => 0,
        ];

        foreach ($dates as $date) {
            $retObj['date'] = $date;

            $count = SensorReading::whereDate('recorded_at', $date)->count();
            $retObj['readingCount'] = $count;

            $alerts = Alert::whereHas('mq2Reading', function ($query) use ($date) {
                $query->whereDate('recorded_at', $date);
            })->get();

            $warningCount = $alerts->filter(function ($alert) {
                return $alert->alertPolicy->alert_type === 'warning';
            })->count();
            $retObj['warning'] = $warningCount;

            $criticalCount = $alerts->filter(function ($alert) {
                return $alert->alertPolicy->alert_type === 'critical';
            })->count();
            $retObj['critical'] = $criticalCount;

            $infoCount = $alerts->filter(function ($alert) {
                return $alert->alertPolicy->alert_type === 'info';
            })->count();
            $retObj['info'] = $infoCount;

            $ret[] = $retObj;

            $retObj['date'] = '';
            $retObj['readingCount'] = '';
            $retObj['warning'] = '';
            $retObj['critical'] = '';
            $retObj['info'] = '';
        }

        return $ret;
   }
}
