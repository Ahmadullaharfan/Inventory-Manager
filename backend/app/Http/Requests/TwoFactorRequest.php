<?php

namespace App\Http\Requests;

class TwoFactorRequest extends UserSettingsRequest
{
    public function authorize(): bool
    {
        return $this->route('user')?->id === $this->user()?->id;
    }

    public function rules(): array
    {
        $action = $this->route()->getActionMethod();

        return match ($action) {
            'setup' => ['current_password' => ['required', 'string', 'current_password:web']],
            'confirm' => ['code' => ['required', 'string', 'regex:/^\d{6}$/']],
            default => ['current_password' => ['required', 'string', 'current_password:web'], 'code' => ['required', 'string', 'max:100']],
        };
    }
}
