<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSupplierRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // 1. CHANGED TO TRUE: Allows the request to proceed to validation
        return true; 
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // 2. Fetch the current supplier ID from the route parameter
        // Assumes your route looks like: api/suppliers/{supplier}
        $supplierId = $this->route('supplier');

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('suppliers', 'name')->ignore($supplierId), // Ignores current supplier
            ],
            'contact_person' => 'nullable|string|max:255',
            'phone' => [
                'required',
                'string',
                'max:20',
                Rule::unique('suppliers', 'phone')->ignore($supplierId), // Ignores current supplier
            ],
            'email' => [
                'nullable',
                'email',
                'max:255',
                Rule::unique('suppliers', 'email')->ignore($supplierId), // Ignores current supplier
            ],
            'address' => 'nullable|string',
            'country' => 'nullable|string|max:255',
        ];
    }
}
