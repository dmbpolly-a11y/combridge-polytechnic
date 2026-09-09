<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckStatus
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check()) {
            return redirect()->route('login')->with('error', 'Please login to continue.');
        }

        $user = auth()->user();

        // Check if user account is active
        if ($user->status !== 'active') {
            auth()->logout();
            return redirect()->route('login')->with('error', 'Your account is ' . $user->status . '. Please contact administration.');
        }

        // Additional checks for students and teachers
        if ($user->student && $user->student->student_status !== 'active') {
            auth()->logout();
            return redirect()->route('login')->with('error', 'Your student account is ' . $user->student->student_status . '.');
        }

        if ($user->teacher && $user->teacher->teacher_status !== 'active') {
            auth()->logout();
            return redirect()->route('login')->with('error', 'Your teacher account is ' . $user->teacher->teacher_status . '.');
        }

        return $next($request);
    }
}
