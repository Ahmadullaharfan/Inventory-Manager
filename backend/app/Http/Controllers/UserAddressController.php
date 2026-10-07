<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserAddressRequest;
use App\Http\Requests\UpdateUserAddressRequest;
use App\Models\User;
use App\Models\UserAddress;
use App\UserModuleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class UserAddressController extends Controller
{
    public function __construct(private UserModuleService $users) {}

    public function index(User $user): JsonResponse
    {
        Gate::authorize('update', $user);

        return response()->json(['data' => $user->addresses()->get()]);
    }

    private function saveAddress(User $user, ?UserAddress $address, array $data, Request $request): UserAddress
    {
        return DB::transaction(function () use ($user, $address, $data, $request): UserAddress {
            User::whereKey($user->id)->lockForUpdate()->firstOrFail();
            if (($data['is_primary'] ?? false) || ! $user->addresses()->exists()) {
                $user->addresses()->update(['is_primary' => false]);
                $data['is_primary'] = true;
            }
            $address = $address ?? $user->addresses()->make();
            $address->fill($data)->save();
            if (! $user->addresses()->where('is_primary', true)->exists()) {
                $user->addresses()->oldest('id')->first()->update(['is_primary' => true]);
            }
            $this->users->audit($user, 'address_saved', $request);

            return $address->fresh();
        });
    }

    public function store(StoreUserAddressRequest $request, User $user): JsonResponse
    {
        return response()->json(['data' => $this->saveAddress($user, null, $request->validated(), $request)], 201);
    }

    public function update(UpdateUserAddressRequest $request, User $user, UserAddress $address): JsonResponse
    {
        return response()->json(['data' => $this->saveAddress($user, $address, $request->validated(), $request)]);
    }

    public function destroy(Request $request, User $user, UserAddress $address): Response
    {
        Gate::authorize('update', $user);
        DB::transaction(function () use ($user, $address, $request): void {
            User::whereKey($user->id)->lockForUpdate()->firstOrFail();
            $address->delete();
            if (! $user->addresses()->where('is_primary', true)->exists()) {
                $user->addresses()->oldest('id')->first()?->update(['is_primary' => true]);
            }
            $this->users->audit($user, 'address_deleted', $request);
        });

        return response()->noContent();
    }
}
