<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'name' => $this->name,
            'brand' => $this->brand,
            'description' => $this->description,
            'location' => $this->location,

            'image_url' => $this->image
                ? asset('storage/' . $this->image)
                : null,

            'cost_price' => (float) $this->cost_price,

            'unit_of_measure' => $this->unit_of_measure,
            'units_per_package' => (int) $this->units_per_package,

            'is_active' => (bool) $this->is_active,

            'product_category_id' => $this->product_category_id,
            'supplier_id' => $this->supplier_id,

            'category' => new CategoryResource(
                $this->whenLoaded('category')
            ),

            'supplier' => new SupplierResource(
                $this->whenLoaded('supplier')
            ),

            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}