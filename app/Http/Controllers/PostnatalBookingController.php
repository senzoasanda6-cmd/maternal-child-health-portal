<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PostnatalBooking;
use Illuminate\Support\Facades\Mail;
use App\Mail\PostnatalBookingNotification;
use App\Mail\PostnatalBookingConfirmation;
use App\Mail\RescheduleConfirmation;

class PostnatalBookingController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'fullName' => 'required|string|max:255',
            'preferredDate' => 'required|date|after_or_equal:today',
            'preferredTime' => 'required',
            'location' => 'required|string',
            'reason' => 'required|string',
            'email' => 'required|email'
        ]);

        $booking = PostnatalBooking::create($validated);

        Mail::to('admin@yourclinic.com')->send(new PostnatalBookingNotification($booking));
        Mail::to($booking->email)->send(new PostnatalBookingConfirmation($booking));

        return response()->json(['message' => 'Booking received']);
    }

    public function show($id)
    {
        $booking = PostnatalBooking::findOrFail($id);
        return response()->json($booking);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'preferredDate' => 'required|date|after_or_equal:today',
            'preferredTime' => 'required',
            'rescheduleReason' => 'required|string|max:1000'
        ]);

        $booking = PostnatalBooking::findOrFail($id);
        $booking->update([
            'preferredDate' => $validated['preferredDate'],
            'preferredTime' => $validated['preferredTime'],
            'reschedule_reason' => $validated['rescheduleReason'],
            'reschedule_approved' => false
        ]);

        Mail::to($booking->email)->send(new RescheduleConfirmation($booking));

        return response()->json(['message' => 'Booking updated']);
    }
}
