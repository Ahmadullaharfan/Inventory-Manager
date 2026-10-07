<?php

namespace App\Http\Requests;

class UpdateUserRequest extends StoreUserRequest
{
    public function authorize(): bool
    {
        $target = $this->route('user');

        return $target && ($this->user()?->can('update', $target) ?? false);
    }

    public function rules(): array
    {
        return $this->profileRules(false);
    }
}
