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
}
