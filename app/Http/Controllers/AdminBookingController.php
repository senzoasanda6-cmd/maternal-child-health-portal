<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PostnatalBooking;
use Illuminate\Support\Facades\Mail;
use App\Mail\RescheduleApproved;
use App\Mail\RescheduleRejected;

class AdminBookingController extends Controller
{
    /**
     * Get all bookings with pending reschedule requests.
     */
    public function pendingReschedules()
    {
        $bookings = PostnatalBooking::whereNotNull('reschedule_reason')
            ->where('reschedule_approved', false)
            ->whereNull('reschedule_rejected_reason')
            ->get();

        return response()->json($bookings);
    }

    /**
     * Approve a reschedule request and notify the user.
     */
    public function approveReschedule($id)
    {
        $booking = PostnatalBooking::findOrFail($id);
        $booking->reschedule_approved = true;
        $booking->reschedule_rejected_reason = null;
        $booking->save();

        Mail::to($booking->email)->send(new RescheduleApproved($booking));

        return response()->json(['message' => 'Reschedule approved']);
    }

    /**
     * Reject a reschedule request with a reason and notify the user.
     */
    public function rejectReschedule(Request $request, $id)
    {
        $request->validate([
            'reason' => 'required|string|max:1000'
        ]);

        $booking = PostnatalBooking::findOrFail($id);
        $booking->reschedule_approved = false;
        $booking->reschedule_rejected_reason = $request->reason;
        $booking->save();

        Mail::to($booking->email)->send(new RescheduleRejected($booking));

        return response()->json(['message' => 'Reschedule rejected']);
    }
}
