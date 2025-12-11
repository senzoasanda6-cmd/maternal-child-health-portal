<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        $request->session()->regenerate(); // ✅ Important for session tracking
        $request->session()->put('login_time', now()); // ✅ Track login timestamp

        // Also create a personal access token for API use (useful for programmatic tests)
        /** @var \App\Models\User $user */
        $user = Auth::user(); // Add type hint for static analysis
        if (method_exists($user, 'createToken')) {
            $token = $user->createToken('api-token')->plainTextToken;
        } else {
            $token = null;
        }

        return response()->json([
            'user' => $user,
            'token' => $token,
            'message' => 'Login successful',
        ]);
    }
}
