<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            // Add user_id (mother) if not already present
            if (!Schema::hasColumn('appointments', 'user_id')) {
                $table->foreignId('user_id')
                    ->nullable()
                    ->constrained('users')
                    ->onDelete('set null')
                    ->after('child_id');
            }

            // Add start_time and end_time if not already present
            if (!Schema::hasColumn('appointments', 'start_time')) {
                $table->time('start_time')->nullable()->after('date');
            }
            if (!Schema::hasColumn('appointments', 'end_time')) {
                $table->time('end_time')->nullable()->after('start_time');
            }

            // Add appointment phase (prenatal, delivery, postnatal, vaccination)
            if (!Schema::hasColumn('appointments', 'phase')) {
                $table->enum('phase', ['prenatal', 'delivery', 'postnatal', 'vaccination'])
                    ->default('prenatal')
                    ->after('type');
            }

            // Add appointment status
            if (!Schema::hasColumn('appointments', 'status')) {
                $table->enum('status', ['scheduled', 'completed', 'cancelled', 'rescheduled', 'no_show'])
                    ->default('scheduled')
                    ->after('phase');
            }

            // Add health worker ID (who will conduct the appointment)
            if (!Schema::hasColumn('appointments', 'health_worker_id')) {
                $table->foreignId('health_worker_id')
                    ->nullable()
                    ->constrained('users')
                    ->onDelete('set null')
                    ->after('status');
            }

            // Add notes field
            if (!Schema::hasColumn('appointments', 'notes')) {
                $table->text('notes')->nullable()->after('health_worker_id');
            }

            // Add clinical notes
            if (!Schema::hasColumn('appointments', 'clinical_notes')) {
                $table->text('clinical_notes')->nullable()->after('notes');
            }

            // Add risk flag
            if (!Schema::hasColumn('appointments', 'is_high_risk')) {
                $table->boolean('is_high_risk')->default(false)->after('clinical_notes');
            }

            // Add reminder sent flag
            if (!Schema::hasColumn('appointments', 'reminder_sent')) {
                $table->boolean('reminder_sent')->default(false)->after('is_high_risk');
            }

            // Add reschedule reason and request tracking
            if (!Schema::hasColumn('appointments', 'reschedule_reason')) {
                $table->text('reschedule_reason')->nullable()->after('reminder_sent');
            }

            if (!Schema::hasColumn('appointments', 'reschedule_requested_at')) {
                $table->timestamp('reschedule_requested_at')->nullable()->after('reschedule_reason');
            }

            if (!Schema::hasColumn('appointments', 'reschedule_requested_by')) {
                $table->foreignId('reschedule_requested_by')
                    ->nullable()
                    ->constrained('users')
                    ->onDelete('set null')
                    ->after('reschedule_requested_at');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            // Drop columns in reverse order
            if (Schema::hasColumn('appointments', 'reschedule_requested_by')) {
                $table->dropForeignIdFor('reschedule_requested_by');
                $table->dropColumn('reschedule_requested_by');
            }
            if (Schema::hasColumn('appointments', 'reschedule_requested_at')) {
                $table->dropColumn('reschedule_requested_at');
            }
            if (Schema::hasColumn('appointments', 'reschedule_reason')) {
                $table->dropColumn('reschedule_reason');
            }
            if (Schema::hasColumn('appointments', 'reminder_sent')) {
                $table->dropColumn('reminder_sent');
            }
            if (Schema::hasColumn('appointments', 'is_high_risk')) {
                $table->dropColumn('is_high_risk');
            }
            if (Schema::hasColumn('appointments', 'clinical_notes')) {
                $table->dropColumn('clinical_notes');
            }
            if (Schema::hasColumn('appointments', 'notes')) {
                $table->dropColumn('notes');
            }
            if (Schema::hasColumn('appointments', 'health_worker_id')) {
                $table->dropForeignIdFor('health_worker_id');
                $table->dropColumn('health_worker_id');
            }
            if (Schema::hasColumn('appointments', 'status')) {
                $table->dropColumn('status');
            }
            if (Schema::hasColumn('appointments', 'phase')) {
                $table->dropColumn('phase');
            }
            if (Schema::hasColumn('appointments', 'end_time')) {
                $table->dropColumn('end_time');
            }
            if (Schema::hasColumn('appointments', 'start_time')) {
                $table->dropColumn('start_time');
            }
            if (Schema::hasColumn('appointments', 'user_id')) {
                $table->dropForeignIdFor('user_id');
                $table->dropColumn('user_id');
            }
        });
    }
};
