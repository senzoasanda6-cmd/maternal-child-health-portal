<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\HealthRecord;

class HealthRecordController extends Controller
{
    public function index(Request $request)
    {
        $profile = $request->user()->motherProfile;
        $child = $profile->children()->first();

        $records = HealthRecord::where('child_id', $child->id)
            ->get(['title', 'details']);

        return response()->json($records);
    }
}
