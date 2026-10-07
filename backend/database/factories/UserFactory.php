<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
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
            'role' => 'user',
            'bio' => fake()->optional()->paragraph(),
            'avatar_url' => fake()->optional()->imageUrl(200, 200, 'people'),
            'password' => static::$password ??= Hash::make('password'),
            'email_verified' => fake()->boolean(80),
            'email_verified_at' => fake()->optional(0.8)->dateTimeBetween('-1 year', 'now'),
            'two_fa_enabled' => false,
            'two_fa_secret' => null,
            'status' => 'active',
            'last_login_at' => fake()->optional(0.7)->dateTimeBetween('-6 months', 'now'),
            'remember_token' => Str::random(10),
        ];
    }
}
