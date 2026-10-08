# Inventory Manager — Backend

The Inventory Manager backend provides a Laravel 12 API, session authentication, role-based access, user profiles, notification preferences, devices, recovery codes, and audit history. It also serves the project’s business data endpoints.

## Local setup

Use PHP 8.2 or later and Composer. From this directory:

```sh
composer install
```

Copy `.env.example` to `.env` if it does not exist, configure the database, then run:

```sh
php artisan key:generate
php artisan migrate
php artisan serve
```

Generate the application key only for a new environment. Keep the existing key for an existing installation.

The display name is configured by `APP_NAME="Inventory Manager"`. English, Pashto, and Dari API validation messages follow the request’s `Accept-Language` header.

## Verification

```sh
php artisan test --compact
```

Run the Angular frontend from `../frontend` for the application interface. The backend root page displays the Inventory Manager service identity.

## License notices

The Laravel framework is open-sourced software licensed under the MIT license. Third-party dependencies retain their respective licenses and notices.
