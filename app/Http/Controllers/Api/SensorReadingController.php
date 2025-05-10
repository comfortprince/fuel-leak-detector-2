<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\FldsAlert;
use App\Models\Alert;
use App\Models\AlertPolicy;
use App\Models\FuelTank;
use App\Models\Sensor;
use App\Models\SensorReading;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class SensorReadingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Inline validation
        $validated = $request->validate([
            'tank_identifier' => 'required|string|exists:fuel_tanks,tank_identifier',
            'sensor_readings' => 'required|array|min:2|max:2',
            'sensor_readings.*.sensor_identifier' => 'required|string|exists:sensors,sensor_identifier',
            'sensor_readings.*.value' => 'required|numeric',
            'sensor_readings.*.timestamp' => 'required|date',
        ]);

        // Get the tank
        $tank = FuelTank::where('tank_identifier', $validated['tank_identifier'])->first();
        $savedReadings = [];
        $readingsByType = [];

        foreach ($validated['sensor_readings'] as $reading) {
            // Get the sensor that belongs to the tank
            $sensor = Sensor::where('sensor_identifier', $reading['sensor_identifier'])
                            ->where('fuel_tank_id', $tank->id)
                            ->first();

            if (!$sensor) {
                // If a sensor is invalid, return early
                return response()->json([
                    'status' => 'error',
                    'message' => "Sensor '{$reading['sensor_identifier']}' not found for tank '{$tank->identifier}'."
                ], 404);
            }

            // Save the reading
            $sensorReading = SensorReading::create([
                'sensor_id' => $sensor->id,
                'value' => $reading['value'],
                'recorded_at' => $reading['timestamp'],
            ]);

            $savedReadings[] = $sensorReading;

            $readingsByType[$sensor->type] = [
                'sensor' => $sensor,
                'reading' => $sensorReading,
            ];
        }

        // Step 2: Check for alert trigger
        $mq2 = $readingsByType['mq2'];
        $bmp = $readingsByType['bmp180'];

        if ($mq2 && $bmp) {
            $mq2Value = $mq2['reading']->value;
            $bmpValue = $bmp['reading']->value;

            $activePolicies = AlertPolicy::where('fuel_tank_id', $tank->id)
                                ->where('policy_status', 'active')
                                ->get();

            foreach ($activePolicies as $policy) {
                $mq2InRange = ($mq2Value > $policy->mq2_min)
                                && ($mq2Value < $policy->mq2_max);

                $bmpInRange = ($bmpValue > $policy->bmp180_min)
                                && ($bmpValue < $policy->bmp180_max);

                if ($mq2InRange && $bmpInRange) {
                    // Trigger alert (link to one of the readings, or both if needed)
                    $alert = Alert::create([
                        'alert_policy_id' => $policy->id,
                        'mq2_reading_id' => $mq2['reading']->id, // or bmp['reading']->id
                        'bmp180_reading_id' => $bmp['reading']->id, // or mq2['reading']->id
                        'triggered_at' => now(),
                        'resolved' => false,
                    ]);

                    // Send Alert Emails
                    $owner = $tank->user;
                    $ownerEmail = $owner->email;
                    $subordinateEmails = $owner->surbodinates()->pluck('email')->toArray();
                    Mail::to([$ownerEmail, ...$subordinateEmails])->send(new FldsAlert($alert));
                }
            }
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Sensor readings stored successfully.',
            'data' => $savedReadings,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
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
