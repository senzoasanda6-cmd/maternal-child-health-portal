<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('registration_requests', function (Blueprint $table) {
            if (!Schema::hasColumn('registration_requests', 'designation')) {
                $table->string('designation')->nullable();
            }
            if (!Schema::hasColumn('registration_requests', 'comments')) {
                $table->text('comments')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('registration_requests', function (Blueprint $table) {
            if (Schema::hasColumn('registration_requests', 'designation')) {
                $table->dropColumn('designation');
            }
            if (Schema::hasColumn('registration_requests', 'comments')) {
                $table->dropColumn('comments');
            }
        });
    }
};
