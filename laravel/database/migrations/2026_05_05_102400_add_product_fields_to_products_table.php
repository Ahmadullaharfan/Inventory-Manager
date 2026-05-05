<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            if (! Schema::hasColumn('products', 'product_category_id')) {
                $table->unsignedBigInteger('product_category_id')->nullable()->after('id');
            }

            if (! Schema::hasColumn('products', 'name')) {
                $table->string('name')->nullable()->after('product_category_id');
            }

            if (! Schema::hasColumn('products', 'description')) {
                $table->text('description')->nullable()->after('name');
            }

            if (! Schema::hasColumn('products', 'price')) {
                $table->decimal('price', 10, 2)->nullable()->after('description');
            }

            if (! Schema::hasColumn('products', 'stock')) {
                $table->unsignedInteger('stock')->default(0)->after('price');
            }
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            if (Schema::hasColumn('products', 'product_category_id')) {
                $table->dropColumn('product_category_id');
            }

            foreach (['name', 'description', 'price', 'stock'] as $column) {
                if (Schema::hasColumn('products', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
