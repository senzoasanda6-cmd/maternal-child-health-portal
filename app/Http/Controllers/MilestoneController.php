<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Milestone;

class MilestoneController extends Controller
{
    public function index(Request $request)
    {
        $profile = $request->user()->motherProfile;
        $child = $profile->children()->first();

        $milestones = Milestone::where('child_id', $child->id)
            ->get(['label', 'status']);

        return response()->json($milestones);
    }
}
