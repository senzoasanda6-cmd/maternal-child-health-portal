<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Facility;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DistrictSettingsController extends Controller
{
    /**
     * Get district settings.
     *
     * @group District Admin
     * @authenticated
     */
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        if ($user->role !== 'district_admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $districtName = $user->district;

        // Get district-wide settings
        $settings = [
            'district_name' => $districtName,
            'email' => $user->email,
            'phone' => $user->phone,
            'total_facilities' => Facility::where('district', $districtName)->count(),
            'notification_settings' => [
                'send_appointment_reminders' => true,
                'reminder_days_before' => 1,
                'send_high_risk_alerts' => true,
                'send_reports' => true,
                'report_frequency' => 'weekly', // weekly, monthly
            ],
        ];

        return response()->json($settings);
    }

    /**
     * Update district settings.
     *
     * @group District Admin
     * @authenticated
     */
    public function update(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        if ($user->role !== 'district_admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'phone' => 'sometimes|string|max:20',
            'notification_settings' => 'sometimes|array',
            'notification_settings.send_appointment_reminders' => 'sometimes|boolean',
            'notification_settings.reminder_days_before' => 'sometimes|integer|min:0|max:7',
            'notification_settings.send_high_risk_alerts' => 'sometimes|boolean',
            'notification_settings.send_reports' => 'sometimes|boolean',
            'notification_settings.report_frequency' => 'sometimes|in:weekly,monthly',
        ]);

        // Update user phone if provided
        if (isset($validated['phone'])) {
            $user->phone = $validated['phone'];
            $user->save();
        }

        // In a real app, you'd store notification settings in a settings table or user preferences
        // For now, we'll return them as-is

        return response()->json([
            'message' => 'Settings updated successfully',
            'settings' => $validated,
        ]);
    }

    /**
     * Get district profile.
     *
     * @group District Admin
     * @authenticated
     */
    public function profile()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        if ($user->role !== 'district_admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'district' => $user->district,
            'role' => $user->role,
            'created_at' => $user->created_at,
            'updated_at' => $user->updated_at,
        ]);
    }

    /**
     * Update district admin profile.
     *
     * @group District Admin
     * @authenticated
     */
    public function updateProfile(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        if ($user->role !== 'district_admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'phone' => 'sometimes|string|max:20',
            'current_password' => 'required_with:password',
            'password' => 'sometimes|string|min:8|confirmed',
        ]);

        // Verify current password if changing password
        if (isset($validated['password'])) {
            if (!\Illuminate\Support\Facades\Hash::check($validated['current_password'], $user->password)) {
                return response()->json(['error' => 'Current password is incorrect'], 422);
            }
            $validated['password'] = \Illuminate\Support\Facades\Hash::make($validated['password']);
            unset($validated['current_password']);
        }

        $user->update($validated);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user,
        ]);
    }
}
