<?php


use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->dateTime('start');
            $table->dateTime('end');
            $table->unsignedBigInteger('facility_id')->nullable();
            $table->string('facility_name')->nullable();
            $table->string('care_type')->default('postnatal'); // prenatal/postnatal
            $table->string('status')->default('pending'); // pending/confirmed/cancelled
            $table->string('recurrence')->default('none'); // none/daily/weekly/monthly
            $table->json('recurrence_days')->nullable(); // for weekly recurrence
            $table->timestamps();

            $table->foreign('facility_id')->references('id')->on('facilities')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
