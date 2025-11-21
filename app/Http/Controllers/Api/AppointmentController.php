<?php

namespace App\Http\Controllers\Api;

use App\Models\Appointment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class AppointmentController extends Controller
{
    /**
     * Get all appointments with role-based filtering
     * Mothers: see their own appointments
     * Health workers: see appointments for patients at their facility/assigned to them
     * Admins: see all appointments
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        $query = Appointment::with(['child', 'user', 'facility', 'healthWorker']);

        // Apply role-based filtering
        if ($user->hasRole(['mother', 'patient'])) {
            // Mothers only see their own appointments
            $query->where('user_id', $user->id);
        } elseif ($user->hasRole(['health_worker', 'midwife', 'nurse', 'doctor'])) {
            // Health workers see:
            // 1. Appointments assigned to them
            // 2. Appointments at their facility
            $facilityId = $user->facility_id;
            $query->where(function ($q) use ($user, $facilityId) {
                $q->where('health_worker_id', $user->id)
                  ->orWhere('facility_id', $facilityId);
            });
        }
        // Admins see all appointments (no filter)

        // Apply optional filters
        if ($request->has('facility_id')) {
            $query->where('facility_id', $request->facility_id);
        }

        if ($request->has('health_worker_id')) {
            $query->where('health_worker_id', $request->health_worker_id);
        }

        if ($request->has('phase')) {
            $query->where('phase', $request->phase);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Filter by date range
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('date', [
                $request->input('start_date'),
                $request->input('end_date'),
            ]);
        }

        if ($request->has('start_date') && !$request->has('end_date')) {
            $query->where('date', '>=', $request->start_date);
        }

        if (!$request->has('start_date') && $request->has('end_date')) {
            $query->where('date', '<=', $request->end_date);
        }

        // Filter by high risk
        if ($request->has('is_high_risk')) {
            $query->where('is_high_risk', filter_var($request->is_high_risk, FILTER_VALIDATE_BOOLEAN));
        }

        // Filter by upcoming only
        if ($request->boolean('upcoming_only', false)) {
            $query->upcoming();
        }

        // Sort
        $sortBy = $request->get('sort_by', 'date');
        $sortDirection = $request->get('sort_direction', 'asc');
        $query->orderBy($sortBy, $sortDirection);

        // Paginate
        $perPage = $request->get('per_page', 15);
        $appointments = $query->paginate($perPage);

        return response()->json([
            'data' => $appointments->items(),
            'pagination' => [
                'total' => $appointments->total(),
                'count' => $appointments->count(),
                'per_page' => $appointments->perPage(),
                'current_page' => $appointments->currentPage(),
                'total_pages' => $appointments->lastPage(),
            ],
        ]);
    }

    /**
     * Store a new appointment
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'child_id' => 'required|exists:children,id',
            'user_id' => 'required|exists:users,id',
            'date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'type' => 'required|string',
            'phase' => 'required|in:prenatal,delivery,postnatal,vaccination',
            'facility_id' => 'required|exists:facilities,id',
            'health_worker_id' => 'nullable|exists:users,id',
            'location' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $user = auth()->user();

        // Authorization: Only admins, health workers, and the mother can create appointments
        if (!$user->hasRole(['admin', 'health_worker', 'midwife', 'nurse', 'doctor'])) {
            if ($user->id !== $validated['user_id']) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }

        $appointment = Appointment::create($validated);

        return response()->json([
            'message' => 'Appointment created successfully',
            'data' => $appointment->load(['child', 'user', 'facility', 'healthWorker']),
        ], 201);
    }

    /**
     * Get a specific appointment
     */
    public function show(Appointment $appointment)
    {
        $user = auth()->user();

        // Authorization: Check if user can view this appointment
        if (!$this->canViewAppointment($user, $appointment)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json([
            'data' => $appointment->load(['child', 'user', 'facility', 'healthWorker', 'rescheduledBy']),
        ]);
    }

    /**
     * Update an appointment
     */
    public function update(Request $request, Appointment $appointment)
    {
        $user = auth()->user();

        // Authorization
        if (!$user->hasRole(['admin', 'health_worker', 'midwife', 'nurse', 'doctor'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'date' => 'sometimes|date',
            'start_time' => 'sometimes|date_format:H:i',
            'end_time' => 'sometimes|date_format:H:i',
            'status' => 'sometimes|in:scheduled,completed,cancelled,rescheduled,no_show',
            'health_worker_id' => 'sometimes|nullable|exists:users,id',
            'clinical_notes' => 'sometimes|nullable|string',
            'is_high_risk' => 'sometimes|boolean',
            'reminder_sent' => 'sometimes|boolean',
            'notes' => 'sometimes|nullable|string',
        ]);

        $appointment->update($validated);

        return response()->json([
            'message' => 'Appointment updated successfully',
            'data' => $appointment->load(['child', 'user', 'facility', 'healthWorker']),
        ]);
    }

    /**
     * Mark appointment as completed
     */
    public function markCompleted(Request $request, Appointment $appointment)
    {
        $user = auth()->user();

        // Only health workers and admins can mark as completed
        if (!$user->hasRole(['admin', 'health_worker', 'midwife', 'nurse', 'doctor'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'clinical_notes' => 'nullable|string',
        ]);

        $appointment->markAsCompleted($validated['clinical_notes'] ?? null);

        return response()->json([
            'message' => 'Appointment marked as completed',
            'data' => $appointment,
        ]);
    }

    /**
     * Flag appointment as high risk
     */
    public function flagHighRisk(Request $request, Appointment $appointment)
    {
        $user = auth()->user();

        // Only health workers and admins can flag
        if (!$user->hasRole(['admin', 'health_worker', 'midwife', 'nurse', 'doctor', 'doctor'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'clinical_notes' => 'required|string',
        ]);

        $appointment->flagAsHighRisk($validated['clinical_notes']);

        return response()->json([
            'message' => 'Appointment flagged as high risk',
            'data' => $appointment,
        ]);
    }

    /**
     * Request to reschedule an appointment
     */
    public function requestReschedule(Request $request, Appointment $appointment)
    {
        $user = auth()->user();

        // Only mothers and assigned health workers can request reschedule
        if ($user->id !== $appointment->user_id && $user->id !== $appointment->health_worker_id) {
            if (!$user->hasRole(['admin', 'district_admin'])) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }

        // Check if appointment can be rescheduled
        if (!$appointment->canBeRescheduled()) {
            return response()->json([
                'message' => 'Appointment cannot be rescheduled',
                'reason' => 'Appointment must be scheduled and in the future',
            ], 422);
        }

        $validated = $request->validate([
            'reschedule_reason' => 'required|string|max:500',
        ]);

        $appointment->update([
            'reschedule_requested_at' => now(),
            'reschedule_requested_by' => $user->id,
            'reschedule_reason' => $validated['reschedule_reason'],
            'status' => Appointment::STATUS_RESCHEDULED,
        ]);

        // TODO: Send notification to health worker and admin
        // Notification::send($appointment->healthWorker, new AppointmentRescheduleRequested($appointment));

        return response()->json([
            'message' => 'Reschedule request submitted',
            'data' => $appointment,
        ]);
    }

    /**
     * Reschedule an appointment to a new date/time
     */
    public function reschedule(Request $request, Appointment $appointment)
    {
        $user = auth()->user();

        // Only admins and health workers can reschedule
        if (!$user->hasRole(['admin', 'health_worker', 'midwife', 'nurse', 'doctor', 'district_admin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
        ]);

        $appointment->update([
            'date' => $validated['date'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
            'status' => Appointment::STATUS_SCHEDULED,
        ]);

        // TODO: Send notification to mother and health worker
        // Notification::send($appointment->user, new AppointmentRescheduled($appointment));

        return response()->json([
            'message' => 'Appointment rescheduled successfully',
            'data' => $appointment->load(['child', 'user', 'facility', 'healthWorker']),
        ]);
    }

    /**
     * Cancel an appointment
     */
    public function cancel(Request $request, Appointment $appointment)
    {
        $user = auth()->user();

        // Only admins, health workers, and the mother can cancel
        if (!$user->hasRole(['admin', 'health_worker', 'midwife', 'nurse', 'doctor'])) {
            if ($user->id !== $appointment->user_id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }

        $validated = $request->validate([
            'reason' => 'nullable|string',
        ]);

        $appointment->update([
            'status' => Appointment::STATUS_CANCELLED,
            'notes' => $validated['reason'] ?? $appointment->notes,
        ]);

        return response()->json([
            'message' => 'Appointment cancelled',
            'data' => $appointment,
        ]);
    }

    /**
     * Delete an appointment
     */
    public function destroy(Appointment $appointment)
    {
        $user = auth()->user();

        // Only admins can delete
        if (!$user->hasRole(['admin', 'district_admin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $appointment->delete();

        return response()->json([
            'message' => 'Appointment deleted successfully',
        ]);
    }

    /**
     * Helper method to check if user can view appointment
     */
    private function canViewAppointment(User $user, Appointment $appointment): bool
    {
        if ($user->hasRole(['admin', 'district_admin'])) {
            return true;
        }

        if ($user->hasRole(['health_worker', 'midwife', 'nurse', 'doctor'])) {
            return $appointment->health_worker_id === $user->id ||
                   $appointment->facility_id === $user->facility_id;
        }

        if ($user->hasRole(['mother', 'patient'])) {
            return $appointment->user_id === $user->id;
        }

        return false;
    }
}
