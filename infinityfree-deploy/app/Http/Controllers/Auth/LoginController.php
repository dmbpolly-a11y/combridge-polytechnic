<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class LoginController extends Controller
{
    /**
     * Show the login form.
     */
    public function showLoginForm()
    {
        return view('auth.login');
    }

    /**
     * Handle a login request.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $credentials = $request->only('email', 'password');
        $remember = $request->filled('remember');

        if (Auth::attempt($credentials, $remember)) {
            $request->session()->regenerate();

            $user = Auth::user();

            // Check user status
            if ($user->status !== 'active') {
                Auth::logout();
                throw ValidationException::withMessages([
                    'email' => ['Your account is ' . $user->status . '. Please contact administration.'],
                ]);
            }

            // Redirect based on role
            return $this->redirectBasedOnRole($user);
        }

        throw ValidationException::withMessages([
            'email' => ['The provided credentials do not match our records.'],
        ]);
    }

    /**
     * Redirect user based on their role.
     */
    protected function redirectBasedOnRole($user)
    {
        if ($user->hasRole('administrator') || $user->hasRole('director')) {
            return redirect()->intended(route('dashboard'));
        }

        if ($user->hasRole('dean') || $user->hasRole('hod')) {
            return redirect()->intended(route('academic.dashboard'));
        }

        if ($user->hasRole('teacher')) {
            return redirect()->intended(route('teacher.dashboard'));
        }

        if ($user->hasRole('bursar')) {
            return redirect()->intended(route('fees.dashboard'));
        }

        if ($user->hasRole('librarian')) {
            return redirect()->intended(route('library.dashboard'));
        }

        if ($user->hasRole('student')) {
            return redirect()->intended(route('student.dashboard'));
        }

        return redirect()->intended(route('dashboard'));
    }

    /**
     * Log the user out.
     */
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login')->with('success', 'You have been logged out successfully.');
    }
}
