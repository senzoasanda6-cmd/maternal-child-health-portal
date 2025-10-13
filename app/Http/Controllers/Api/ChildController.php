<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Child;


class ChildController extends Controller
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
            'name' => 'required|string',
            'dob' => 'required|date',
            'gender' => 'required|in:male,female',
            'mother_id' => 'required|exists:mothers,id',
        ]);

        $child = Child::create([
            'name' => $request->name,
            'dob' => $request->dob,
            'gender' => $request->gender,
            'mother_id' => $request->mother_id,
        ]);

        return response()->json($child, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $child = Child::with('mother')->findOrFail($id);
        return response()->json($child);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'name' => 'string',
            'dob' => 'date',
            'gender' => 'in:male,female',
            'mother_id' => 'exists:mothers,id',
        ]);

        $child = Child::findOrFail($id);
        $child->update($request->only(['name', 'dob', 'gender', 'mother_id']));

        return response()->json($child);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $child = Child::findOrFail($id);
        $child->delete();

        return response()->json(['message' => 'Child deleted successfully']);
    }
}
