<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\PersonalAccessToken;
class MotherLoginController extends Controller
{
    /**
     * Log in a mother.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        // Only mothers can log in here
        $user = User::where('email', $request->email)
            ->where('role', 'mother')
            ->first();

        if (!$user) {
            return response()->json([
                'message' => 'No mother account found with this email.'
            ], 404);
        }

        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials.'
            ], 401);
        }

        // Issue Sanctum token
        $token = $user->createToken('mother_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful.',
            'user'    => $user,
            'token'   => $token
        ]);
    }

    /**
     * Logout a mother by revoking current token.
     */
    

    public function logout(Request $request)
    {
        // Check if the user is authenticated via an API token
        if ($request->user() && $request->user()->currentAccessToken()) {
            $request->user()->currentAccessToken()->delete();
        } 
        // Else, if the user is authenticated via the web guard (session)
        else if (Auth::guard('web')->check()) {
            Auth::guard('web')->logout();
    
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        return response()->json(['message' => 'Logged out successfully.']);
    }
}
