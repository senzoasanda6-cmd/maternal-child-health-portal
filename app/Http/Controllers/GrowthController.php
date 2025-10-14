<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\GrowthRecord;

class GrowthController extends Controller
{
    public function index(Request $request)
    {
        $profile = $request->user()->motherProfile;
        $child = $profile->children()->first();

        $records = GrowthRecord::where('child_id', $child->id)
            ->orderBy('date')
            ->get(['date', 'height', 'weight']);

        return response()->json($records);
    }
}
