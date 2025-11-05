<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    /**
     * Display the authenticated admin's profile.
     */
    public function profile(Request $request)
    {
        $admin = Auth::user();

        if ($admin->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return response()->json($admin);
    }

    /**
     * Update the authenticated admin's profile.
     */
    public function update(Request $request)
    {
        $admin = Auth::user();

        if ($admin->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $admin->id,
        ]);
        /** @var \App\Models\User $admin */
        $admin = Auth::user();


        $admin->update($validated);

        return response()->json($admin);
    }
}
