<?php

namespace App\Http\Controllers;

use App\Models\PostnatalVisit;
use Illuminate\Http\Request;

class PostnatalVisitController extends Controller
{
    public function index($childId)
    {
        return PostnatalVisit::where('child_id', $childId)->orderBy('visit_date')->get();
    }

    public function store(Request $request, $childId)
    {
        $request->validate([
            'visit_date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        $visit = PostnatalVisit::create([
            'child_id' => $childId,
            'visit_date' => $request->visit_date,
            'notes' => $request->notes,
        ]);

        return response()->json($visit, 201);
    }
}
