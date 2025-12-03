<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use App\Models\Child;

class ChildController extends Controller
{
    use AuthorizesRequests;

    /**
     * List all children associated with the authenticated user's mother profile.
     */
    public function index(Request $request)
    {
        $profile = $request->user()->motherProfile;

        if (!$profile) {
            return response()->json(['error' => 'Mother profile not found'], 404);
        }

        return response()->json($profile->children, 200);
    }

    /**
     * Store a new child under the authenticated user's mother profile.
     */
    public function store(Request $request)
    {
        $profile = $request->user()->motherProfile;

        if (!$profile) {
            return response()->json(['error' => 'Mother profile not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:children,name',
            'dob' => 'required|date',
            'age' => 'nullable|integer|min:0',
            'gender' => 'nullable|string|in:Male,Female',
        ]);

        $child = $profile->children()->create($validated);

        return response()->json($child, 201);
    }

    /**
     * Show a specific child profile.
     */
    public function show(Request $request, $id)
    {
        $profile = $request->user()->motherProfile;

        if (!$profile) {
            return response()->json(['error' => 'Mother profile not found'], 404);
        }

        $child = $profile->children()->find($id);

        if (!$child) {
            return response()->json(['error' => 'Child not found'], 404);
        }

        return response()->json([
            'id' => $child->id,
            'name' => $child->name,
            'dob' => $child->dob,
            'age' => $child->age,
            'gender' => $child->gender,
            'nextCheckup' => $child->next_checkup ?? 'Not scheduled',
            'growthStatus' => $child->growth_status ?? 'Unknown',
        ]);
    }

    /**
     * Update an existing child profile.
     */
    public function update(Request $request, Child $child)
    {
        $this->authorize('update', $child);

        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:children,name,' . $child->id,
            'dob' => 'required|date',
            'age' => 'nullable|integer|min:0',
            'gender' => 'nullable|string|in:Male,Female',
        ]);

        $child->update($validated);

        return response()->json($child);
    }

    /**
     * Delete a child profile.
     */
    public function destroy(Request $request, Child $child)
    {
        $this->authorize('delete', $child);

        $child->delete();

        return response()->json(['message' => 'Child deleted successfully']);
    }
}
