<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('supplier_products', function (Blueprint $table) {
            $table->string('pack_size', 50)->nullable()->after('unit');
        });
    }

    public function down(): void
    {
        Schema::table('supplier_products', function (Blueprint $table) {
            $table->dropColumn('pack_size');
        });
    }
};
