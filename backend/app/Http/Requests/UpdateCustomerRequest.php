<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateCustomerRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
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
            'phone_number'  => 'nullable|string|regex:/^\+?[1-9]\d{1,14}$/|max:20|unique:customers,phone_number',
            'email'         => 'required|email|max:40',
            'location'      => 'nullable|string|max:255',
            'attachment'    => 'nullable|file|mimes:jpg,png,pdf,doc,docx|max:5120', 
        ];
    }
}
