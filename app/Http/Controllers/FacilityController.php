<?php

namespace App\Http\Controllers;

use App\Models\Facility;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;


class FacilityController extends Controller
{
    use AuthorizesRequests;
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Facility::query();

        if (in_array($user->role, ['hospital_admin', 'facility_admin', 'facility_manager'])) {
            $query->where('id', $user->facility_id);
        } elseif ($user->role === 'district_admin') {
            $query->where('district_id', $user->district_id);
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('district')) {
            $query->where('district_id', $request->district);
        }

        return response()->json(
            $query->withCount(['mothers', 'appointments'])->orderBy('name')->get()
        );
    }

    public function show(Request $request, Facility $facility)
    {
        $this->authorize('view', $facility);
        $facility->load(['mothers', 'appointments']);
        return response()->json($facility);
    }

    public function update(Request $request, Facility $facility)
    {
        $this->authorize('update', $facility);
        $validated = $this->validateRequest($request, true);
        $facility->update($validated);
        return response()->json($facility);
    }

    public function destroy(Facility $facility)
    {
        $this->authorize('delete', $facility);
        $facility->delete();
        return response()->json(['message' => 'Facility deleted successfully']);
    }

    public function dashboard(Request $request, Facility $facility)
    {
        $this->authorize('view', $facility);
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
