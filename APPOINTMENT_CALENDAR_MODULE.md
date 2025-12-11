# Appointment Calendar Module - Implementation Guide

## Overview
This document outlines the implementation of the Appointment Calendar Module for the Maternal Child Health Portal. The module supports three portals (Mother, Health Worker, Admin) with role-based filtering and comprehensive appointment management.

## Database Schema Changes

### Migration: `2025_11_21_add_calendar_fields_to_appointments_table.php`

Added the following fields to the `appointments` table:

| Field | Type | Description |
|-------|------|-------------|
| `user_id` | FK(users) | Mother/Patient reference |
| `start_time` | time | Appointment start time |
| `end_time` | time | Appointment end time |
| `phase` | enum | 'prenatal', 'delivery', 'postnatal', 'vaccination' |
| `status` | enum | 'scheduled', 'completed', 'cancelled', 'rescheduled', 'no_show' |
| `health_worker_id` | FK(users) | Assigned health worker |
| `notes` | text | General notes |
| `clinical_notes` | text | Clinical observations |
| `is_high_risk` | boolean | High-risk flag |
| `reminder_sent` | boolean | Reminder notification sent flag |
| `reschedule_reason` | text | Reason for reschedule request |
| `reschedule_requested_at` | timestamp | When reschedule was requested |
| `reschedule_requested_by` | FK(users) | Who requested reschedule |

## Model: Appointment.php

### Fillable Fields
```php
protected $fillable = [
    'child_id', 'user_id', 'date', 'start_time', 'end_time', 'type', 
    'phase', 'status', 'location', 'facility_id', 'health_worker_id',
    'notes', 'clinical_notes', 'is_high_risk', 'reminder_sent',
    'reschedule_reason', 'reschedule_requested_at', 'reschedule_requested_by',
];
```

### Constants
- **Phases:** `PHASE_PRENATAL`, `PHASE_DELIVERY`, `PHASE_POSTNATAL`, `PHASE_VACCINATION`
- **Statuses:** `STATUS_SCHEDULED`, `STATUS_COMPLETED`, `STATUS_CANCELLED`, `STATUS_RESCHEDULED`, `STATUS_NO_SHOW`

### Relationships
- `child()` - Child being cared for
- `user()` - Mother/Patient
- `facility()` - Health facility
- `healthWorker()` - Assigned health worker
- `rescheduledBy()` - User who requested reschedule

### Query Scopes
- `forFacility($id)` - Filter by facility
- `forHealthWorker($id)` - Filter by health worker
- `forPhase($phase)` - Filter by appointment phase
- `withStatus($status)` - Filter by status
- `upcoming()` - Future scheduled appointments
- `past()` - Completed appointments
- `highRisk()` - High-risk flagged appointments

### Helper Methods
- `isUpcoming()` - Check if appointment is upcoming
- `isPast()` - Check if appointment is past
- `canBeRescheduled()` - Check reschedule eligibility
- `markAsCompleted($clinicalNotes)` - Mark as completed
- `flagAsHighRisk($clinicalNotes)` - Flag as high risk

## API Endpoints

### AppointmentController

Base URL: `/api/appointments`

#### List Appointments (with role-based filtering)
```
GET /appointments
```

**Query Parameters:**
- `facility_id` - Filter by facility
- `health_worker_id` - Filter by health worker
- `user_id` - Filter by mother
- `phase` - Filter by phase (prenatal|delivery|postnatal|vaccination)
- `status` - Filter by status (scheduled|completed|cancelled|rescheduled|no_show)
- `start_date` - Filter from date (YYYY-MM-DD)
- `end_date` - Filter to date (YYYY-MM-DD)
- `is_high_risk` - Filter high-risk appointments (boolean)
- `upcoming_only` - Show only upcoming appointments (boolean)
- `sort_by` - Sort field (default: date)
- `sort_direction` - Sort direction (asc|desc, default: asc)
- `per_page` - Pagination size (default: 15)

**Response:** Paginated list with pagination metadata

**Role-Based Filtering:**
- **Mothers**: See only their own appointments
- **Health Workers**: See appointments assigned to them or at their facility
- **Admins**: See all appointments

#### Create Appointment
```
POST /appointments
```

**Request Body:**
```json
{
  "child_id": 1,
  "user_id": 2,
  "date": "2025-12-15",
  "start_time": "09:00",
  "end_time": "09:30",
  "type": "Prenatal Check-up",
  "phase": "prenatal",
  "facility_id": 1,
  "health_worker_id": 3,
  "location": "OPD Room 1",
  "notes": "First trimester check"
}
```

#### Get Appointment
```
GET /appointments/{id}
```

#### Update Appointment
```
PUT /appointments/{id}
```

Allowed fields: `date`, `start_time`, `end_time`, `status`, `health_worker_id`, `clinical_notes`, `is_high_risk`, `reminder_sent`, `notes`

#### Mark as Completed
```
POST /appointments/{id}/mark-completed
```

**Request Body:**
```json
{
  "clinical_notes": "All vitals normal. Mother in good health."
}
```

#### Flag as High Risk
```
POST /appointments/{id}/flag-high-risk
```

**Request Body:**
```json
{
  "clinical_notes": "Elevated blood pressure observed. Requires immediate attention."
}
```

#### Request Reschedule
```
POST /appointments/{id}/request-reschedule
```

**Request Body:**
```json
{
  "reschedule_reason": "Unable to attend due to personal emergency"
}
```

**Authorization:** Mother or assigned health worker

#### Reschedule Appointment
```
POST /appointments/{id}/reschedule
```

**Request Body:**
```json
{
  "date": "2025-12-16",
  "start_time": "10:00",
  "end_time": "10:30"
}
```

**Authorization:** Health worker or admin only

#### Cancel Appointment
```
POST /appointments/{id}/cancel
```

**Request Body:**
```json
{
  "reason": "Optional cancellation reason"
}
```

#### Delete Appointment
```
DELETE /appointments/{id}
```

**Authorization:** Admin only

## Role-Based Access Control

### Mother/Patient Role
- **Can view:** Own appointments only
- **Can do:** Request reschedules, see upcoming appointments

### Health Worker Roles (midwife, nurse, doctor)
- **Can view:** 
  - Appointments assigned to them
  - Appointments at their facility
- **Can do:**
  - Mark appointments as completed
  - Add clinical notes
  - Flag as high-risk
  - Reschedule appointments
  - Filter by facility, phase, status

### Admin/District Admin Roles
- **Can view:** All appointments system-wide
- **Can do:**
  - All operations
  - Manage all appointments
  - View by facility/district

## Integration Points

### Frontend Components (To Be Built)

1. **Mother Portal - Appointment Calendar**
   - Read-only calendar view of appointments
   - Reschedule button for upcoming appointments
   - View appointment details and notes
   - See health worker information

2. **Health Worker Portal - Appointment Dashboard**
   - Calendar with filter by phase, status, date range
   - Mark appointments as completed
   - Add clinical notes
   - Flag high-risk cases
   - View facility appointments
   - See assigned appointments

3. **Admin Portal - Aggregated View**
   - System-wide calendar
   - Filter by facility, health worker, status
   - Manage rescheduling requests
   - View statistics and reports

### Notification Service (To Be Implemented)

Future implementations should include:
- SMS/Email appointment reminders (24 hours before)
- Reschedule request notifications
- High-risk appointment alerts
- Completion confirmations

Add to `AppointmentController`:
```php
// In createAppointment and reschedule methods:
// Notification::send($mother, new AppointmentScheduled($appointment));
// Notification::send($healthWorker, new AppointmentAssigned($appointment));
```

## Usage Examples

### Get all upcoming prenatal appointments for a health worker
```
GET /api/appointments?health_worker_id=3&phase=prenatal&upcoming_only=true
```

### Get high-risk appointments for a facility
```
GET /api/appointments?facility_id=1&is_high_risk=true&sort_by=date
```

### Get appointments for a date range
```
GET /api/appointments?start_date=2025-12-01&end_date=2025-12-31
```

### Mark appointment completed with clinical notes
```
POST /api/appointments/5/mark-completed
Content-Type: application/json

{
  "clinical_notes": "Mother and baby in good health. Next visit in 2 weeks."
}
```

## Next Steps

1. **Create Frontend Components**
   - Mother calendar view
   - Health worker dashboard with filters
   - Admin aggregated calendar

2. **Implement Notifications**
   - Create Notification classes
   - Set up notification jobs/queues
   - Configure SMS/Email providers

3. **Add Tests**
   - Unit tests for model methods
   - Feature tests for API endpoints
   - Authorization tests for role-based access

4. **Add Reports**
   - Appointment completion rates
   - High-risk appointment metrics
   - Health worker workload analysis

## Security Considerations

- All endpoints require `auth:sanctum` middleware
- Role-based authorization enforced on all operations
- Health workers can only see facility/assigned appointments
- Mothers can only see their own appointments
- High-risk appointments require admin/health worker roles to flag

