<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    protected $fillable = [
        'child_id',
        'user_id',
        'date',
        'start_time',
        'end_time',
        'type',
        'phase',
        'status',
        'location',
        'facility_id',
        'health_worker_id',
        'notes',
        'clinical_notes',
        'is_high_risk',
        'reminder_sent',
        'reschedule_reason',
        'reschedule_requested_at',
        'reschedule_requested_by',
    ];

    protected $casts = [
        'date' => 'date',
        'start_time' => 'time',
        'end_time' => 'time',
        'reminder_sent' => 'boolean',
        'is_high_risk' => 'boolean',
        'reschedule_requested_at' => 'datetime',
    ];

    // Appointment phases
    public const PHASE_PRENATAL = 'prenatal';
    public const PHASE_DELIVERY = 'delivery';
    public const PHASE_POSTNATAL = 'postnatal';
    public const PHASE_VACCINATION = 'vaccination';

    // Appointment statuses
    public const STATUS_SCHEDULED = 'scheduled';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_CANCELLED = 'cancelled';
    public const STATUS_RESCHEDULED = 'rescheduled';
    public const STATUS_NO_SHOW = 'no_show';

    /**
     * Get the child associated with the appointment
     */
    public function child()
    {
        return $this->belongsTo(Child::class);
    }

    /**
     * Get the user (mother) associated with the appointment
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the facility associated with the appointment
     */
    public function facility()
    {
        return $this->belongsTo(Facility::class);
    }

    /**
     * Get the health worker assigned to this appointment
     */
    public function healthWorker()
    {
        return $this->belongsTo(User::class, 'health_worker_id');
    }

    /**
     * Get the user who requested the reschedule
     */
    public function rescheduledBy()
    {
        return $this->belongsTo(User::class, 'reschedule_requested_by');
    }

    /**
     * Scope: Get appointments for a specific facility
     */
    public function scopeForFacility($query, $facilityId)
    {
        return $query->where('facility_id', $facilityId);
    }

    /**
     * Scope: Get appointments for a specific health worker
     */
    public function scopeForHealthWorker($query, $healthWorkerId)
    {
        return $query->where('health_worker_id', $healthWorkerId);
    }

    /**
     * Scope: Get appointments for a specific phase
     */
    public function scopeForPhase($query, $phase)
    {
        return $query->where('phase', $phase);
    }

    /**
     * Scope: Get appointments with specific status
     */
    public function scopeWithStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope: Get upcoming appointments
     */
    public function scopeUpcoming($query)
    {
        return $query->where('date', '>=', now()->toDateString())
            ->where('status', self::STATUS_SCHEDULED)
            ->orderBy('date', 'asc')
            ->orderBy('start_time', 'asc');
    }

    /**
     * Scope: Get past appointments
     */
    public function scopePast($query)
    {
        return $query->where('date', '<', now()->toDateString())
            ->orderBy('date', 'desc')
            ->orderBy('start_time', 'desc');
    }

    /**
     * Scope: Get high-risk appointments
     */
    public function scopeHighRisk($query)
    {
        return $query->where('is_high_risk', true);
    }

    /**
     * Check if appointment is upcoming
     */
    public function isUpcoming()
    {
        return $this->date >= now()->toDateString() && $this->status === self::STATUS_SCHEDULED;
    }

    /**
     * Check if appointment is past due
     */
    public function isPast()
    {
        return $this->date < now()->toDateString();
    }

    /**
     * Can this appointment be rescheduled?
     */
    public function canBeRescheduled()
    {
        return $this->status === self::STATUS_SCHEDULED && $this->isUpcoming();
    }

    /**
     * Mark appointment as completed
     */
    public function markAsCompleted($clinicalNotes = null)
    {
        $this->update([
            'status' => self::STATUS_COMPLETED,
            'clinical_notes' => $clinicalNotes ?? $this->clinical_notes,
        ]);
    }

    /**
     * Flag as high risk
     */
    public function flagAsHighRisk($clinicalNotes = null)
    {
        $this->update([
            'is_high_risk' => true,
            'clinical_notes' => $clinicalNotes ?? $this->clinical_notes,
        ]);
    }
}
