<?php

namespace App\Http\Controllers;

use App\Models\PostnatalBooking;
use Illuminate\Http\Request;

class CalendarEventController extends Controller
{
    public function index()
    {
        $bookings = PostnatalBooking::where('is_approved', true)->get();

        $events = $bookings->map(function ($booking) {
            return [
                'title' => $booking->fullName,
                'start' => $booking->preferredDate . 'T' . $booking->preferredTime,
                'extendedProps' => [
                    'location' => $booking->location,
                    'reason' => $booking->reason,
                ]
            ];
        });

        return response()->json($events);
    }
}

