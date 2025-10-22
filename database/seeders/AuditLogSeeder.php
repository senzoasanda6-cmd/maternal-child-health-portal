<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AuditLog;
use App\Models\User;

class AuditLogSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('role', 'admin')->first();

        AuditLog::insert([
            [
                'action' => 'registration_approved',
                'details' => 'Approved registration for amina@example.com (role: mother)',
                'performed_by' => $admin?->id,
                'created_at' => now()->subDays(2),
                'updated_at' => now()->subDays(2),
            ],
            [
                'action' => 'registration_rejected',
                'details' => 'Rejected registration for thabo@example.com (role: clinic_staff)',
                'performed_by' => $admin?->id,
                'created_at' => now()->subDay(),
                'updated_at' => now()->subDay(),
            ],
            [
                'action' => 'user_promoted',
                'details' => 'Promoted user zanele@example.com to district_admin',
                'performed_by' => $admin?->id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
