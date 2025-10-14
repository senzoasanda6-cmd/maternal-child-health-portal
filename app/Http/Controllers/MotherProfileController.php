<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MotherProfile;
use Illuminate\Support\Facades\DB;

class MotherProfileController extends Controller
{
    /**
     * Display the authenticated user's mother profile.
     */
    public function show(Request $request)
    {
        $profile = $request->user()->motherProfile;

        if (!$profile) {
            $profile = MotherProfile::create([
                'user_id' => $request->user()->id,
                'name' => $request->user()->name,
                'dob' => now()->subYears(30)->toDateString(),
                'contact' => '',
                'address' => '',
                'children' => [],
            ]);
        }

        return response()->json($profile);
    }


    /**
     * Update the authenticated user's mother profile.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'dob' => 'required|date',
            'contact' => 'required|string|max:50',
            'address' => 'required|string|max:255',
            'children' => 'nullable|array',
            'children.*.name' => 'required|string|max:100',
            'children.*.dob' => 'required|date',
        ]);

        // Normalize and trim child names
        $submittedNames = array_map(fn($child) => strtolower(trim($child['name'])), $validated['children'] ?? []);

        // Check for duplicates within the submitted array
        if (count($submittedNames) !== count(array_unique($submittedNames))) {
            return response()->json(['error' => 'Duplicate child names in submission are not allowed.'], 422);
        }

        // Check for duplicates across all profiles
        $existingNames = MotherProfile::pluck('children')->flatten(1)
            ->map(fn($child) => strtolower(trim($child['name'])))
            ->filter(fn($name) => in_array($name, $submittedNames))
            ->values();

        if ($existingNames->isNotEmpty()) {
            return response()->json([
                'error' => 'One or more child names already exist in another profile.',
                'conflicts' => $existingNames
            ], 422);
        }

        // Clean and save
        $validated['children'] = array_map(function ($child) {
            return [
                'name' => trim($child['name']),
                'dob' => $child['dob'],
            ];
        }, $validated['children'] ?? []);

        $profile = $request->user()->motherProfile;

        if (!$profile) {
            return response()->json(['error' => 'Profile not found'], 404);
        }

        $profile->update($validated);

        return response()->json([
            'message' => 'Profile updated successfully',
            'profile' => $profile
        ]);
    }



    /**
     * Delete the authenticated user's mother profile.
     */
    public function destroy(Request $request)
    {
        $profile = $request->user()->motherProfile;

        if (!$profile) {
            return response()->json(['error' => 'Profile not found'], 404);
        }

        $profile->delete();

        return response()->json(['message' => 'Profile deleted successfully']);
    }
}
