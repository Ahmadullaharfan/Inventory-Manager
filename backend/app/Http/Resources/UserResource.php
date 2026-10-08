<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $private = $request->user()?->id === $this->id || $request->user()?->role === 'admin';
        $avatar = $this->avatar_url;

        return [
            'id' => $this->id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'email' => $this->email,
            'phone_number' => $this->phone_number,
            'bio' => $this->bio,
            'role' => $this->role,
            'status' => $this->status,
            'avatar_url' => $avatar ? (filter_var($avatar, FILTER_VALIDATE_URL) ? $avatar : asset('storage/'.$avatar)) : null,
            'email_verified' => $this->email_verified,
            'two_fa_enabled' => $this->two_fa_enabled,
            'last_login_at' => $this->last_login_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
            'addresses' => $this->when($private, $this->whenLoaded('addresses')),
            'social_links' => $this->whenLoaded('socialLinks'),
            'notification_preferences' => $this->when($private, $this->whenLoaded('notificationPreference', fn ($preferences): array => $preferences->only(['realtime_enabled', 'team_alerts', 'email_notifications']))),
        ];
    }
}
