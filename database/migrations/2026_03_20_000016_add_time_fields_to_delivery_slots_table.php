<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('delivery_slots', function (Blueprint $table) {
            $table->time('start_time')->nullable()->after('delivery_date');
            $table->time('end_time')->nullable()->after('start_time');
            $table->decimal('delivery_fee', 8, 2)->default(0)->after('is_active');
        });
    }

    public function down(): void
    {
        Schema::table('delivery_slots', function (Blueprint $table) {
            $table->dropColumn(['start_time', 'end_time', 'delivery_fee']);
        });
    }
};
