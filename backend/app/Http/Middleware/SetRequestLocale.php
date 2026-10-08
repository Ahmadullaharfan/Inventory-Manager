<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class SetRequestLocale
{
    public function handle(Request $request, Closure $next): Response
    {
        $preferred = $request->getPreferredLanguage(['en', 'ps', 'fa_AF']);
        App::setLocale(in_array($preferred, ['en', 'ps', 'fa_AF'], true) ? $preferred : 'en');

        return $next($request);
    }
}
