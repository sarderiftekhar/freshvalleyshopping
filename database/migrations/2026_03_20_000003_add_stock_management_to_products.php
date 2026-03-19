<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->integer('low_stock_threshold')->default(10)->after('quantity');
            $table->boolean('track_stock')->default(true)->after('low_stock_threshold');
            $table->decimal('cost_price', 8, 2)->nullable()->after('sale_price');
            $table->decimal('weight', 8, 3)->nullable()->after('unit');
            $table->string('barcode')->nullable()->after('sku');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['low_stock_threshold', 'track_stock', 'cost_price', 'weight', 'barcode']);
        });
    }
};
