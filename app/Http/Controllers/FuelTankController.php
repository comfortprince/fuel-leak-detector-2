<?php

namespace App\Http\Controllers;

use App\Models\AlertPolicy;
use App\Models\FuelTank;
use App\Models\Sensor;
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
        $fuelTanks = Auth::user()->fuelTanks()
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
        $validated = $request->validate([
            'tank_identifier' => 'required|string|max:255|unique:fuel_tanks,identifier',
            'tank_location' => 'required|string|max:255',
            'alert_policies' => 'required|array',
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
                'user_id' => Auth::user()->id,
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
        if($tank->user_id !== Auth::id()){
            abort('403', 'Unauthorized');
        }

        $tank->load(['sensors', 'alertPolicies']);

        return Inertia::render('Tanks/Show',[
            'fuelTank' => $tank
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(FuelTank $fuelTank)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, FuelTank $fuelTank)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FuelTank $tank)
    {
        if($tank->user_id !== Auth::id()){
            abort('403', 'Unauthorized');
        }

        FuelTank::destroy($tank->id);

        return to_route('tanks.index');
    }
}
