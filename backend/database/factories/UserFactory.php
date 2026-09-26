<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password = null;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'email' => fake()->unique()->safeEmail(),
            'phone_number' => fake()->optional()->phoneNumber(),
            'role' => fake()->randomElement(['admin', 'manager', 'user']),
            'bio' => fake()->optional()->paragraph(),
            'avatar_url' => fake()->optional()->imageUrl(200, 200, 'people'),
            'password' => static::$password ??= Hash::make('password'),
            'email_verified' => fake()->boolean(80),
            'email_verified_at' => fake()->optional(0.8)->dateTimeBetween('-1 year', 'now'),
            'two_fa_enabled' => fake()->boolean(20),
            'two_fa_secret' => null,
            'status' => fake()->randomElement(['active', 'inactive']),
            'last_login_at' => fake()->optional(0.7)->dateTimeBetween('-6 months', 'now'),
            'remember_token' => Str::random(10),
        ];
    }
}