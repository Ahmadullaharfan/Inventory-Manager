<?php

namespace App\Http\Requests;

class UpdateNotificationPreferenceRequest extends UserSettingsRequest
{
    public function rules(): array
    {
        return ['realtime_enabled' => ['sometimes', 'boolean'], 'team_alerts' => ['sometimes', 'boolean'], 'email_notifications' => ['sometimes', 'boolean']];
    }
}
