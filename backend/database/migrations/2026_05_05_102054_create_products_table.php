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
        $table->foreignId('product_category_id')->nullable()->constrained()->nullOnDelete();
        $table->foreignId('supplier_id')->nullable()->constrained()->nullOnDelete();
        
        $table->string('name');
        $table->text('description')->nullable();
        $table->string('brand')->nullable();
        // Financials
        $table->decimal('cost_price', 10, 2);        
        // Inventory Units
        $table->string('unit_of_measure'); // 'Piece', 'Kg', 'Liter'
        $table->integer('units_per_package')->default(1); // Retail math!
        
        // Identifiers
        $table->string('location')->nullable(); // 'Aisle 3, Shelf 2'
        
        // Status
        $table->boolean('is_active')->default(true);
        $table->string('image')->nullable();
        
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
