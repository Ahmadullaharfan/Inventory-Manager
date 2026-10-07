<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        $target = $this->route('user');

        return $target && ($this->user()?->can('update', $target) ?? false);
    }

    public function rules(): array
    {
        return [];
    }
}
