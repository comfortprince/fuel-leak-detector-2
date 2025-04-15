<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Laravel\Socialite\Facades\Socialite;

class SocialiteController extends Controller
{
    public function googleCallback () {
        $googleUser = Socialite::driver("google")->user();

        $user = User::updateOrCreate(
            ['google_id' => $googleUser->id],
            [
                'name' => $googleUser->name,
                'email' => $googleUser->email,
                'password' => 'password'
            ]
        );

        Auth::login($user);
        
        return redirect()->intended('dashboard');
    }

    public function normalLogin (Request $request): RedirectResponse {
        if (Auth::check()) {
            return redirect()->intended('dashboard');
        }
        
        $name = "Lynn";
        $email = "lynn.flds.system@gmail.com";
        $password = 'password';

        $user = User::updateOrCreate(
            ['email' => $email],
            [
                'name' => $name,
                'email' => $email,
                'password' => $password
            ]
        );

        Auth::login($user);
        
        return redirect()->intended('dashboard');
    }

    public function logout(Request $request): RedirectResponse {
        Auth::logout();
 
        $request->session()->invalidate();
    
        $request->session()->regenerateToken();
    
        return redirect('/');
    }

    public function googleRedirect () {
        return Socialite::driver("google")->redirect();
    }
}
