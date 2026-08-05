<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'product_category_id' => 'nullable|exists:product_categories,id',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'brand' => 'nullable|string|max:255',
            'cost_price' => 'required|numeric|min:0',
            'unit_of_measure' => 'required|string|max:50',
            'units_per_package' => 'required|integer|min:1',
            'location' => 'nullable|string|max:255',
            'is_active' => 'boolean',
            'image' => 'nullable|image|max:2048', // Max 2MB
        ];
    }
}
