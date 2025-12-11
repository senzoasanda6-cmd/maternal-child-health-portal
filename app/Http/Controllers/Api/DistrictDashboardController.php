<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Facility;
use App\Models\Appointment;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DistrictDashboardController extends Controller
{
    /**
     * Get district dashboard statistics.
     *
     * @group District Admin
     * @authenticated
     *
     * @response 200
     * {
     *   "stats": {
     *     "totalFacilities": 5,
     *     "totalHealthWorkers": 23,
     *     "flaggedCases": 12,
     *     "scheduledAppointments": 45,
     *     "completedAppointments": 120,
     *     "cancelledAppointments": 8,
     *     "highRiskAppointments": 15
     *   },
     *   "facilities": [
     *     {
     *       "id": 1,
     *       "name": "Mango Hill Clinic",
     *       "type": "clinic",
     *       "monthly_visits": 45,
     *       "risk_flags": 3
     *     }
     *   ]
     * }
     */
    public function index()
    {
        $user = Auth::user();

        if ($user->role !== 'district_admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $districtName = $user->district;

        // Get all facilities in district
        $facilities = Facility::where('district', $districtName)->pluck('id');

        // Get stats
        $stats = [
            'totalFacilities' => count($facilities),
            'totalHealthWorkers' => User::whereIn('facility_id', $facilities)
                ->whereIn('role', ['health_worker', 'midwife', 'nurse', 'doctor'])
                ->count(),
            'flaggedCases' => Appointment::whereIn('facility_id', $facilities)
                ->where('is_high_risk', true)
                ->count(),
            'scheduledAppointments' => Appointment::whereIn('facility_id', $facilities)
                ->where('status', 'scheduled')
                ->count(),
            'completedAppointments' => Appointment::whereIn('facility_id', $facilities)
                ->where('status', 'completed')
                ->count(),
            'cancelledAppointments' => Appointment::whereIn('facility_id', $facilities)
                ->where('status', 'cancelled')
                ->count(),
            'highRiskAppointments' => Appointment::whereIn('facility_id', $facilities)
                ->where('is_high_risk', true)
                ->count(),
        ];

        // Get facility performance data
        $facilitiesData = Facility::where('district', $districtName)
            ->withCount([
                'appointments as monthly_visits' => function ($q) {
                    $q->whereMonth('date', now()->month);
                },
                'appointments as risk_flags' => function ($q) {
                    $q->where('is_high_risk', true);
                }
            ])
            ->get()
            ->map(function ($facility) {
                return [
                    'id' => $facility->id,
                    'name' => $facility->name,
                    'type' => $facility->type,
                    'monthly_visits' => $facility->monthly_visits_count ?? 0,
                    'risk_flags' => $facility->risk_flags_count ?? 0,
                ];
            });

        return response()->json([
            'stats' => $stats,
            'facilities' => $facilitiesData,
        ]);
    }
}
