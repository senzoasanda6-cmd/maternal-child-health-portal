<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Facility;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class DistrictUsersController extends Controller
{
    /**
     * Get all health workers in district facilities.
     *
     * @group District Admin
     * @authenticated
     *
     * @queryParam role Filter by role (health_worker, midwife, nurse, doctor)
     * @queryParam facility_id Filter by facility
     * @queryParam search Search by name or email
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        if ($user->role !== 'district_admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $districtName = $user->district;

        // Get facility IDs in this district
        $facilityIds = Facility::where('district', $districtName)->pluck('id');

        $query = User::whereIn('facility_id', $facilityIds)
            ->whereIn('role', ['health_worker', 'midwife', 'nurse', 'doctor']);

        // Filter by role
        if ($request->has('role')) {
            $query->where('role', $request->query('role'));
        }

        // Filter by facility
        if ($request->has('facility_id')) {
            $query->where('facility_id', $request->query('facility_id'));
        }

        // Search by name or email
        if ($request->has('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->with('facility')
            ->paginate(15)
            ->map(function ($u) {
                return [
                    'id' => $u->id,
                    'name' => $u->name,
                    'email' => $u->email,
                    'role' => $u->role,
                    'sub_role' => $u->sub_role,
                    'facility' => $u->facility?->name,
                    'facility_id' => $u->facility_id,
                    'created_at' => $u->created_at,
                ];
            });

        return response()->json($users);
    }

    /**
     * Show health worker details.
     *
     * @group District Admin
     * @authenticated
     */
    public function show($id)
    {
        $user = Auth::user();

        if ($user->role !== 'district_admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $districtName = $user->district;
        $facilityIds = Facility::where('district', $districtName)->pluck('id');

        $worker = User::whereIn('facility_id', $facilityIds)->findOrFail($id);

        return response()->json([
            'id' => $worker->id,
            'name' => $worker->name,
            'email' => $worker->email,
            'role' => $worker->role,
            'sub_role' => $worker->sub_role,
            'facility' => $worker->facility,
            'phone' => $worker->phone,
            'created_at' => $worker->created_at,
            'updated_at' => $worker->updated_at,
        ]);
    }

    /**
     * Update health worker details.
     *
     * @group District Admin
     * @authenticated
     */
    public function update(Request $request, $id)
    {
        $user = Auth::user();

        if ($user->role !== 'district_admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $districtName = $user->district;
        $facilityIds = Facility::where('district', $districtName)->pluck('id');

        $worker = User::whereIn('facility_id', $facilityIds)->findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'phone' => 'sometimes|string|max:20',
            'role' => 'sometimes|string|in:health_worker,midwife,nurse,doctor',
            'sub_role' => 'sometimes|string|max:100',
        ]);

        $worker->update($validated);

        return response()->json([
            'message' => 'Health worker updated successfully',
            'data' => $worker,
        ]);
    }

    /**
     * Delete health worker.
     *
     * @group District Admin
     * @authenticated
     */
    public function destroy($id)
    {
        $user = Auth::user();

        if ($user->role !== 'district_admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $districtName = $user->district;
        $facilityIds = Facility::where('district', $districtName)->pluck('id');

        $worker = User::whereIn('facility_id', $facilityIds)->findOrFail($id);
        $worker->delete();

        return response()->json(['message' => 'Health worker deleted successfully']);
    }
}
