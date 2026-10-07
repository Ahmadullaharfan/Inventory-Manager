<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateNotificationPreferenceRequest;
use App\Models\User;
use App\UserModuleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class NotificationPreferenceController extends Controller
{
    public function __construct(private UserModuleService $users) {}

    public function show(User $user): JsonResponse
    {
        Gate::authorize('update', $user);

        return response()->json(['data' => $user->notificationPreference()->firstOrCreate(['user_id' => $user->id])->fresh()]);
    }

    public function update(UpdateNotificationPreferenceRequest $request, User $user): JsonResponse
    {
        $preference = $user->notificationPreference()->updateOrCreate(['user_id' => $user->id], $request->validated());
        $this->users->audit($user, 'notification_preferences_updated', $request);

        return response()->json(['data' => $preference->fresh()]);
    }
}
