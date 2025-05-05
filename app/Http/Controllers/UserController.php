<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Validation\Rules;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        if(Auth::user()->role === null){
            return Inertia::render('Users/Index', [
                'users' => User::where('owner_id', Auth::user()->id)->get()
            ]);
        }

        if(Auth::user()->role === User::ROLE_ADMIN){
            return Inertia::render('Users/Index', [
                'users' => User::where('owner_id', Auth::user()->owner_id)->get()
            ]);
        }

        return Inertia::render('Users/Index', [
            'users' => []
        ]);
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
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => ['required', 'string', 'min:8', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|string|in:admin,IT'
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'owner_id' => Auth::user()->id,
            'role' => $validated['role']
        ]);

        return to_route('users.index');
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
    public function update(Request $request, User $user)
    {
        // Gate::define('edit-user', function (User $user, User $userToEdit) {
        //     // 1. If the user supervises the user we want to edit
        //     if ($user->id === $userToEdit->owner_id) {
        //         return true;
        //     }

        //     // 2. If user is admin and their supervisor also supervises the user to edit
        //     if (
        //         in_array($user->role, [User::ROLE_ADMIN]) &&
        //         $user->owner_id === $userToEdit->owner_id
        //     ) {
        //         return true;
        //     }

        //     return false;
        // });

        // Gate::authorize('edit-user', $user);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
            'password' => ['nullable', 'string', 'min:8', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|string|in:admin,IT'
        ]);

        $user->name = $validated['name'] ?? $user->name;
        $user->email = $validated['email'] ?? $user->email;
        $user->role = $validated['role'] ?? $user->role;

        if(!is_null($validated['password'])){
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        return to_route('users.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();
        return to_route('users.index');
    }
}
