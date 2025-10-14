<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Appointment;

class AppointmentController extends Controller
{
    public function index(Request $request)
    {
        $profile = $request->user()->motherProfile;
        $child = $profile->children()->first();

        $appointments = Appointment::where('child_id', $child->id)
            ->where('date', '>=', now())
            ->orderBy('date')
            ->get(['date', 'type', 'location']);

        return response()->json($appointments);
    }
}
