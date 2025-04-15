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
        Schema::create('alert_policies', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('fuel_tank_id');
            $table->float('mq2_min')->nullable();
            $table->float('mq2_max')->nullable();
            $table->float('bmp180_min')->nullable();
            $table->float('bmp180_max')->nullable();
            $table->enum('alert_type', ['warning', 'critical', 'info'])->default('warning');
            $table->enum('policy_status', ['active', 'inactive'])->default('active');
            $table->string('alert_message', 255)->default('Alert triggered for tank #ID');
            $table->timestamps();

            $table->foreign('fuel_tank_id')->references('id')->on('fuel_tanks')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('alert_policies');
    }
};
