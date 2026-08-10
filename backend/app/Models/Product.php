<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'product_category_id',
        'supplier_id',
        'name',
        'description',
        'brand',
        'cost_price',
        'unit_of_measure',
        'units_per_package',
        'location',
        'is_active',
        'image',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'cost_price' => 'decimal:2',
        'units_per_package' => 'integer',
        'is_active' => 'boolean',
    ];

    /**
     * The attributes that should be appended to the model.
     */
    protected $appends = [
        'category_name',
    ];

    /**
     * Get the supplier that owns the product.
     */
    public function supplier(): BelongsTo
    {
        return $this->belongsTo(
            Supplier::class,
            'supplier_id'
        );
    }

    /**
     * Get the category that owns the product.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(
            ProductCategory::class,
            'product_category_id'
        );
    }

    /**
     * Get the category name.
     */
    public function getCategoryNameAttribute(): ?string
    {
        return $this->category?->name;
    }
}