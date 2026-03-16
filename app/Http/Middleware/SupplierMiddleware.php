<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SupplierMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user() || !in_array($request->user()->role, ['supplier', 'admin'])) {
            abort(403, 'Unauthorized. Supplier access required.');
        }

        return $next($request);
    }
}
