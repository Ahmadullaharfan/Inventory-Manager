<?php

namespace App;

use App\Models\AuditLog;
use App\Models\User;
use App\Models\UserDevice;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class UserModuleService
{
    public function audit(User $user, string $event, Request $request, array $meta = []): void
    {
        AuditLog::create([
            'user_id' => $user->id,
            'event' => $event,
            'ip_address' => $request->ip(),
            'user_agent' => mb_substr($request->userAgent() ?? '', 0, 500),
            'meta' => array_merge($meta, ['actor_id' => $request->user()?->id]),
        ]);
    }

    public function load(User $user): User
    {
        return $user->load(['addresses', 'socialLinks', 'notificationPreference']);
    }

    public function save(?User $user, array $data, Request $request): User
    {
        $oldAvatar = $user?->avatar_url;
        $newAvatar = $request->hasFile('avatar') ? $request->file('avatar')->store('avatars', 'public') : null;
        try {
            $saved = DB::transaction(function () use ($user, $data, $request, $newAvatar): User {
                User::where('role', 'admin')->where('status', 'active')->orderBy('id')->lockForUpdate()->get();
                $creating = $user === null;
                $model = $creating ? new User : User::whereKey($user->id)->lockForUpdate()->firstOrFail();
                if (! $creating && $model->role === 'admin' && $model->status === 'active' && (($data['role'] ?? $model->role) !== 'admin' || ($data['status'] ?? $model->status) !== 'active')) {
                    $this->ensureAnotherAdmin($model);
                }
                $fields = Arr::except($data, ['addresses', 'social_links', 'notification_preferences', 'avatar', 'remove_avatar', 'password_confirmation', 'current_password']);
                if (empty($fields['password'])) {
                    unset($fields['password']);
                }
                if (isset($fields['email']) && $fields['email'] !== $model->email) {
                    $fields['email_verified'] = false;
                    $fields['email_verified_at'] = null;
                }
                if (array_key_exists('email_verified', $data)) {
                    $fields['email_verified'] = $data['email_verified'];
                    $fields['email_verified_at'] = $data['email_verified'] ? now() : null;
                }
                if ($newAvatar || ($data['remove_avatar'] ?? false)) {
                    $fields['avatar_url'] = $newAvatar;
                }
                $model->fill($fields)->save();
                if (array_key_exists('addresses', $data)) {
                    $model->addresses()->delete();
                    $model->addresses()->createMany($data['addresses']);
                }
                if (array_key_exists('social_links', $data)) {
                    $model->socialLinks()->delete();
                    $model->socialLinks()->createMany($data['social_links']);
                }
                $model->notificationPreference()->updateOrCreate(['user_id' => $model->id], $data['notification_preferences'] ?? []);
                if (! $creating && isset($fields['password'])) {
                    $this->revokeDevices($model, $request, $request->user()?->id === $model->id);
                    if ($request->hasSession() && $request->user()?->id === $model->id) {
                        $request->session()->put('password_hash_web', $model->password);
                    }
                    $this->audit($model, 'password_changed', $request);
                }
                if ($model->status !== 'active') {
                    $this->revokeDevices($model, $request);
                }
                $this->audit($model, $creating ? 'user_created' : 'profile_updated', $request, ['fields' => array_keys(Arr::except($fields, ['password']))]);

                return $model;
            });
        } catch (\Throwable $exception) {
            if ($newAvatar) {
                Storage::disk('public')->delete($newAvatar);
            }
            throw $exception;
        }
        if ($oldAvatar && $oldAvatar !== $saved->avatar_url && ! filter_var($oldAvatar, FILTER_VALIDATE_URL)) {
            Storage::disk('public')->delete($oldAvatar);
        }

        return $this->load($saved);
    }

    public function ensureAnotherAdmin(User $user): void
    {
        if (! User::where('role', 'admin')->where('status', 'active')->whereKeyNot($user->id)->exists()) {
            throw ValidationException::withMessages(['role' => 'Keep at least one active administrator.']);
        }
    }

    public function recordDevice(User $user, Request $request): UserDevice
    {
        $device = $user->devices()->create([
            'device_name' => mb_substr($request->userAgent() ?? 'Browser', 0, 255),
            'ip_address' => $request->ip(),
            'user_agent' => mb_substr($request->userAgent() ?? '', 0, 500),
            'refresh_token_hash' => $this->sessionHash($request),
            'last_used_at' => now(),
        ]);
        $request->session()->put('user_device_id', $device->id);

        return $device;
    }

    public function sessionHash(Request $request): ?string
    {
        return $request->hasSession() ? hash('sha256', $request->session()->getId()) : null;
    }

    public function revokeDevices(User $user, Request $request, bool $keepCurrent = false): void
    {
        $user->forceFill(['remember_token' => Str::random(60)])->save();
        $devices = $user->devices()->whereNull('revoked_at');
        if ($keepCurrent && $this->sessionHash($request)) {
            $devices->where('refresh_token_hash', '!=', $this->sessionHash($request));
        }
        $devices->update(['revoked_at' => now()]);
        $user->tokens()->delete();
        if (config('session.driver') === 'database') {
            $sessions = DB::table(config('session.table', 'sessions'))->where('user_id', $user->id);
            if ($keepCurrent && $request->hasSession()) {
                $sessions->where('id', '!=', $request->session()->getId());
            }
            $sessions->delete();
        }
    }

    public function verifySecondFactor(User $user, string $code, Request $request, Totp $totp): bool
    {
        $counter = $user->two_fa_secret ? $totp->verify($user->two_fa_secret, $code) : null;
        if ($counter !== null) {
            $last = $user->auditLogs()->where('event', 'two_fa_verified')->latest('id')->first();
            if ($counter <= ($last?->meta['counter'] ?? -1)) {
                return false;
            }
            $this->audit($user, 'two_fa_verified', $request, ['counter' => $counter]);

            return true;
        }
        foreach ($user->recoveryCodes()->whereNull('used_at')->lockForUpdate()->get() as $recovery) {
            if (Hash::check($code, $recovery->code_hash)) {
                $recovery->update(['used_at' => now()]);
                $this->audit($user, 'recovery_code_used', $request);

                return true;
            }
        }

        return false;
    }

    public function recoveryCodes(User $user): array
    {
        $user->recoveryCodes()->delete();
        $codes = [];
        for ($index = 0; $index < 8; $index++) {
            $code = Str::random(12);
            $user->recoveryCodes()->create(['code_hash' => Hash::make($code)]);
            $codes[] = $code;
        }

        return $codes;
    }
}
