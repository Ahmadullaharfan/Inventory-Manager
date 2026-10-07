<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', User::class) ?? false;
    }

    public function rules(): array
    {
        return $this->profileRules(true);
    }

    protected function profileRules(bool $creating): array
    {
        $required = $creating ? 'required' : 'sometimes';
        $target = $this->route('user');
        $admin = $this->user()?->role === 'admin';

        return [
            'first_name' => [$required, 'required', 'string', 'max:100'],
            'last_name' => [$required, 'required', 'string', 'max:100'],
            'email' => [$required, 'required', 'email', 'max:255', Rule::unique('users')->ignore($target?->id)],
            'phone_number' => ['sometimes', 'nullable', 'string', 'max:30'],
            'bio' => ['sometimes', 'nullable', 'string', 'max:5000'],
            'role' => [$required, Rule::prohibitedIf(! $admin), Rule::in(['admin', 'manager', 'user'])],
            'status' => ['sometimes', Rule::prohibitedIf(! $admin), Rule::in(['active', 'inactive', 'suspended'])],
            'email_verified' => ['sometimes', Rule::prohibitedIf(! $admin), 'boolean'],
            'password' => [$creating ? 'required' : 'sometimes', 'nullable', 'string', 'min:8', 'max:255', 'confirmed'],
            'current_password' => [Rule::requiredIf(! $creating && $this->filled('password') && $target?->id === $this->user()?->id), 'nullable', 'string', 'current_password:web'],
            'avatar' => ['sometimes', 'nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],
            'remove_avatar' => ['sometimes', 'boolean'],
            'addresses' => ['sometimes', 'array', 'max:10'],
            'addresses.*' => ['array:country,city_state,postal_code,tax_id,is_primary'],
            'addresses.*.country' => ['nullable', 'string', 'max:100'],
            'addresses.*.city_state' => ['nullable', 'string', 'max:150'],
            'addresses.*.postal_code' => ['nullable', 'string', 'max:20'],
            'addresses.*.tax_id' => ['nullable', 'string', 'max:50'],
            'addresses.*.is_primary' => ['required', 'boolean'],
            'social_links' => ['sometimes', 'array', 'max:10'],
            'social_links.*' => ['array:platform,url'],
            'social_links.*.platform' => ['required', 'string', 'max:50', 'distinct:strict', 'regex:/^[a-z0-9_-]+$/'],
            'social_links.*.url' => ['required', 'url:http,https', 'max:500'],
            'notification_preferences' => ['sometimes', 'array:realtime_enabled,team_alerts,email_notifications'],
            'notification_preferences.realtime_enabled' => ['sometimes', 'boolean'],
            'notification_preferences.team_alerts' => ['sometimes', 'boolean'],
            'notification_preferences.email_notifications' => ['sometimes', 'boolean'],
        ];
    }

    public function after(): array
    {
        return [function ($validator): void {
            $addresses = $this->input('addresses', []);
            if (is_array($addresses) && count($addresses) > 0) {
                $primary = collect($addresses)->filter(fn ($address) => is_array($address) && in_array($address['is_primary'] ?? false, [true, 1, '1'], true))->count();
                if ($primary !== 1) {
                    $validator->errors()->add('addresses', 'Choose exactly one primary address.');
                }
            }
        }];
    }

    protected function prepareForValidation(): void
    {
        foreach (['addresses', 'social_links', 'notification_preferences'] as $field) {
            if (is_string($this->input($field))) {
                $decoded = json_decode($this->input($field), true);
                if (json_last_error() === JSON_ERROR_NONE) {
                    $this->merge([$field => $decoded]);
                }
            }
        }
        foreach (['email_verified', 'remove_avatar'] as $field) {
            if (in_array($this->input($field), ['true', 'false'], true)) {
                $this->merge([$field => $this->input($field) === 'true']);
            }
        }
    }
}
