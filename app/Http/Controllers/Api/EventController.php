<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Event;
use App\Models\Facility;

class EventController extends Controller
{
    // GET /api/events
    public function index()
    {
        $events = Event::all();
        return response()->json($events);
    }

    // POST /api/events
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'start' => 'required|date',
            'end' => 'required|date|after:start',
            'care_type' => 'required|in:prenatal,postnatal',
            'facility_id' => 'nullable|exists:facilities,id',
            'status' => 'nullable|in:pending,confirmed,cancelled',
            'recurrence' => 'nullable|string',
            'recurrence_days' => 'nullable|array',
        ]);

        // Automatically fill facility_name
        if (isset($validated['facility_id'])) {
            $facility = Facility::find($validated['facility_id']);
            $validated['facility_name'] = $facility->name;
        }

        $event = Event::create($validated);
        return response()->json($event, 201);
    }

    // GET /api/events/{id}
    public function show(Event $event)
    {
        return response()->json($event);
    }

    // PUT /api/events/{id}
    public function update(Request $request, Event $event)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'start' => 'sometimes|date',
            'end' => 'sometimes|date|after:start',
            'care_type' => 'sometimes|in:prenatal,postnatal',
            'facility_id' => 'nullable|exists:facilities,id',
            'status' => 'nullable|in:pending,confirmed,cancelled',
            'recurrence' => 'nullable|string',
            'recurrence_days' => 'nullable|array',
        ]);

        // Update facility_name if facility_id changes
        if (isset($validated['facility_id'])) {
            $facility = Facility::find($validated['facility_id']);
            $validated['facility_name'] = $facility->name;
        }

        $event->update($validated);
        return response()->json($event);
    }

    // DELETE /api/events/{id}
    public function destroy(Event $event)
    {
        $event->delete();
        return response()->json(['message' => 'Event deleted successfully']);
    }
}
