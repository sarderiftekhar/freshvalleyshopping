<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalOrders' => Order::count(),
                'totalRevenue' => Order::where('payment_status', 'paid')->sum('total'),
                'totalProducts' => Product::count(),
                'totalCustomers' => User::where('role', 'customer')->count(),
                'pendingOrders' => Order::where('status', 'pending')->count(),
                'lowStockProducts' => Product::where('track_stock', true)
                    ->whereColumn('quantity', '<=', 'low_stock_threshold')
                    ->count(),
            ],
            'recentOrders' => Order::with('user')
                ->latest()
                ->take(10)
                ->get(),
            'recentActivity' => ActivityLog::with('user')
                ->latest()
                ->take(20)
                ->get(),
        ]);
    }
}
