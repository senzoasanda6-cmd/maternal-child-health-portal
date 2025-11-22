<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RegistrationRequest;
use App\Models\Appointment;
use App\Models\Facility;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DistrictApprovalsController extends Controller
{
    /**
     * Get pending registration requests for district facilities.
     *
     * @group District Admin
     * @authenticated
     */
    public function pendingRegistrations(Request $request)
    {
        $user = Auth::user();

        if ($user->role !== 'district_admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $districtName = $user->district;
        $facilityIds = Facility::where('district', $districtName)->pluck('id');

        $requests = RegistrationRequest::whereIn('facility_id', $facilityIds)
            ->where('status', 'pending')
            ->with('facility')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($requests);
    }

    /**
     * Approve registration request.
     *
     * @group District Admin
     * @authenticated
     */
    public function approveRegistration($id)
    {
        $user = Auth::user();

        if ($user->role !== 'district_admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $districtName = $user->district;
        $facilityIds = Facility::where('district', $districtName)->pluck('id');

        $request = RegistrationRequest::whereIn('facility_id', $facilityIds)->findOrFail($id);

        if ($request->status !== 'pending') {
            return response()->json(['error' => 'Request has already been processed'], 400);
        }

        // Create user from registration request
        \App\Models\User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => \Illuminate\Support\Facades\Hash::make($request->password),
            'phone' => $request->phone,
            'role' => 'mother',
            'facility_id' => $request->facility_id,
        ]);

        $request->update(['status' => 'approved']);

        // Send approval email
        \Illuminate\Support\Facades\Mail::send(new \App\Mail\RegistrationApproved($request));

        return response()->json([
            'message' => 'Registration request approved successfully',
            'data' => $request,
        ]);
    }

    /**
     * Reject registration request.
     *
     * @group District Admin
     * @authenticated
     */
    public function rejectRegistration(Request $request, $id)
    {
        $user = Auth::user();

        if ($user->role !== 'district_admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $districtName = $user->district;
        $facilityIds = Facility::where('district', $districtName)->pluck('id');

        $regRequest = RegistrationRequest::whereIn('facility_id', $facilityIds)->findOrFail($id);

        if ($regRequest->status !== 'pending') {
            return response()->json(['error' => 'Request has already been processed'], 400);
        }

        $validated = $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        $regRequest->update([
            'status' => 'rejected',
            'rejection_reason' => $validated['reason'],
        ]);

        // Send rejection email
        \Illuminate\Support\Facades\Mail::send(new \App\Mail\RegistrationRejected($regRequest));

        return response()->json([
            'message' => 'Registration request rejected',
            'data' => $regRequest,
        ]);
    }

    /**
     * Get pending reschedule requests for district facilities.
     *
     * @group District Admin
     * @authenticated
     */
    public function pendingReschedules(Request $request)
    {
        $user = Auth::user();

        if ($user->role !== 'district_admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $districtName = $user->district;
        $facilityIds = Facility::where('district', $districtName)->pluck('id');

        $reschedules = Appointment::whereIn('facility_id', $facilityIds)
            ->whereNotNull('reschedule_requested_at')
            ->where('status', '!=', 'rescheduled')
            ->with(['child', 'user', 'facility', 'healthWorker'])
            ->orderBy('reschedule_requested_at', 'desc')
            ->paginate(20)
            ->map(function ($appt) {
                return [
                    'id' => $appt->id,
                    'date' => $appt->date,
                    'time' => $appt->start_time,
                    'phase' => $appt->phase,
                    'status' => $appt->status,
                    'mother' => $appt->user?->name,
                    'child' => $appt->child?->name,
                    'facility' => $appt->facility?->name,
                    'reschedule_reason' => $appt->reschedule_reason,
                    'reschedule_requested_at' => $appt->reschedule_requested_at,
                    'reschedule_requested_by' => $appt->reschedule_requested_by,
                ];
            });

        return response()->json($reschedules);
    }

    /**
     * Approve reschedule request.
     *
     * @group District Admin
     * @authenticated
     */
    public function approveReschedule(Request $request, $appointmentId)
    {
        $user = Auth::user();

        if ($user->role !== 'district_admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $districtName = $user->district;
        $facilityIds = Facility::where('district', $districtName)->pluck('id');

        $appointment = Appointment::whereIn('facility_id', $facilityIds)->findOrFail($appointmentId);

        if (is_null($appointment->reschedule_requested_at)) {
            return response()->json(['error' => 'No reschedule request for this appointment'], 400);
        }

        $validated = $request->validate([
            'new_date' => 'required|date|after:today',
            'new_time' => 'required|date_format:H:i',
        ]);

        $appointment->update([
            'date' => $validated['new_date'],
            'start_time' => $validated['new_time'],
            'status' => 'rescheduled',
            'reschedule_requested_at' => null,
            'reschedule_requested_by' => null,
        ]);

        // Send reschedule confirmation email
        \Illuminate\Support\Facades\Mail::send(new \App\Mail\RescheduleApproved($appointment));

        return response()->json([
            'message' => 'Reschedule request approved',
            'data' => $appointment,
        ]);
    }

    /**
     * Reject reschedule request.
     *
     * @group District Admin
     * @authenticated
     */
    public function rejectReschedule(Request $request, $appointmentId)
    {
        $user = Auth::user();

        if ($user->role !== 'district_admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $districtName = $user->district;
        $facilityIds = Facility::where('district', $districtName)->pluck('id');

        $appointment = Appointment::whereIn('facility_id', $facilityIds)->findOrFail($appointmentId);

        if (is_null($appointment->reschedule_requested_at)) {
            return response()->json(['error' => 'No reschedule request for this appointment'], 400);
        }

        $validated = $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        $appointment->update([
            'reschedule_requested_at' => null,
            'reschedule_requested_by' => null,
        ]);

        return response()->json([
            'message' => 'Reschedule request rejected',
            'reason' => $validated['reason'],
        ]);
    }
}
