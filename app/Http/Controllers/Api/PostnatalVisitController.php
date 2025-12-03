<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Child;
use App\Models\PostnatalVisit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PostnatalVisitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($childId)
    {
        // Ensure the visits are for the specified child
        $visits = PostnatalVisit::where('child_id', $childId)->with('mother')->latest()->get();
        return response()->json($visits);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, $childId)
    {
        $child = Child::findOrFail($childId);

        $validator = Validator::make($request->all(), [
            'visit_date' => 'required|date',
            'weight' => 'nullable|numeric',
            'blood_pressure' => 'nullable|string|max:20',
            'temperature' => 'nullable|numeric',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validatedData = $validator->validated();
        $validatedData['child_id'] = $child->id;
        $validatedData['mother_id'] = $child->mother_id;

        $visit = PostnatalVisit::create($validatedData);

        return response()->json([
            'message' => 'Postnatal visit recorded successfully.',
            'visit' => $visit
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(PostnatalVisit $postnatalVisit)
    {
        // The 'postnatalVisit' is injected via route model binding
        return response()->json($postnatalVisit->load('mother'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PostnatalVisit $postnatalVisit)
    {
        $validator = Validator::make($request->all(), [
            'visit_date' => 'sometimes|required|date',
            'weight' => 'nullable|numeric',
            'blood_pressure' => 'nullable|string|max:20',
            'temperature' => 'nullable|numeric',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $postnatalVisit->update($validator->validated());

        return response()->json([
            'message' => 'Postnatal visit updated successfully.',
            'visit' => $postnatalVisit
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PostnatalVisit $postnatalVisit)
    {
        $postnatalVisit->delete();

        return response()->json(['message' => 'Postnatal visit deleted successfully.']);
    }
}