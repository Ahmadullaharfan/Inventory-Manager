<?php

namespace App\Http\Requests;

class StoreUserAddressRequest extends UserSettingsRequest
{
    public function rules(): array
    {
        return ['country' => ['nullable', 'string', 'max:100'], 'city_state' => ['nullable', 'string', 'max:150'], 'postal_code' => ['nullable', 'string', 'max:20'], 'tax_id' => ['nullable', 'string', 'max:50'], 'is_primary' => ['sometimes', 'boolean']];
    }
}
