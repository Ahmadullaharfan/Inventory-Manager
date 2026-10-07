<?php

namespace App\Http\Controllers;

use App\Http\Requests\DeleteAccountRequest;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Totp;
use App\UserModuleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    public function __construct(private UserModuleService $users) {}

    public function index(): AnonymousResourceCollection
    {
        Gate::authorize('viewAny', User::class);

        return UserResource::collection(User::query()->latest('id')->get());
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        return (new UserResource($this->users->save(null, $request->validated(), $request)))->response()->setStatusCode(201);
    }

    public function show(User $user): UserResource
    {
        Gate::authorize('view', $user);

        return new UserResource($this->users->load($user));
    }

    public function update(UpdateUserRequest $request, User $user): UserResource
    {
        return new UserResource($this->users->save($user, $request->validated(), $request));
    }

    public function destroy(Request $request, User $user): Response
    {
        Gate::authorize('delete', $user);
        DB::transaction(function () use ($request, $user): void {
            User::where('role', 'admin')->where('status', 'active')->orderBy('id')->lockForUpdate()->get();
            $user = User::whereKey($user->id)->lockForUpdate()->firstOrFail();
            if ($user->role === 'admin' && $user->status === 'active') {
                $this->users->ensureAnotherAdmin($user);
            }
            $this->users->revokeDevices($user, $request);
            $this->users->audit($user, 'user_deleted', $request);
            $user->delete();
        });

        return response()->noContent();
    }

    public function destroyAccount(DeleteAccountRequest $request, User $user, Totp $totp): Response
    {
        DB::transaction(function () use ($request, $user, $totp): void {
            User::where('role', 'admin')->where('status', 'active')->orderBy('id')->lockForUpdate()->get();
            $user = User::whereKey($user->id)->lockForUpdate()->firstOrFail();
            if ($user->role === 'admin') {
                $this->users->ensureAnotherAdmin($user);
            }
            if ($user->two_fa_enabled && ! $this->users->verifySecondFactor($user, $request->validated('code'), $request, $totp)) {
                throw ValidationException::withMessages(['code' => 'Enter a valid authenticator or unused recovery code.']);
            }
            $this->users->revokeDevices($user, $request);
            $this->users->audit($user, 'account_deleted', $request);
            $user->delete();
        });
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->noContent();
    }
}
