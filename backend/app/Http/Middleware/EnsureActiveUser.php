<?php

namespace App\Http\Middleware;

use App\UserModuleService;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureActiveUser
{
    public function __construct(private UserModuleService $users) {}

    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user()?->fresh();
        $request->setUserResolver(fn () => $user);
        $device = $user?->devices()->where('refresh_token_hash', $this->users->sessionHash($request))->first();
        $missingDevice = $request->hasSession() && $request->session()->has('user_device_id') && ! $device;
        if (! $user || $user->status !== 'active' || $device?->revoked_at || $missingDevice) {
            if ($request->hasSession()) {
                Auth::guard('web')->logout();
                $request->session()->invalidate();
            }

            return response()->json(['message' => 'Your session has ended. Please sign in again.'], 401);
        }
        if (! $device && $request->hasSession() && Auth::guard('web')->viaRemember()) {
            $device = $this->users->recordDevice($user, $request);
            $this->users->audit($user, 'session_resumed', $request);
        }
        Auth::guard('web')->setUser($user);
        Auth::guard('sanctum')->setUser($user);
        if ($device && (! $device->last_used_at || $device->last_used_at->lt(now()->subMinutes(5)))) {
            $device->update(['last_used_at' => now()]);
        }

        return $next($request);
    }
}
