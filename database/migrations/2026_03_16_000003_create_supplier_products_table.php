<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('supplier_products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('supplier_category_id')->constrained('supplier_categories')->cascadeOnDelete();
            $table->string('name');
            $table->string('unit', 50)->default('each');
            $table->decimal('base_price', 8, 2);
            $table->decimal('bulk_price', 8, 2)->nullable();
            $table->string('bulk_unit', 100)->nullable();
            $table->text('notes')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('supplier_products');
    }
};
