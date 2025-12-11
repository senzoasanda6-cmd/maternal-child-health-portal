<?php

namespace App\Http\Controllers\Api;

use App\Models\Mother;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class MotherDashboardController extends Controller
{
    public function show(Request $request)
    {
        $mother = $request->user(); // Authenticated mother

        $mother->load([
            'children.growthRecords',
            'children.milestones',
            'children.records',
            'appointments',
        ]);

        return response()->json($mother);
    }

    public function children(Request $request)
    {
        $mother = $request->user();

        $children = $mother->children()->with([
            'growthRecords',
            'milestones',
            'records',
            'appointments',
        ])->get();

        return response()->json($children);
    }
}
