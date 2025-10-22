<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MotherProfile;

class HealthWorkerController extends Controller
{
    public function patients(Request $request)
    {
        $user = $request->user();

        // Ensure the user is a health worker
        if ($user->role !== 'health_worker') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Fetch mothers whose user account is linked to the same facility
        $patients = MotherProfile::whereHas('user', function ($query) use ($user) {
            $query->where('facility_id', $user->facility_id);
        })->with('children')->get();

        return response()->json($patients);
    }
    public function visitTrends(Request $request, $id)
    {
        $department = $request->query('department');

        $query = \App\Models\PostnatalVisit::selectRaw('MONTH(visit_date) as month, COUNT(*) as count')
            ->where('facility_id', $id)
            ->whereYear('visit_date', now()->year);

        if ($department && $department !== 'All') {
            $query->where('department', $department);
        }

        $visits = $query->groupBy('month')->orderBy('month')->get();

        $months = collect(range(1, 12))->map(fn($m) => date('M', mktime(0, 0, 0, $m, 10)));
        $counts = $months->map(fn($label, $index) => optional($visits->firstWhere('month', $index + 1))->count ?? 0);

        return response()->json([
            'months' => $months,
            'counts' => $counts,
        ]);
    }
}
