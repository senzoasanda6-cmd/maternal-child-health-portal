<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class MotherAuthController extends Controller
{
    /**
     * Register a new mother and log her in.
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'email'       => 'required|email|unique:users,email',
            'password'    => 'required|min:6|confirmed',
            'facility_id' => 'required|exists:facilities,id',
            'comments'    => 'nullable|string',
        ]);

        $user = User::create([
            'name'        => $validated['name'],
            'email'       => $validated['email'],
            'password'    => Hash::make($validated['password']),
            'facility_id' => $validated['facility_id'],
            'role'        => 'mother',
        ]);

        $token = $user->createToken('mother_auth')->plainTextToken;

        return response()->json([
            'message' => 'Mother registered successfully.',
            'user'    => $user,
            'token'   => $token,
        ], 201);
    }

    /**
     * Login mother
     */
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)
            ->where('role', 'mother')
            ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials.'], 401);
        }

        $token = $user->createToken('mother_auth')->plainTextToken;

        return response()->json([
            'message' => 'Login successful.',
            'user'    => $user,
            'token'   => $token,
        ], 200);
    }
    /**
     * Calculate trimester based on last menstrual date.
     */
    private function calculateTrimester($lmd)
    {
        $weeks = now()->diffInWeeks(\Carbon\Carbon::parse($lmd));
        if ($weeks < 13) return 'First';
        if ($weeks < 27) return 'Second';
        return 'Third';
    }
}
