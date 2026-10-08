<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" dir="{{ in_array(app()->getLocale(), ['ps', 'fa_AF'], true) ? 'rtl' : 'ltr' }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="application-name" content="{{ config('app.name') }}">
        <title>{{ config('app.name') }}</title>
        <link rel="icon" type="image/svg+xml" href="{{ asset('favicon.svg') }}">
        <link rel="alternate icon" href="{{ asset('favicon.ico') }}">
        <link rel="stylesheet" href="{{ asset('inventory-manager.css') }}">
    </head>
    <body>
        <main class="service-card">
            <img class="brand-icon" src="{{ asset('inventory-manager.svg') }}" width="56" height="56" alt="{{ config('app.name') }}">
            <p class="status"><span aria-hidden="true"></span>{{ __('Service ready') }}</p>
            <h1>{{ config('app.name') }}</h1>
            <p class="description">{{ __('Manage inventory, people, and business operations in one place.') }}</p>
            <p class="service-label">{{ __('Application API') }}</p>
        </main>
    </body>
</html>
