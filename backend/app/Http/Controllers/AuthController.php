<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Totp;
use App\UserModuleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function __construct(private UserModuleService $users, private Totp $totp) {}

    public function register(RegisterRequest $request): JsonResponse
    {
        $user = $this->users->save(null, array_merge($request->validated(), ['role' => 'user', 'status' => 'active']), $request);
        $this->signIn($user, $request);

        return (new UserResource($this->users->load($user)))->response()->setStatusCode(201);
    }

    public function login(LoginRequest $request): UserResource
    {
        $user = DB::transaction(function () use ($request): User {
            $user = User::where('email', $request->validated('email'))->lockForUpdate()->first();
            if (! $user || ! Hash::check($request->validated('password'), $user->password) || $user->status !== 'active') {
                throw ValidationException::withMessages(['email' => __('The credentials are incorrect or the account is inactive.')]);
            }
            if ($user->two_fa_enabled && ! $this->users->verifySecondFactor($user, $request->validated('code') ?? '', $request, $this->totp)) {
                throw ValidationException::withMessages(['code' => __('Enter a valid authenticator or unused recovery code.')]);
            }

            return $user;
        });
        $this->signIn($user, $request);

        return new UserResource($this->users->load($user));
    }

    private function signIn(User $user, Request $request): void
    {
        Auth::guard('web')->login($user, (bool) $request->input('remember', false));
        $request->session()->regenerate();
        $request->session()->put('password_hash_web', $user->password);
        $user->update(['last_login_at' => now()]);
        $this->users->recordDevice($user, $request);
        $this->users->audit($user, 'login', $request);
    }

    public function me(Request $request): UserResource
    {
        return new UserResource($this->users->load($request->user()));
    }

    public function logout(Request $request): Response
    {
        $user = $request->user();
        $user->devices()->where('refresh_token_hash', $this->users->sessionHash($request))->update(['revoked_at' => now()]);
        $this->users->audit($user, 'logout', $request);
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->noContent();
    }
}
