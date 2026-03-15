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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('sku')->unique();
            $table->string('title');
            $table->string('slug')->unique();
            $table->decimal('price', 8, 2);
            $table->decimal('sale_price', 8, 2)->nullable();
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->string('brand')->nullable();
            $table->integer('quantity')->default(0);
            $table->string('unit')->default('each');
            $table->text('description')->nullable();
            $table->json('tags')->nullable();
            $table->boolean('is_halal_certified')->default(true);
            $table->string('halal_certification_body')->nullable();
            $table->enum('status', ['draft', 'published', 'out_of_stock'])->default('published');
            $table->integer('sold')->default(0);
            $table->integer('sort_order')->default(0);
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
