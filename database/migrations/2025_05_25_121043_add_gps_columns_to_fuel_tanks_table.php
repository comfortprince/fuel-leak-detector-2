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
        Schema::table('fuel_tanks', function (Blueprint $table) {
            $table->decimal('gps_latitude', 10, 8)->nullable();
            $table->decimal('gps_longitude', 10, 8)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('fuel_tanks', function (Blueprint $table) {
            $table->dropColumn(['gps_latitude', 'gps_longitude']);
        });
    }
};
