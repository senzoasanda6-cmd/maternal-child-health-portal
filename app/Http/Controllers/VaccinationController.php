<?php

namespace App\Http\Controllers;

use App\Models\Vaccination;
use Illuminate\Http\Request;

class VaccinationController extends Controller
{
    public function index($childId)
    {
        return Vaccination::where('child_id', $childId)->orderBy('date')->get();
    }

    public function store(Request $request, $childId)
    {
        $request->validate([
            'vaccine_name' => 'required|string',
            'date' => 'required|date',
        ]);

        $vaccination = Vaccination::create([
            'child_id' => $childId,
            'vaccine_name' => $request->vaccine_name,
            'date' => $request->date,
        ]);

        return response()->json($vaccination, 201);
    }
}
