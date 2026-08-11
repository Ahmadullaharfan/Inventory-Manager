<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCustomerRequest extends FormRequest
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
            'customer_name' => 'required|string|max:30',
            'father_name'   => 'required|string|max:30',
            'phone_number'  => [
                'nullable',
                'string',
                'regex:/^\+?[1-9]\d{6,14}$/', // Aligned with frontend minimum lengths
                'max:20',
                Rule::unique('customers', 'phone_number')->ignore($this->route('customer')), // Ignores current record
            ],
            'email' => [
                'required',
                'email',
                'max:40',
                Rule::unique('customers', 'email')->ignore($this->route('customer')),
            ],
            'location'      => 'nullable|string|max:255',
            'attachment'    => 'nullable|file|mimes:jpg,png,pdf,doc,docx|max:5120', 
        ];
    }
}
