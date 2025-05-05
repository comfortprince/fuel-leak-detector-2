<?php

namespace App\Http\Controllers;

use App\Models\AlertPolicy;
use App\Models\FuelTank;
use App\Models\Sensor;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Support\Str;

class FuelTankController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = null;

        if(Auth::user()->role === null){
            $user = Auth::user();
        }

        if(Auth::user()->role === User::ROLE_ADMIN || Auth::user()->role === User::ROLE_IT){
            $user = User::find(Auth::user()->owner_id);
        }

        $fuelTanks = $user->fuelTanks()
            ->with(['sensors', 'alertPolicies'])
            ->get();
        return Inertia::render('Tanks/Index',[
            'fuelTanks' => $fuelTanks
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Tanks/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $owner = null;

        if(Auth::user()->role !== null){
            $owner = Auth::user();   
        }else if(Auth::user()->role !== User::ROLE_ADMIN){
            $owner = User::findOrFail(Auth::user()->owner_id);
        }else{
            abort(403);
        }

        $validated = $request->validate([
            'tank_identifier' => 'required|string|max:255|unique:fuel_tanks,identifier',
            'tank_location' => 'required|string|max:255',
            'alert_policies' => 'array',
            'alert_policies.*.bmp180_min' => 'required|numeric',
            'alert_policies.*.bmp180_max' => 'required|numeric|gte:alert_policies.*.bmp180_min',
            'alert_policies.*.mq2_min' => 'required|numeric',
            'alert_policies.*.mq2_max' => 'required|numeric|gte:alert_policies.*.mq2_min',
            'alert_policies.*.alert_message' => 'required|string|max:255',
            'alert_policies.*.alert_type' => 'required|string|in:warning,critical,info',
            'alert_policies.*.policy_status' => 'required|string|in:active,inactive',
        ]);

        // Begin a database transaction to ensure data consistency
        DB::beginTransaction();

        try {
            $tank = FuelTank::create([
                'user_id' => $owner->id,
                'tank_identifier' => $validated['tank_identifier'],
                'location' => $validated['tank_location'],
            ]);

            $sensorTypes = ['mq2', 'bmp180'];
            foreach ($sensorTypes as $type) {
                Sensor::create([
                    'fuel_tank_id' => $tank->id,
                    'sensor_identifier' => Str::uuid()->toString(),
                    'type' => $type,
                ]);
            }

            foreach ($validated['alert_policies'] as $policyData) {
                AlertPolicy::create([
                    'fuel_tank_id' => $tank->id,
                    'mq2_min' => $policyData['mq2_min'],
                    'mq2_max' => $policyData['mq2_max'],
                    'bmp180_min' => $policyData['bmp180_min'],
                    'bmp180_max' => $policyData['bmp180_max'],
                    'alert_message' => $policyData['alert_message'],
                    'alert_type' => $policyData['alert_type'],
                    'policy_status' => $policyData['policy_status'],
                ]);
            }

            // Step 4: Commit the transaction
            DB::commit();

            return to_route('tanks.index')->with('success', 'Tank and associated data created successfully!');

        } catch (\Exception $e) {
            // Step 6: Rollback the transaction if something goes wrong
            DB::rollback();

            dd($e->getMessage());

            // Log the error for debugging
            Log::error('Error creating tank and associated data: ', ['error' => $e->getMessage()]);

            // Redirect back with an error message
            return back()->with('error', 'There was an error creating the tank and its associated data.');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(FuelTank $tank)
    {
        if(Auth::user()->role !== null){
            if(Auth::user()->role !== User::ROLE_ADMIN && Auth::user()->owner_id !== $tank->user_id){
                abort(403);
            }   
        }

        $tank->load(['sensors', 'alertPolicies']);

        return Inertia::render('Tanks/Show',[
            'fuelTank' => $tank
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(FuelTank $tank)
    {
        if(Auth::user()->role !== null){
            if(Auth::user()->role !== User::ROLE_ADMIN && Auth::user()->owner_id !== $tank->user_id){
                abort(403);
            }   
        }

        $tank->load(['sensors', 'alertPolicies']);

        return Inertia::render('Tanks/Edit',[
            'fuelTank' => $tank
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, FuelTank $tank)
    {
        if(Auth::user()->role !== null){
            if(Auth::user()->role !== User::ROLE_ADMIN && Auth::user()->owner_id !== $tank->user_id){
                abort(403);
            }   
        }

        $validated = $request->validate([
            'tank_identifier' => 'required|string|max:255|unique:fuel_tanks,identifier',
            'tank_location' => 'required|string|max:255',
            'alert_policies' => 'array',
            'alert_policies.*.id' => 'numeric',
            'alert_policies.*.bmp180_min' => 'required|numeric',
            'alert_policies.*.bmp180_max' => 'required|numeric|gte:alert_policies.*.bmp180_min',
            'alert_policies.*.mq2_min' => 'required|numeric',
            'alert_policies.*.mq2_max' => 'required|numeric|gte:alert_policies.*.mq2_min',
            'alert_policies.*.alert_message' => 'required|string|max:255',
            'alert_policies.*.alert_type' => 'required|string|in:warning,critical,info',
            'alert_policies.*.policy_status' => 'required|string|in:active,inactive',
        ]);

        // Begin a database transaction to ensure data consistency
        DB::beginTransaction();

        try {
            $tank->tank_identifier = $validated['tank_identifier'];
            $tank->location = $validated['tank_location'];

            $tank->save();

            foreach ($validated['alert_policies'] as $policyData) {
                $alertPolicy = AlertPolicy::find($policyData['id'] ?? null);

                if($alertPolicy === null) {
                    AlertPolicy::create([
                        'fuel_tank_id' => $tank->id,
                        'mq2_min' => $policyData['mq2_min'],
                        'mq2_max' => $policyData['mq2_max'],
                        'bmp180_min' => $policyData['bmp180_min'],
                        'bmp180_max' => $policyData['bmp180_max'],
                        'alert_message' => $policyData['alert_message'],
                        'alert_type' => $policyData['alert_type'],
                        'policy_status' => $policyData['policy_status'],
                    ]);
                } else {
                    $alertPolicy->fuel_tank_id = $tank->id;
                    $alertPolicy->mq2_min = $policyData['mq2_min'];
                    $alertPolicy->mq2_max = $policyData['mq2_max'];
                    $alertPolicy->bmp180_min = $policyData['bmp180_min'];
                    $alertPolicy->bmp180_max = $policyData['bmp180_max'];
                    $alertPolicy->alert_message = $policyData['alert_message'];
                    $alertPolicy->alert_type = $policyData['alert_type'];
                    $alertPolicy->policy_status = $policyData['policy_status'];

                    $alertPolicy->save();
                }
            }

            // Step 4: Commit the transaction
            DB::commit();

            return to_route('tanks.show', $tank->id)->with('success', 'Tank and associated data created successfully!');

        } catch (\Exception $e) {
            // Step 6: Rollback the transaction if something goes wrong
            DB::rollback();

            dd($e->getMessage());

            // Log the error for debugging
            Log::error('Error creating tank and associated data: ', ['error' => $e->getMessage()]);

            // Redirect back with an error message
            return back()->with('error', 'There was an error creating the tank and its associated data.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FuelTank $tank)
    {
        if(Auth::user()->role !== null){
            if(Auth::user()->role !== User::ROLE_ADMIN && Auth::user()->owner_id !== $tank->user_id){
                abort(403);
            }   
        }

        FuelTank::destroy($tank->id);

        return to_route('tanks.index');
    }
}
