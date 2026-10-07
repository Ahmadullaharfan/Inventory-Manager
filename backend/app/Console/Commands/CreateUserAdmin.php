<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Validator;

class CreateUserAdmin extends Command
{
    protected $signature = 'users:create-admin {--email=} {--first-name=} {--last-name=}';

    protected $description = 'Create an administrator using an interactively entered password';

    public function handle(): int
    {
        $data = [
            'first_name' => $this->option('first-name') ?: $this->ask('First name'),
            'last_name' => $this->option('last-name') ?: $this->ask('Last name'),
            'email' => $this->option('email') ?: $this->ask('Email'),
            'password' => $this->secret('Password (at least 8 characters)'),
            'password_confirmation' => $this->secret('Confirm password'),
        ];
        $validator = Validator::make($data, [
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);
        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $message) {
                $this->error($message);
            }

            return self::FAILURE;
        }
        unset($data['password_confirmation']);
        $user = User::create(array_merge($data, ['role' => 'admin', 'status' => 'active']));
        $user->notificationPreference()->create([]);
        $this->info('Administrator created: '.$user->email);

        return self::SUCCESS;
    }
}
