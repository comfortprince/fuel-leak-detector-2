<?php

namespace App\Http\Controllers;

use App\Models\AlertPolicy;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AlertPolicyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function show(AlertPolicy $alertPolicy)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AlertPolicy $alertPolicy)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, AlertPolicy $alertPolicy)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AlertPolicy $alertPolicy)
    {
        $tank = $alertPolicy->fuelTank;

        if($tank->user_id !== Auth::id()){
            abort('403', 'Unauthorized');
        }

        AlertPolicy::destroy($alertPolicy->id);
        return to_route('tanks.show', $tank->id);
    }
}
