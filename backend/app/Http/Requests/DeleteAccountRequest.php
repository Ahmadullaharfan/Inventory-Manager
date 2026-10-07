<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;

class DeleteAccountRequest extends UserSettingsRequest
{
    public function authorize(): bool
    {
        return $this->route('user')?->id === $this->user()?->id;
    }

    public function rules(): array
    {
        return [
            'current_password' => ['required', 'string', 'current_password:web'],
            'code' => [Rule::requiredIf($this->user()->two_fa_enabled), 'nullable', 'string', 'max:100'],
        ];
    }
}
