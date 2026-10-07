<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class AuditLogController extends Controller
{
    public function index(User $user): JsonResponse
    {
        Gate::authorize('update', $user);

        return response()->json($user->auditLogs()->latest('id')->paginate(15));
    }
}
