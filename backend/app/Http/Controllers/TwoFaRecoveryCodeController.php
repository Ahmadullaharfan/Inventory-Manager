<?php

namespace App\Http\Controllers;

use App\Http\Requests\TwoFactorRequest;
use App\Models\User;
use App\Totp;
use App\UserModuleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class TwoFaRecoveryCodeController extends Controller
{
    public function __construct(private UserModuleService $users, private Totp $totp) {}

    private function authorizeOwner(TwoFactorRequest $request, User $user): void
    {
        abort_unless($request->user()->id === $user->id, 403);
    }

    public function setup(TwoFactorRequest $request, User $user): JsonResponse
    {
        $this->authorizeOwner($request, $user);
        abort_if($user->two_fa_enabled, 409, 'Two-factor authentication is already enabled.');
        $secret = $this->totp->secret();
        $request->session()->put('two_fa_setup', ['user_id' => $user->id, 'secret' => encrypt($secret), 'expires_at' => now()->addMinutes(10)->timestamp]);
        $label = rawurlencode(config('app.name').':'.$user->email);

        return response()->json(['data' => ['secret' => $secret, 'uri' => 'otpauth://totp/'.$label.'?secret='.$secret.'&issuer='.rawurlencode(config('app.name')).'&algorithm=SHA1&digits=6&period=30']]);
    }

    public function confirm(TwoFactorRequest $request, User $user): JsonResponse
    {
        $this->authorizeOwner($request, $user);
        $setup = $request->session()->get('two_fa_setup');
        if (! $setup || $setup['user_id'] !== $user->id || $setup['expires_at'] < now()->timestamp || $this->totp->verify(decrypt($setup['secret']), $request->string('code')->toString()) === null) {
            throw ValidationException::withMessages(['code' => 'The code is invalid or setup expired. Start setup again.']);
        }
        $codes = DB::transaction(function () use ($user, $setup, $request): array {
            $user = User::whereKey($user->id)->lockForUpdate()->firstOrFail();
            abort_if($user->two_fa_enabled, 409);
            $user->update(['two_fa_secret' => decrypt($setup['secret']), 'two_fa_enabled' => true]);
            $codes = $this->users->recoveryCodes($user);
            $this->users->revokeDevices($user, $request, true);
            $this->users->audit($user, 'two_fa_enabled', $request);

            return $codes;
        });
        $request->session()->forget('two_fa_setup');

        return response()->json(['data' => ['recovery_codes' => $codes]]);
    }

    private function confirmSecurity(TwoFactorRequest $request, User $user): void
    {
        $this->authorizeOwner($request, $user);
        if (! $user->two_fa_enabled || ! $this->users->verifySecondFactor($user, $request->string('code')->toString(), $request, $this->totp)) {
            throw ValidationException::withMessages(['code' => 'Enter a valid authenticator or unused recovery code.']);
        }
    }

    public function regenerate(TwoFactorRequest $request, User $user): JsonResponse
    {
        $codes = DB::transaction(function () use ($request, $user): array {
            $user = User::whereKey($user->id)->lockForUpdate()->firstOrFail();
            $this->confirmSecurity($request, $user);
            $this->users->audit($user, 'recovery_codes_regenerated', $request);

            return $this->users->recoveryCodes($user);
        });

        return response()->json(['data' => ['recovery_codes' => $codes]]);
    }

    public function destroy(TwoFactorRequest $request, User $user): Response
    {
        DB::transaction(function () use ($request, $user): void {
            $user = User::whereKey($user->id)->lockForUpdate()->firstOrFail();
            $this->confirmSecurity($request, $user);
            $user->update(['two_fa_enabled' => false, 'two_fa_secret' => null]);
            $user->recoveryCodes()->delete();
            $this->users->audit($user, 'two_fa_disabled', $request);
        });
        $request->session()->forget('two_fa_setup');

        return response()->noContent();
    }
}
