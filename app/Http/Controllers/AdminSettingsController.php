<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\Setting;

class AdminSettingsController extends Controller
{
    public function edit()
    {
        /** @var \App\Models\User $admin */
        $admin = Auth::user();
        return view('admin.settings', compact('admin'));
    }

    public function update(Request $request)
    {
        /** @var \App\Models\User $admin */
        $admin = Auth::user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $admin->id,
            'password' => 'nullable|string|min:6|confirmed',
        ]);

        $admin->name = $validated['name'];
        $admin->email = $validated['email'];

        if (!empty($validated['password'])) {
            $admin->password = Hash::make($validated['password']);
        }

        $admin->save();

        return redirect()->route('admin.settings.edit')->with('success', 'Settings updated successfully.');
    }

    public function updateSettings(Request $request)
    {
        /** @var \App\Models\User $admin */
        $admin = Auth::user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $admin->id,
            'password' => 'nullable|string|min:6|confirmed',
            'session_timeout_minutes' => 'nullable|integer|min:1|max:1440',
        ]);

        $admin->name = $validated['name'];
        $admin->email = $validated['email'];

        if (!empty($validated['password'])) {
            $admin->password = Hash::make($validated['password']);
        }

        $admin->save();

        // Update session timeout setting if provided
        if (isset($validated['session_timeout_minutes'])) {
            Setting::updateOrCreate(
                ['key' => 'session_timeout_minutes'],
                ['value' => $validated['session_timeout_minutes']]
            );
        }

        return response()->json(['message' => 'Settings updated successfully.']);
    }

    public function getSettings()
    {
        /** @var \App\Models\User $admin */
        $admin = Auth::user();

        $timeout = Setting::where('key', 'session_timeout_minutes')->value('value') ?? 30;

        return response()->json([
            'name' => $admin->name,
            'email' => $admin->email,
            'session_timeout_minutes' => (int) $timeout,
        ]);
    }
}
