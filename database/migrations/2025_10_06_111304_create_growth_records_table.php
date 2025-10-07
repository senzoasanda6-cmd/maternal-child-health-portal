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
    Schema::create('growth_records', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('child_id');
        $table->date('date');
        $table->float('height'); // in cm
        $table->float('weight'); // in kg
        $table->float('head_circumference')->nullable(); // optional
        $table->timestamps();

        $table->foreign('child_id')->references('id')->on('children')->onDelete('cascade');
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('growth_records');
    }
};
