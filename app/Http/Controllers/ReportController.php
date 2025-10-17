<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PostnatalVisit;
use App\Models\Vaccination;


class ReportController extends Controller
{
    public function postnatalVisits($id)
    {
        $visits = PostnatalVisit::where('hospital_id', $id)
            ->with(['mother', 'child']) // optional: eager load relationships
            ->orderBy('visit_date', 'desc')
            ->get();

        return response()->json($visits);
    }

    public function vaccineProgress($id)
    {
        $vaccines = Vaccination::where('hospital_id', $id)
            ->with(['child']) // optional: eager load child info
            ->get();

        // Optional: group by child or vaccine type
        $progress = $vaccines->groupBy('child_id')->map(function ($records) {
            return [
                'child_id' => $records->first()->child_id,
                'vaccines_received' => $records->pluck('vaccine_name'),
                'last_vaccine_date' => $records->max('date_given'),
            ];
        });

        return response()->json($progress);
    }
}
