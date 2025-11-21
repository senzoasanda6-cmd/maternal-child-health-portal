<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Facility;
use App\Models\Appointment;
use App\Models\Child;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DistrictReportsController extends Controller
{
    /**
     * Get district appointment statistics.
     *
     * @group District Admin
     * @authenticated
     *
     * @queryParam start_date Filter from date (Y-m-d)
     * @queryParam end_date Filter to date (Y-m-d)
     * @queryParam facility_id Filter by facility
     */
    public function appointmentStats(Request $request)
    {
        $user = Auth::user();

        if ($user->role !== 'district_admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $districtName = $user->district;
        $facilityIds = Facility::where('district', $districtName)->pluck('id');

        $query = Appointment::whereIn('facility_id', $facilityIds);

        // Date range filter
        if ($request->has('start_date')) {
            $query->whereDate('date', '>=', $request->query('start_date'));
        }
        if ($request->has('end_date')) {
            $query->whereDate('date', '<=', $request->query('end_date'));
        }

        // Facility filter
        if ($request->has('facility_id')) {
            $query->where('facility_id', $request->query('facility_id'));
        }

        $stats = [
            'total' => $query->count(),
            'by_status' => $query->selectRaw('status, count(*) as count')
                ->groupBy('status')
                ->pluck('count', 'status')
                ->toArray(),
            'by_phase' => $query->selectRaw('phase, count(*) as count')
                ->groupBy('phase')
                ->pluck('count', 'phase')
                ->toArray(),
            'high_risk' => $query->where('is_high_risk', true)->count(),
        ];

        return response()->json($stats);
    }

    /**
     * Get district visit trends.
     *
     * @group District Admin
     * @authenticated
     *
     * @queryParam start_date Filter from date (Y-m-d)
     * @queryParam end_date Filter to date (Y-m-d)
     */
    public function visitTrends(Request $request)
    {
        $user = Auth::user();

        if ($user->role !== 'district_admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $districtName = $user->district;
        $facilityIds = Facility::where('district', $districtName)->pluck('id');

        $query = Appointment::whereIn('facility_id', $facilityIds);

        if ($request->has('start_date')) {
            $query->whereDate('date', '>=', $request->query('start_date'));
        }
        if ($request->has('end_date')) {
            $query->whereDate('date', '<=', $request->query('end_date'));
        }

        $trends = $query->selectRaw('DATE(date) as date, count(*) as count')
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        return response()->json($trends);
    }

    /**
     * Get vaccination progress by facility.
     *
     * @group District Admin
     * @authenticated
     */
    public function vaccinationProgress(Request $request)
    {
        $user = Auth::user();

        if ($user->role !== 'district_admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $districtName = $user->district;
        $facilities = Facility::where('district', $districtName)
            ->with(['children' => function ($q) {
                $q->with('vaccinations');
            }])
            ->get();

        $data = $facilities->map(function ($facility) {
            $totalChildren = $facility->children->count();
            $vaccinated = 0;

            foreach ($facility->children as $child) {
                if ($child->vaccinations->count() > 0) {
                    $vaccinated++;
                }
            }

            return [
                'facility_id' => $facility->id,
                'facility_name' => $facility->name,
                'total_children' => $totalChildren,
                'vaccinated' => $vaccinated,
                'coverage' => $totalChildren > 0 ? round(($vaccinated / $totalChildren) * 100, 2) : 0,
            ];
        });

        return response()->json($data);
    }

    /**
     * Get high-risk cases report.
     *
     * @group District Admin
     * @authenticated
     *
     * @queryParam facility_id Filter by facility
     */
    public function highRiskCases(Request $request)
    {
        $user = Auth::user();

        if ($user->role !== 'district_admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $districtName = $user->district;
        $facilityIds = Facility::where('district', $districtName)->pluck('id');

        $query = Appointment::whereIn('facility_id', $facilityIds)
            ->where('is_high_risk', true);

        if ($request->has('facility_id')) {
            $query->where('facility_id', $request->query('facility_id'));
        }

        $cases = $query->with(['child', 'user', 'facility', 'healthWorker'])
            ->paginate(20)
            ->map(function ($appt) {
                return [
                    'id' => $appt->id,
                    'date' => $appt->date,
                    'time' => $appt->start_time,
                    'phase' => $appt->phase,
                    'status' => $appt->status,
                    'mother' => $appt->user?->name,
                    'child' => $appt->child?->name,
                    'facility' => $appt->facility?->name,
                    'health_worker' => $appt->healthWorker?->name,
                    'notes' => $appt->clinical_notes,
                ];
            });

        return response()->json($cases);
    }
}
