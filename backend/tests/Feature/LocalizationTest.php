<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('authentication validation uses the requested supported language', function (string $language, string $message) {
    $this->withHeader('Accept-Language', $language)->postJson('/api/auth/login', [])
        ->assertUnprocessable()->assertJsonPath('errors.email.0', $message);
})->with([
    'English' => ['en', 'The email field is required.'],
    'Pashto' => ['ps', 'برېښنالیک اړین دی.'],
    'Dari' => ['fa-AF', 'ایمیل الزامی است.'],
    'regional Pashto' => ['ps-AF', 'برېښنالیک اړین دی.'],
    'weighted Dari' => ['de;q=1, fa-AF;q=0.9, en;q=0.5', 'ایمیل الزامی است.'],
    'unsupported language' => ['ar', 'The email field is required.'],
]);

test('API profile validation uses the selected language', function () {
    $user = User::factory()->create();
    $this->actingAs($user)->withHeader('Accept-Language', 'fa-AF')->putJson('/api/users/'.$user->id, ['email' => 'invalid'])
        ->assertUnprocessable()->assertJsonPath('errors.email.0', 'ایمیل باید یک ایمیل معتبر باشد.');
});

test('requests without a supported language return to English', function () {
    $this->withHeader('Accept-Language', 'ps')->postJson('/api/auth/login', [])->assertUnprocessable()->assertJsonPath('errors.email.0', 'برېښنالیک اړین دی.');
    $this->withoutHeader('Accept-Language')->postJson('/api/auth/login', [])->assertUnprocessable()->assertJsonPath('errors.email.0', 'The email field is required.');
});
