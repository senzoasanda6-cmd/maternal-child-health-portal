<?php

require_once __DIR__ . '/../bootstrap/app.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';

$user = \App\Models\User::where('email', 'his_manager@gauteng.gov.za')->first();

if ($user) {
    echo "HIS Manager User Found:\n";
    echo "ID: " . $user->id . "\n";
    echo "Name: " . $user->name . "\n";
    echo "Role: " . $user->role . "\n";
    echo "Sub-role: " . $user->sub_role . "\n";
    echo "District: " . $user->district_id . "\n";
    echo "Facility: " . $user->facility_id . "\n";
    echo "\n";
    
    // Test appointment query
    $appointments = \App\Models\Appointment::with(['child', 'user', 'facility', 'healthWorker'])->limit(3)->get();
    echo "Appointments count: " . count($appointments) . "\n";
    if (count($appointments) > 0) {
        echo "First appointment: " . $appointments[0]->id . "\n";
    }
} else {
    echo "HIS Manager user not found!\n";
}
?>
