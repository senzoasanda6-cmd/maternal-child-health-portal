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
        Schema::create('prenatal_visits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // links to users table
            $table->foreignId('child_id')->nullable()->constrained()->onDelete('set null'); // optional link to child
            $table->foreignId('facility_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('provider_id')->nullable()->constrained('users')->onDelete('set null');
            $table->date('visit_date')->nullable();
            $table->string('visit_type')->nullable(); // e.g., 'prenatal'
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prenatal_visits');
    }
};
