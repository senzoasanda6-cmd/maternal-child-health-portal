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
        Schema::create('postnatal_visits', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('child_id');
            $table->date('visit_date');
            $table->string('visit_type')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->foreign('child_id')->references('id')->on('children')->onDelete('cascade');
            $table->foreignId('provider_id')->nullable()->constrained('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('postnatal_visits');
    }
};
