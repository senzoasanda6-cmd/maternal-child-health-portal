<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Hospital;

class HospitalController extends Controller
{
    public function index()
    {
        return Hospital::withCount(['patients', 'appointments'])->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
        ]);

        $hospital = Hospital::create($validated);

        return response()->json($hospital, 201);
    }

    public function show($id)
    {
        return Hospital::with(['patients', 'appointments'])->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $hospital = Hospital::findOrFail($id);

        $hospital->update($request->only(['name', 'location']));

        return response()->json($hospital);
    }

    public function destroy($id)
    {
        $hospital = Hospital::findOrFail($id);
        $hospital->delete();

        return response()->json(['message' => 'Hospital deleted']);
    }
    public function summary()
    {
        return Hospital::select('id', 'name', 'location')
            ->withCount(['patients', 'appointments'])
            ->orderBy('name')
            ->get();
    }
    public function dashboard($id)
    {
        $hospital = Hospital::with(['patients', 'appointments'])->findOrFail($id);

        $visitsCount = \App\Models\PostnatalVisit::where('hospital_id', $id)->count();

        return response()->json([
            'id' => $hospital->id,
            'name' => $hospital->name,
            'location' => $hospital->location,
            'patients_count' => $hospital->patients->count(),
            'appointments_count' => $hospital->appointments->count(),
            'visits_count' => $visitsCount,
        ]);
    }
    public function search(Request $request)
    {
        $query = Hospital::query();

        if ($request->filled('name')) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }

        if ($request->filled('location')) {
            $query->where('location', 'like', '%' . $request->location . '%');
        }

        return $query->withCount(['patients', 'appointments'])->get();
    }
}
