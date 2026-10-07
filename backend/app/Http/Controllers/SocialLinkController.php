<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSocialLinkRequest;
use App\Http\Requests\UpdateSocialLinkRequest;
use App\Models\SocialLink;
use App\Models\User;
use App\UserModuleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Gate;

class SocialLinkController extends Controller
{
    public function __construct(private UserModuleService $users) {}

    public function index(User $user): JsonResponse
    {
        Gate::authorize('view', $user);

        return response()->json(['data' => $user->socialLinks()->get()]);
    }

    public function store(StoreSocialLinkRequest $request, User $user): JsonResponse
    {
        $link = $user->socialLinks()->create($request->validated());
        $this->users->audit($user, 'social_link_saved', $request);

        return response()->json(['data' => $link], 201);
    }

    public function update(UpdateSocialLinkRequest $request, User $user, SocialLink $socialLink): JsonResponse
    {
        $socialLink->update($request->validated());
        $this->users->audit($user, 'social_link_saved', $request);

        return response()->json(['data' => $socialLink]);
    }

    public function destroy(Request $request, User $user, SocialLink $socialLink): Response
    {
        Gate::authorize('update', $user);
        $socialLink->delete();
        $this->users->audit($user, 'social_link_deleted', $request);

        return response()->noContent();
    }
}
