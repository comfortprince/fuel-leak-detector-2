<?php

namespace App\Http\Controllers;

use App\Models\Alert;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AlertController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $locationFilter = request()->input('location', null);
        $tankFilter = request()->input('fuelTank', null);

        $user = null;
        $alerts = null;

        if(Auth::user()->role === null){
            $user = Auth::user();
        }

        if(Auth::user()->role === User::ROLE_ADMIN || Auth::user()->role === User::ROLE_IT){
            $user = User::find(Auth::user()->owner_id);
        }

        if ($locationFilter && $tankFilter) {
            $alerts = Alert::with(['alertPolicy.fuelTank', 'mq2Reading', 'bmp180Reading'])
                ->whereHas('alertPolicy.fuelTank', function ($query) use($user, $locationFilter, $tankFilter) {
                    $query->where('user_id', $user->id)
                        ->where('location', $locationFilter)
                        ->where('tank_identifier', $tankFilter);
                })
                ->paginate(10);
        } else if ($locationFilter) {
            $alerts = Alert::with(['alertPolicy.fuelTank', 'mq2Reading', 'bmp180Reading'])
                ->whereHas('alertPolicy.fuelTank', function ($query) use($user, $locationFilter) {
                    $query->where('user_id', $user->id)
                        ->where('location', $locationFilter);
                })
                ->paginate(10);
        } else if ($tankFilter) {
            $alerts = Alert::with(['alertPolicy.fuelTank', 'mq2Reading', 'bmp180Reading'])
                ->whereHas('alertPolicy.fuelTank', function ($query) use($user, $tankFilter) {
                    $query->where('user_id', $user->id)
                        ->where('tank_identifier', $tankFilter);
                })
                ->paginate(10);
        } else {
            $alerts = Alert::with(['alertPolicy.fuelTank', 'mq2Reading', 'bmp180Reading'])
                ->whereHas('alertPolicy.fuelTank', function ($query) use($user) {
                    $query->where('user_id', $user->id);
                })
                ->paginate(10);
        }

        $locations = $user->fuelTanks()->select('location')->distinct()->get()->pluck('location')->toArray();
        $tanksPerLocation = null;

        if($locationFilter){
            $tanksPerLocation = $user->fuelTanks()->where('location', $locationFilter)->distinct()->get()->pluck('tank_identifier');
        }else{
            $tanksPerLocation = $user->fuelTanks()->get()->pluck('tank_identifier');
        }

        return Inertia::render('Alerts/Index',[
            'alertsData' => $alerts,
            'locations' => $locations,
            'tanksPerLocation' => $tanksPerLocation
        ]);
    }

    public function resolve($id)
    {
        $alert = Alert::findOrFail($id);
        $alert->resolved = 1;
        $alert->save();
        return to_route('alerts.index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
