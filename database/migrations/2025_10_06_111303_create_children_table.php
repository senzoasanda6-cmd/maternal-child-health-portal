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
        Schema::create('children', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mother_profile_id')->nullable()->constrained()->onDelete('set null'); // ✅ only this line
            $table->string('name');
            $table->string('gender');
            $table->date('birth_date')->nullable();
            $table->integer('age')->nullable();
            $table->date('dob')->nullable();
            $table->date('next_checkup')->nullable();
            $table->string('growth_status')->nullable();
            $table->foreignId('mother_id')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('children');
    }
};
