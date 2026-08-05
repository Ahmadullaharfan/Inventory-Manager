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
        Schema::create('inventory_movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained(); // Who did it?
            $table->enum('type', ['RECEIVED', 'SOLD', 'RETURNED', 'ADJUSTED', 'DAMAGED', 'EXPIRED']); // Movement type
            $table->integer('quantity'); // Positive for RECEIVED, Negative for SOLD
            $table->decimal('unit_cost', 10, 2)->nullable(); // What did we pay for this specific batch?
            $table->decimal('unit_price', 10, 2)->nullable(); // What did we sell this specific batch for?
            $table->date('expiry_date')->nullable(); // CRUCIAL for supermarkets!
            $table->string('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory_movements');
    }
};
