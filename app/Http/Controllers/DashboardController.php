<?php

namespace App\Http\Controllers;

use App\Models\Alert;
use App\Models\SensorReading;
use App\Services\DashboardService;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function getDashboardData(DashboardService $dashboardService) {
        $user = Auth::user();
        $daysRange = request()->input('daysRange', 6);
        $tankSummaryLocation = request()->input('location', "");
        $startDate = Carbon::now();
        $endDate = (clone $startDate)->subDays($daysRange);
        
        return Inertia::render('Dashboard',[
            'auth' => $user,
            'tankStatusSummary' => $dashboardService->getTankSummary($user, $tankSummaryLocation),
            'activities' => $dashboardService->getActivities($user),
            'alertCounts' => $dashboardService->getAlertCounts($user),
            'locationStats' => $dashboardService->getLocationStats($user),
            'alertTrendsData' => [
                'filterState' => $daysRange,
                'data' => $dashboardService->getAggregateTrendsData($user->id, $startDate, $endDate)
            ]
        ]);
   }
}