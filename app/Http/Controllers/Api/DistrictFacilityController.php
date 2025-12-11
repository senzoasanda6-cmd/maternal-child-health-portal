<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Facility;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DistrictFacilityController extends Controller
{
    /**
     * Display a list of facilities belonging to the authenticated district admin's district.
     *
     * @group District Admin
     * @authenticated
     * 
     * @response 200
     * [
     *   {
     *     "id": 1,
     *     "name": "Mango Hill Clinic",
     *     "type": "clinic",
     *     "location": "Mango Hill",
     *     "monthly_visits": 124,
     *     "risk_flags": 3
     *   }
     * ]
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        // Ensure only district admins can access this endpoint
        if ($user->role !== 'district_admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $districtId = $user->district_id;

        // Optional filtering by type or risk (if frontend adds query params)
        $query = Facility::where('district_id', $districtId)
            ->withCount([
                'appointments as monthly_visits' => function ($q) {
                    $q->whereMonth('date', now()->month);
                },
                'appointments as risk_flags' => function ($q) {
                    $q->where('is_high_risk', true);
                }
            ]);

        if ($request->has('type')) {
            $query->where('type', $request->query('type'));
        }

        if ($request->has('min_risk')) {
            $query->having('risk_flags_count', '>=', (int)$request->query('min_risk'));
        }

        $facilities = $query->get()->map(function ($facility) {
            return [
                'id' => $facility->id,
                'name' => $facility->name,
                'type' => $facility->type,
                'location' => $facility->location,
                // withCount aliases generate attributes with a `_count` suffix
                'monthly_visits' => $facility->monthly_visits_count ?? 0,
                'risk_flags' => $facility->risk_flags_count ?? 0,
            ];
        });

        return response()->json($facilities);
    }
    /**
     * Export district facilities data to CSV.
     *
     * @group District Admin
     * @authenticated
     *
     * @response CSV file
     */
    public function export(Request $request)
    {
         $user = Auth::user();

        if ($user->role !== 'district_admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $districtId = $user->district_id;

        $query = Facility::where('district_id', $districtId)
            ->withCount([
                'visits as monthly_visits' => fn($q) => $q->whereMonth('date', now()->month),
                'riskFlags'
            ]);

        // Optional filters
        if ($request->has('type')) {
            $query->where('type', $request->query('type'));
        }

        if ($request->has('min_risk')) {
            $query->having('risk_flags_count', '>=', (int) $request->query('min_risk'));
        }

        $facilities = $query->get();

        // Build CSV content
        $headers = ['Name', 'Type', 'Location', 'Monthly Visits', 'Risk Flags'];
        $rows = $facilities->map(fn($f) => [
            $f->name,
            $f->type,
            $f->location,
            $f->monthly_visits,
            $f->risk_flags_count,
        ]);

        $handle = fopen('php://temp', 'r+');
        fputcsv($handle, $headers);
        foreach ($rows as $row) {
            fputcsv($handle, $row);
        }
        rewind($handle);
        $csv = stream_get_contents($handle);
        fclose($handle);

        $filename = 'district_facilities_' . now()->format('Y_m_d_His') . '.csv';

        return response($csv)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', "attachment; filename={$filename}");
    }
}
