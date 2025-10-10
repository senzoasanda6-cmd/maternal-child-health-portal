<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Visit;
use App\Models\Appointment;
use App\Models\Child;
use App\Http\Resources\AppointmentResource;

class DashboardController extends Controller
{
    public function lastVisit(Request $request)
    {
        $user = Auth::user();

        $visit = Visit::where('user_id', $user->id)
            ->latest()
            ->first();

        return response()->json($visit);
    }

    public function appointments(Request $request)
    {
        $childId = $request->query('child_id');

        if ($childId) {
            $child = Child::where('id', $childId)
                ->where('user_id', Auth::id())
                ->first();

            if (!$child) {
                return response()->json(['error' => 'Child not found or unauthorized'], 403);
            }

            $appointments = Appointment::where('child_id', $childId)
                ->with('child') // eager-load child relationship
                ->orderBy('date')
                ->get();

            return response()->json([
                'child' => [
                    'id' => $child->id,
                    'name' => $child->name,
                    'birth_date' => $child->birth_date,
                    'gender' => $child->gender,
                ],
                'appointments' => $appointments,
            ]);
        }

        return response()->json([
            'child' => null,
            'appointments' => [
                ['date' => '2025-10-15', 'type' => 'Vaccination'],
                ['date' => '2025-10-20', 'type' => 'Follow-up Visit'],
            ],
        ]);
    }

    public function pregnancyStage(Request $request)
    {
        return response()->json([
            'title' => 'Third Trimester',
            'description' => 'Prepare for delivery and monitor fetal movement.'
        ]);
    }
}
