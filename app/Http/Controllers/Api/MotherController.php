<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\MotherProfile;


class MotherController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // This method seems to be for a different flow.
        // The registration is handled by Auth controllers.
        // We can leave this empty or implement a profile creation for an existing user.
        return response()->json(['message' => 'Not implemented'], 501);
    }

    private function calculateTrimester($lmd)
    {
        $weeks = now()->diffInWeeks(Carbon::parse($lmd));
        if ($weeks < 13) return 'First';
        if ($weeks < 27) return 'Second';
        return 'Third';
    }


    /**
     * Display the specified resource.
     */
    public function show(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        // Ensure the user is a mother and load her profile and children
        if ($user->role !== 'mother') {
            return response()->json(['message' => 'User is not a mother.'], 403);
        }

        // Load the mother's profile and her children through the User model
        $user->load('motherProfile', 'children');

        return response()->json($user);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'dob' => 'sometimes|date',
            'contact' => 'sometimes|string|max:20',
            'address' => 'sometimes|string|max:255',
            'lastMenstrualDate' => 'sometimes|nullable|date',
        ]);

        // Update the User model's name
        if ($request->has('name')) {
            $user->update(['name' => $request->name]);
        }

        // Update or create the MotherProfile
        $profileData = $request->only(['dob', 'contact_number' => 'contact', 'address', 'last_menstrual_date']);
        $profileData = array_filter($profileData, fn($value) => !is_null($value));

        if (!empty($profileData)) {
            $user->motherProfile()->updateOrCreate(['user_id' => $user->id], $profileData);
        }

        // Reload the user with updated relations and return it
        $user->load('motherProfile', 'children');
        return response()->json($user);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        // Deleting the user will cascade delete related profiles/children if set up in migrations.
        $user->delete();

        return response()->json(['message' => 'Mother profile and user account deleted successfully']);
    }
}
