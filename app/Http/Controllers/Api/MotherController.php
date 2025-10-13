<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Mother;
use Carbon\Carbon;


class MotherController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'fullName' => 'required|string',
            'dob' => 'required|date',
            'contactNumber' => 'required|string',
            'address' => 'required|string',
            'lastMenstrualDate' => 'required|date',
        ]);

        $trimester = $this->calculateTrimester($request->lastMenstrualDate);

        $mother = Mother::create([
            'name' => $request->fullName,
            'dob' => $request->dob,
            'contact_number' => $request->contactNumber,
            'address' => $request->address,
            'last_menstrual_date' => $request->lastMenstrualDate,
            'trimester' => $trimester,
        ]);

        return response()->json($mother, 201);
    }

    private function calculateTrimester($lmd)
    {
        $weeks = now()->diffInWeeks(Carbon::parse($lmd));
        if ($weeks < 13) return 'First';
        if ($weeks < 27) return 'Second';
        return 'Third';
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $mother = Mother::with('children')->findOrFail($id);
        return response()->json($mother);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'fullName' => 'string',
            'dob' => 'date',
            'contactNumber' => 'string',
            'address' => 'string',
            'lastMenstrualDate' => 'date',
        ]);

        $mother = Mother::findOrFail($id);

        $mother->update([
            'name' => $request->fullName ?? $mother->name,
            'dob' => $request->dob ?? $mother->dob,
            'contact_number' => $request->contactNumber ?? $mother->contact_number,
            'address' => $request->address ?? $mother->address,
            'last_menstrual_date' => $request->lastMenstrualDate ?? $mother->last_menstrual_date,
            'trimester' => $request->lastMenstrualDate
                ? $this->calculateTrimester($request->lastMenstrualDate)
                : $mother->trimester,
        ]);

        return response()->json($mother);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $mother = Mother::findOrFail($id);
        $mother->delete();

        return response()->json(['message' => 'Mother deleted successfully']);
    }
}
