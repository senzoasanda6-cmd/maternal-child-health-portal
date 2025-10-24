<?php

namespace App\Http\Controllers;

use App\Models\Facility;
use Illuminate\Http\Request;

class FacilityController extends Controller
{
    // List all facilities with optional filters
    public function index(Request $request)
    {
        $query = Facility::query();

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('district')) {
            $query->where('district', $request->district);
        }

        return response()->json(
            $query->withCount(['mothers', 'appointments'])
                ->orderBy('name')
                ->get()
        );
    }

    // Show a single facility with related data
    public function show(Facility $facility)
    {
        $facility->load(['mothers', 'appointments']);
        return response()->json($facility);
    }

    // Store a new facility
    public function store(Request $request)
    {
        $validated = $this->validateRequest($request);
        $facility = Facility::create($validated);

        return response()->json($facility, 201);
    }

    // Update a facility
    public function update(Request $request, Facility $facility)
    {
        $validated = $this->validateRequest($request, true);
        $facility->update($validated);

        return response()->json($facility);
    }

    // Delete a facility
    public function destroy(Facility $facility)
    {
        $facility->delete();
        return response()->json(['message' => 'Facility deleted successfully']);
    }

    // Dashboard: summary for a facility
    public function dashboard(Facility $facility)
    {
        $facility->load(['mothers', 'appointments']);

        $visitsCount = \App\Models\PostnatalVisit::where('facility_id', $facility->id)->count();

        return response()->json([
            'id' => $facility->id,
            'name' => $facility->name,
            'district' => $facility->district,
            'sub_district' => $facility->sub_district,
            'patients_count' => $facility->patients->count(),
            'appointments_count' => $facility->appointments->count(),
            'visits_count' => $visitsCount,
        ]);
    }

    // Search facilities by name, district, sub_district
    public function search(Request $request)
    {
        $query = Facility::query();

        if ($request->filled('name')) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }

        if ($request->filled('district')) {
            $query->where('district', 'like', '%' . $request->district . '%');
        }

        if ($request->filled('sub_district')) {
            $query->where('sub_district', 'like', '%' . $request->sub_district . '%');
        }

        return $query->withCount(['mothers', 'appointments'])->get();
    }

    // Private method for validation
    private function validateRequest(Request $request, bool $update = false): array
    {
        $rules = [
            'name' => $update ? 'sometimes|string|max:255' : 'required|string|max:255',
            'title' => 'nullable|string|max:255',
            'district' => $update ? 'sometimes|string|max:255' : 'required|string|max:255',
            'sub_district' => 'nullable|string|max:255',
            'type' => $update ? 'sometimes|string|max:255' : 'required|string|max:255',
            'level_of_care' => 'nullable|string|max:255',
        ];

        return $request->validate($rules);
    }
}
