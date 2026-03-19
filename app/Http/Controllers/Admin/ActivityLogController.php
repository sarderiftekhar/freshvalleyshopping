<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ActivityLogController extends Controller
{
    public function index(Request $request)
    {
        $logs = ActivityLog::with('user')
            ->when($request->search, fn ($q, $s) => $q->where('action', 'like', "%{$s}%"))
            ->when($request->user_id, fn ($q, $id) => $q->where('user_id', $id))
            ->when($request->date_from, fn ($q, $d) => $q->whereDate('created_at', '>=', $d))
            ->when($request->date_to, fn ($q, $d) => $q->whereDate('created_at', '<=', $d))
            ->latest()
            ->paginate(30)
            ->withQueryString();

        return Inertia::render('Admin/Activity/Index', [
            'logs' => $logs,
            'filters' => $request->only(['search', 'user_id', 'date_from', 'date_to']),
        ]);
    }
}
