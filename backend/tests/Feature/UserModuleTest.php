<?php

use App\Models\User;
use App\Totp;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->withHeader('Origin', 'http://localhost:4200')->withCredentials();
});

function userAuthRequest($test, string $url, array $data = [])
{
    $response = $test->postJson($url, $data);
    $cookies = [];
    foreach ($response->headers->getCookies() as $cookie) {
        $cookies[$cookie->getName()] = $cookie->getValue();
    }
    $test->withUnencryptedCookies($cookies);

    return $response;
}

function userPayload(array $extra = []): array
{
    return array_merge([
        'first_name' => 'Amina', 'last_name' => 'Ahmad', 'email' => 'amina@example.test',
        'password' => 'new-password-123', 'password_confirmation' => 'new-password-123', 'role' => 'user',
        'phone_number' => '+93 700 000 000', 'bio' => 'Inventory assistant',
        'addresses' => [['country' => 'Afghanistan', 'city_state' => 'Kabul', 'is_primary' => true]],
        'social_links' => [['platform' => 'github', 'url' => 'https://github.com/amina']],
        'notification_preferences' => ['email_notifications' => false, 'team_alerts' => false, 'realtime_enabled' => true],
    ], $extra);
}

test('user APIs require authentication and enforce roles', function () {
    $this->getJson('/api/users')->assertUnauthorized();
    $ordinary = User::factory()->create();
    $target = User::factory()->create();
    $this->actingAs($ordinary)->getJson('/api/users')->assertForbidden();
    $this->actingAs($ordinary)->postJson('/api/users', userPayload())->assertForbidden();
    $this->actingAs($ordinary)->getJson('/api/users/'.$target->id)->assertForbidden();
    $this->actingAs($ordinary)->putJson('/api/users/'.$target->id, ['bio' => 'No'])->assertForbidden();
    $manager = User::factory()->create(['role' => 'manager']);
    $this->actingAs($manager)->getJson('/api/users')->assertSuccessful();
    $this->actingAs($manager)->deleteJson('/api/users/'.$target->id)->assertForbidden();
});

test('administrator saves and retrieves a complete user profile', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $response = $this->actingAs($admin)->postJson('/api/users', userPayload(['email_verified' => true]))->assertCreated();
    $id = $response->json('data.id');
    $response->assertJsonPath('data.phone_number', '+93 700 000 000')->assertJsonPath('data.bio', 'Inventory assistant')->assertJsonPath('data.email_verified', true)->assertJsonMissingPath('data.password')->assertJsonMissingPath('data.two_fa_secret');
    expect(Hash::check('new-password-123', User::find($id)->password))->toBeTrue();
    $this->getJson('/api/users/'.$id)->assertJsonPath('data.addresses.0.country', 'Afghanistan')->assertJsonPath('data.social_links.0.platform', 'github')->assertJsonPath('data.notification_preferences.email_notifications', false);
    $this->getJson('/api/users/'.$id.'/audit-logs')->assertJsonPath('data.0.event', 'user_created');
});

test('partial profile updates retain passwords and reset verification on email change', function () {
    $user = User::factory()->create(['email_verified' => true, 'email_verified_at' => now()]);
    $old = $user->password;
    $this->actingAs($user)->putJson('/api/users/'.$user->id, ['email' => $user->email, 'bio' => 'Updated'])->assertSuccessful();
    expect($user->fresh()->password)->toBe($old);
    $this->putJson('/api/users/'.$user->id, ['email' => 'changed@example.test'])->assertJsonPath('data.email_verified', false);
    $this->putJson('/api/users/'.$user->id, ['role' => 'admin'])->assertUnprocessable()->assertJsonValidationErrors('role');
    $this->putJson('/api/users/'.$user->id, ['password' => 'changed-password', 'password_confirmation' => 'changed-password'])->assertUnprocessable()->assertJsonValidationErrors('current_password');
    $this->putJson('/api/users/'.$user->id, ['current_password' => 'password', 'password' => 'changed-password', 'password_confirmation' => 'changed-password'])->assertSuccessful();
    expect(Hash::check('changed-password', $user->fresh()->password))->toBeTrue();
});

test('invalid user data is rejected without partial writes', function (array $invalid, string $field) {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin)->postJson('/api/users', userPayload($invalid))->assertUnprocessable()->assertJsonValidationErrors($field);
    expect(User::where('email', 'amina@example.test')->exists())->toBeFalse();
})->with([
    'long name' => [['first_name' => str_repeat('a', 101)], 'first_name'],
    'invalid boolean' => [['email_verified' => 'not-a-boolean'], 'email_verified'],
    'duplicate social platforms' => [['social_links' => [['platform' => 'github', 'url' => 'https://github.com/a'], ['platform' => 'github', 'url' => 'https://github.com/b']]], 'social_links.0.platform'],
    'unsafe URL' => [['social_links' => [['platform' => 'x', 'url' => 'javascript:alert(1)']]], 'social_links.0.url'],
    'two primary addresses' => [['addresses' => [['is_primary' => true], ['is_primary' => true]]], 'addresses'],
]);

test('avatars are uploaded replaced and removed', function () {
    Storage::fake('public');
    $admin = User::factory()->create(['role' => 'admin']);
    $response = $this->actingAs($admin)->postJson('/api/users', userPayload(['avatar' => UploadedFile::fake()->image('avatar.jpg')]))->assertCreated();
    $user = User::find($response->json('data.id'));
    $old = $user->avatar_url;
    Storage::disk('public')->assertExists($old);
    $this->putJson('/api/users/'.$user->id, ['avatar' => UploadedFile::fake()->image('new.jpg')])->assertSuccessful();
    Storage::disk('public')->assertMissing($old);
    $new = $user->fresh()->avatar_url;
    $this->putJson('/api/users/'.$user->id, ['remove_avatar' => true])->assertJsonPath('data.avatar_url', null);
    Storage::disk('public')->assertMissing($new);
});

test('nested user resources cannot be accessed through another user', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $a = User::factory()->create();
    $b = User::factory()->create();
    $address = $b->addresses()->create(['country' => 'Other', 'is_primary' => true]);
    $this->actingAs($admin)->deleteJson('/api/users/'.$a->id.'/addresses/'.$address->id)->assertNotFound();
    expect($address->fresh())->not->toBeNull();
    $device = $b->devices()->create(['device_name' => 'Other']);
    $this->deleteJson('/api/users/'.$a->id.'/devices/'.$device->id)->assertNotFound();
});

test('primary addresses and false notification preferences persist', function () {
    $user = User::factory()->create();
    $this->actingAs($user)->postJson('/api/users/'.$user->id.'/addresses', ['country' => 'A'])->assertCreated();
    $second = $this->postJson('/api/users/'.$user->id.'/addresses', ['country' => 'B', 'is_primary' => true])->assertCreated()->json('data.id');
    expect($user->addresses()->where('is_primary', true)->sole()->id)->toBe($second);
    $this->deleteJson('/api/users/'.$user->id.'/addresses/'.$second)->assertNoContent();
    expect($user->addresses()->where('is_primary', true)->count())->toBe(1);
    $this->putJson('/api/users/'.$user->id.'/notification-preferences', ['email_notifications' => false])->assertJsonPath('data.email_notifications', false);
});

test('deleting a user revokes devices and soft deletes the account', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $target = User::factory()->create();
    $device = $target->devices()->create(['device_name' => 'Browser']);
    $this->actingAs($admin)->deleteJson('/api/users/'.$target->id)->assertNoContent();
    $this->assertSoftDeleted($target);
    expect($device->fresh()->revoked_at)->not->toBeNull();
    $this->getJson('/api/users/'.$target->id)->assertNotFound();
    $this->deleteJson('/api/users/'.$admin->id)->assertForbidden();
});

test('last active administrator cannot be demoted or suspended', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin)->putJson('/api/users/'.$admin->id, ['role' => 'user'])->assertUnprocessable();
    $this->putJson('/api/users/'.$admin->id, ['status' => 'inactive'])->assertUnprocessable();
});

test('registration cannot grant admin and login creates a device', function () {
    $registration = ['first_name' => 'New', 'last_name' => 'User', 'email' => 'new@example.test', 'password' => 'new-password', 'password_confirmation' => 'new-password'];
    userAuthRequest($this, '/api/auth/register', $registration + ['role' => 'admin'])->assertUnprocessable();
    userAuthRequest($this, '/api/auth/register', $registration)->assertCreated()->assertJsonPath('data.role', 'user');
    $user = User::where('email', 'new@example.test')->sole();
    expect($user->devices()->count())->toBe(1);
    userAuthRequest($this, '/api/auth/logout')->assertNoContent();
    userAuthRequest($this, '/api/auth/login', ['email' => $user->email, 'password' => 'wrong'])->assertUnprocessable();
    userAuthRequest($this, '/api/auth/login', ['email' => $user->email, 'password' => 'new-password'])->assertSuccessful();
    $user->update(['status' => 'inactive']);
    $this->getJson('/api/auth/me')->assertUnauthorized();
});

test('two factor setup confirmation and single use recovery work', function () {
    $user = User::factory()->create();
    $setup = $this->actingAs($user)->postJson('/api/users/'.$user->id.'/two-factor/setup', ['current_password' => 'password'])->assertSuccessful()->json('data.secret');
    $code = (new Totp)->code($setup, intdiv(time(), 30));
    $confirmed = $this->postJson('/api/users/'.$user->id.'/two-factor/confirm', ['code' => $code])->assertSuccessful();
    $recovery = $confirmed->json('data.recovery_codes.0');
    expect($user->fresh()->two_fa_enabled)->toBeTrue();
    expect($user->fresh()->getRawOriginal('two_fa_secret'))->not->toBe($setup);
    userAuthRequest($this, '/api/auth/logout')->assertNoContent();
    userAuthRequest($this, '/api/auth/login', ['email' => $user->email, 'password' => 'password'])->assertUnprocessable()->assertJsonValidationErrors('code');
    userAuthRequest($this, '/api/auth/login', ['email' => $user->email, 'password' => 'password', 'code' => $recovery])->assertSuccessful();
    userAuthRequest($this, '/api/auth/logout')->assertNoContent();
    userAuthRequest($this, '/api/auth/login', ['email' => $user->email, 'password' => 'password', 'code' => $recovery])->assertUnprocessable();
});

test('revoking the current device ends its session and rotates remembered access', function () {
    $user = User::factory()->create();
    userAuthRequest($this, '/api/auth/login', ['email' => $user->email, 'password' => 'password', 'remember' => true])->assertSuccessful();
    $remember = $user->fresh()->remember_token;
    $device = $this->getJson('/api/users/'.$user->id.'/devices')->assertSuccessful()->json('data.0');
    expect($device['is_current'])->toBeTrue();
    expect($device)->not->toHaveKey('refresh_token_hash');
    $this->deleteJson('/api/users/'.$user->id.'/devices/'.$device['id'])->assertNoContent();
    expect($user->fresh()->remember_token)->not->toBe($remember);
    $this->getJson('/api/auth/me')->assertUnauthorized();
});

test('logout all devices invalidates the current session', function () {
    $user = User::factory()->create();
    userAuthRequest($this, '/api/auth/login', ['email' => $user->email, 'password' => 'password'])->assertSuccessful();
    $this->deleteJson('/api/users/'.$user->id.'/devices')->assertNoContent();
    $this->getJson('/api/auth/me')->assertUnauthorized();
});

test('authenticator codes cannot be replayed', function () {
    $totp = new Totp;
    $secret = $totp->secret();
    $user = User::factory()->create(['two_fa_enabled' => true, 'two_fa_secret' => $secret]);
    $credentials = ['email' => $user->email, 'password' => 'password', 'code' => $totp->code($secret, intdiv(time(), 30))];
    userAuthRequest($this, '/api/auth/login', $credentials)->assertSuccessful();
    userAuthRequest($this, '/api/auth/logout')->assertNoContent();
    userAuthRequest($this, '/api/auth/login', $credentials)->assertUnprocessable()->assertJsonValidationErrors('code');
});

test('account deletion requires password and protects the last administrator', function () {
    $user = User::factory()->create();
    $this->actingAs($user)->deleteJson('/api/users/'.$user->id.'/account', ['current_password' => 'wrong'])->assertUnprocessable();
    $this->deleteJson('/api/users/'.$user->id.'/account', ['current_password' => 'password'])->assertNoContent();
    $this->assertSoftDeleted($user);
    $admin = User::factory()->create(['role' => 'admin']);
    $this->actingAs($admin)->deleteJson('/api/users/'.$admin->id.'/account', ['current_password' => 'password'])->assertUnprocessable();
});
