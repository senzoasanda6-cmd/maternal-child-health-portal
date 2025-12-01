<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Child;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class ChildController extends Controller
{
    /**
     * Display a listing of the children for the authenticated mother.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $user = Auth::user();

        // Mothers should only see their own children.
        if ($user->role !== 'mother') {
            // For other roles, you might return an empty list or handle as per requirements.
            // Or throw an authorization error. For now, we restrict to mothers.
            return response()->json(['message' => 'This endpoint is for mothers only.'], 403);
        }

        $children = Child::where('mother_id', $user->id)->get();

        return response()->json($children);
    }

    /**
     * Store a newly created child in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('children')->where(function ($query) use ($user) {
                    return $query->where('mother_id', $user->id);
                }),
            ],
            'dob' => 'required|date',
            'gender' => 'required|in:Male,Female',
        ]);

        $child = Child::create([
            'mother_id' => $user->id,
            'name' => $validated['name'],
            'dob' => $validated['dob'],
            'gender' => $validated['gender'],
        ]);

        return response()->json($child, 201);
    }

    /**
     * Update the specified child in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Child  $child
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Child $child)
    {
        // Authorization: Ensure mother owns the child record
        if ($child->mother_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'dob' => 'sometimes|required|date',
            'gender' => 'sometimes|required|in:Male,Female',
        ]);

        $child->update($validated);

        return response()->json($child);
    }

    /**
     * Remove the specified child from storage.
     *
     * @param  \App\Models\Child  $child
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Child $child)
    {
        if ($child->mother_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $child->delete();

        return response()->json(null, 204);
    }
}