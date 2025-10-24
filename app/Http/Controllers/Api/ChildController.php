<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Child;

class ChildController extends Controller
{
    // List all children with optional filters and related counts
    public function index(Request $request)
    {
        $query = Child::with('mother');

        if ($request->filled('mother_id')) {
            $query->where('mother_id', $request->mother_id);
        }

        if ($request->filled('gender')) {
            $query->where('gender', $request->gender);
        }

        if ($request->filled('name')) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }

        return response()->json(
            $query->withCount(['vaccinations', 'appointments', 'postnatalVisits'])
                ->orderBy('name')
                ->get()
        );
    }

    // Store a new child
    public function store(Request $request)
    {
        $child = Child::create($this->validateRequest($request));
        return response()->json($child, 201);
    }

    // Show a single child with related data
    public function show(Child $child)
    {
        $child->load(['mother', 'vaccinations', 'appointments', 'postnatalVisits']);
        return response()->json($child);
    }

    // Update a child
    public function update(Request $request, Child $child)
    {
        $child->update($this->validateRequest($request, $update = true));
        return response()->json($child);
    }

    // Delete a child
    public function destroy(Child $child)
    {
        $child->delete();
        return response()->json(['message' => 'Child deleted successfully']);
    }

    // Dashboard: summary for a child
    public function dashboard(Child $child)
    {
        $child->load(['mother']);

        return response()->json([
            'id' => $child->id,
            'name' => $child->name,
            'dob' => $child->dob,
            'gender' => $child->gender,
            'mother' => $child->mother,
            'vaccinations_count' => $child->vaccinations()->count(),
            'appointments_count' => $child->appointments()->count(),
            'postnatal_visits_count' => $child->postnatalVisits()->count(),
        ]);
    }

    // Private method for validation
    private function validateRequest(Request $request, bool $update = false): array
    {
        $rules = [
            'name' => $update ? 'sometimes|string' : 'required|string',
            'dob' => $update ? 'sometimes|date' : 'required|date',
            'gender' => $update ? 'sometimes|in:male,female' : 'required|in:male,female',
            'mother_id' => $update ? 'sometimes|exists:mothers,id' : 'required|exists:mothers,id',
        ];

        return $request->validate($rules);
    }
}
