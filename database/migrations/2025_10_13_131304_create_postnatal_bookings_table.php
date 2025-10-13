<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePostnatalBookingsTable extends Migration
{
    public function up()
    {
        Schema::create('postnatal_bookings', function (Blueprint $table) {
            $table->id();
            $table->string('fullName');
            $table->date('preferredDate');
            $table->string('preferredTime');
            $table->string('location');
            $table->text('reason');
            $table->timestamps();
            $table->string('email');
            $table->text('reschedule_reason')->nullable();
            $table->boolean('reschedule_approved')->default(false);
            $table->boolean('is_approved')->default(false);});
    }

    public function down()
    {
        Schema::dropIfExists('postnatal_bookings');
    }
}
