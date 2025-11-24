<?php

require 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Http\Kernel::class);
$kernel->bootstrap();

use App\Models\Appointment;

echo "=== APPOINTMENT DATA SUMMARY ===\n\n";

// By Status
echo "Appointments by Status:\n";
$byStatus = Appointment::selectRaw('status, count(*) as count')
    ->groupBy('status')
    ->get();

foreach ($byStatus as $row) {
    echo "  {$row->status}: {$row->count}\n";
}

echo "\nAppointments by Phase:\n";
$byPhase = Appointment::selectRaw('phase, count(*) as count')
    ->groupBy('phase')
    ->get();

foreach ($byPhase as $row) {
    echo "  {$row->phase}: {$row->count}\n";
}

echo "\nAppointments by Facility:\n";
$byFacility = Appointment::selectRaw('facility_id, count(*) as count')
    ->with('facility')
    ->groupBy('facility_id')
    ->get();

foreach ($byFacility as $row) {
    echo "  Facility {$row->facility_id}: {$row->count}\n";
}

echo "\nTotal Appointments: " . Appointment::count() . "\n";

echo "\nSample Appointments:\n";
$samples = Appointment::with(['child', 'user', 'facility', 'healthWorker'])
    ->limit(3)
    ->get();

foreach ($samples as $appt) {
    echo "\n  ID: {$appt->id}\n";
    echo "  Date: {$appt->date} {$appt->start_time}\n";
    echo "  Phase: {$appt->phase} | Status: {$appt->status}\n";
    echo "  Type: {$appt->type}\n";
    echo "  Mother: {$appt->user?->name}\n";
    echo "  Facility: {$appt->facility?->name}\n";
    echo "  Health Worker: {$appt->healthWorker?->name}\n";
}

echo "\n";
