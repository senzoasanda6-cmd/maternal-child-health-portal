<?php

namespace App\Http\Controllers\Api;

use App\Models\Mother;
use App\Http\Controllers\Controller;

class MotherDashboardController extends Controller
{
    public function show($id)
    {
        $mother = Mother::with([
            'children.growthRecords',
            'appointments',
            'milestones',
        ])->findOrFail($id);

        return response()->json($mother);
    }
}
