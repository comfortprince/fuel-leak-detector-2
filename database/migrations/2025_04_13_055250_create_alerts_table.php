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
        Schema::create('alerts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('alert_policy_id');
            $table->unsignedBigInteger('mq2_reading_id');
            $table->unsignedBigInteger('bmp180_reading_id');
            $table->timestamp('triggered_at');
            $table->boolean('resolved')->default(false);
            $table->timestamps();

            $table->foreign('alert_policy_id')->references('id')->on('alert_policies')->onDelete('cascade');
            $table->foreign('bmp180_reading_id')->references('id')->on('sensor_readings')->onDelete('cascade');
            $table->foreign('mq2_reading_id')->references('id')->on('sensor_readings')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('alerts');
    }
};
