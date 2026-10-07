<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserDevice;
use App\UserModuleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;

class UserDeviceController extends Controller
{
    public function __construct(private UserModuleService $users) {}

    public function index(Request $request, User $user): JsonResponse
    {
        Gate::authorize('update', $user);
        $current = $this->users->sessionHash($request);

        return response()->json(['data' => $user->devices()->latest('id')->get()->map(fn (UserDevice $device): array => array_merge($device->toArray(), ['is_current' => $user->id === $request->user()->id && $device->refresh_token_hash === $current]))]);
    }

    public function destroy(Request $request, User $user, UserDevice $device): Response
    {
        Gate::authorize('update', $user);
        $device->update(['revoked_at' => now()]);
        $user->forceFill(['remember_token' => Str::random(60)])->save();
        $this->users->audit($user, 'device_revoked', $request, ['device_id' => $device->id]);

        return response()->noContent();
    }

    public function revokeAll(Request $request, User $user): Response
    {
        Gate::authorize('update', $user);
        $this->users->revokeDevices($user, $request);
        $this->users->audit($user, 'all_devices_revoked', $request);
        if ($user->id === $request->user()->id && $request->hasSession()) {
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        return response()->noContent();
    }
}
