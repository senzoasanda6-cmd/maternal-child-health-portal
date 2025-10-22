<?php

namespace App\Http\Controllers;

use App\Models\Facility;
use Illuminate\Http\Request;

class FacilityController extends Controller
{
    public function index(Request $request)
    {
        $query = Facility::query();

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('district')) {
            $query->where('district', $request->district);
        }

        return response()->json($query->orderBy('name')->get());
    }
    public function show($id)
    {
        $facility = Facility::findOrFail($id);

        if (!$facility) {
            return response()->json(['error' => 'Facility not found'], 404);
        }

        return response()->json($facility);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'title' => 'nullable|string|max:255',
            'district' => 'required|string|max:255',
            'sub_district' => 'nullable|string|max:255',
            'type' => 'required|string|max:255',
            'level_of_care' => 'nullable|string|max:255',
        ]);

        $facility = Facility::create($validated);

        return response()->json($facility, 201);
    }

    public function update(Request $request, $id)
    {
        $facility = Facility::findOrFail($id);

        if (!$facility) {
            return response()->json(['error' => 'Facility not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'title' => 'nullable|string|max:255',
            'district' => 'required|string|max:255',
            'sub_district' => 'nullable|string|max:255',
            'type' => 'required|string|max:255',
            'level_of_care' => 'nullable|string|max:255',
        ]);

        $facility->update($validated);

        return response()->json($facility);
    }
    public function destroy($id)
    {
        $facility = Facility::findOrFail($id);

        if (!$facility) {
            return response()->json(['error' => 'Facility not found'], 404);
        }

        $facility->delete();

        return response()->json(['message' => 'Facility deleted']);
    }
    public function dashboard($id)
    {
        $facility = Facility::with(['patients', 'appointments'])->findOrFail($id);

        $visitsCount = \App\Models\PostnatalVisit::where('facility_id', $id)->count();

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

        return $query->withCount(['patients', 'appointments'])->get();
    }
}
