<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Setting;

class CheckLoginDuration
{
    public function handle(Request $request, Closure $next)
{
    if (Auth::check()) {
        $loginTime = session('login_time');
        $timeout = Setting::where('key', 'session_timeout_minutes')->value('value') ?? 720;

        if ($loginTime && now()->diffInMinutes($loginTime) > (int) $timeout) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return response()->json([
                'error' => 'Session expired. Please log in again.'
            ], 401);
        }
    }

    return $next($request);
}
}
