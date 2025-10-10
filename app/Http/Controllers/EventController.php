<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index(Request $request)
    {
        // Example static data — replace with DB query later
        $events = [
            ['title' => 'Prenatal Visit', 'date' => '2025-10-12'],
            ['title' => 'Vaccination', 'date' => '2025-10-18'],
        ];

        return response()->json($events);
    }
}

