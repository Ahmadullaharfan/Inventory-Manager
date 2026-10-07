<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;

class StoreSocialLinkRequest extends UserSettingsRequest
{
    public function rules(): array
    {
        return ['platform' => ['required', 'string', 'max:50', 'regex:/^[a-z0-9_-]+$/', Rule::unique('social_links')->where('user_id', $this->route('user')->id)->ignore($this->route('socialLink')?->id)], 'url' => ['required', 'url:http,https', 'max:500']];
    }
}
