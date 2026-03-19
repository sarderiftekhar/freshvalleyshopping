<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function sales(Request $request)
    {
        $from = Carbon::parse($request->date_from ?? now()->subDays(30));
        $to = Carbon::parse($request->date_to ?? now());

        $dailySales = Order::whereBetween('created_at', [$from, $to])
            ->whereNotIn('status', ['cancelled'])
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as orders'),
                DB::raw('SUM(total) as revenue')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $totals = [
            'revenue' => $dailySales->sum('revenue'),
            'orders' => $dailySales->sum('orders'),
            'average_order' => $dailySales->sum('orders') > 0
                ? round($dailySales->sum('revenue') / $dailySales->sum('orders'), 2) : 0,
        ];

        return Inertia::render('Admin/Reports/Sales', [
            'dailySales' => $dailySales,
            'totals' => $totals,
            'filters' => ['date_from' => $from->toDateString(), 'date_to' => $to->toDateString()],
        ]);
    }

    public function products(Request $request)
    {
        $from = Carbon::parse($request->date_from ?? now()->subDays(30));
        $to = Carbon::parse($request->date_to ?? now());

        $topProducts = DB::table('order_items')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->join('products', 'products.id', '=', 'order_items.product_id')
            ->whereBetween('orders.created_at', [$from, $to])
            ->whereNotIn('orders.status', ['cancelled'])
            ->select(
                'products.id',
                'products.name',
                DB::raw('SUM(order_items.quantity) as total_quantity'),
                DB::raw('SUM(order_items.quantity * order_items.price) as total_revenue')
            )
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('total_revenue')
            ->limit(20)
            ->get();

        $categoryBreakdown = DB::table('order_items')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->join('products', 'products.id', '=', 'order_items.product_id')
            ->join('categories', 'categories.id', '=', 'products.category_id')
            ->whereBetween('orders.created_at', [$from, $to])
            ->whereNotIn('orders.status', ['cancelled'])
            ->select(
                'categories.name',
                DB::raw('SUM(order_items.quantity * order_items.price) as revenue')
            )
            ->groupBy('categories.name')
            ->orderByDesc('revenue')
            ->get();

        $lowStock = Product::where('track_stock', true)
            ->whereColumn('quantity', '<=', 'low_stock_threshold')
            ->select('id', 'name', 'quantity', 'low_stock_threshold')
            ->limit(20)
            ->get();

        return Inertia::render('Admin/Reports/Products', [
            'topProducts' => $topProducts,
            'categoryBreakdown' => $categoryBreakdown,
            'lowStock' => $lowStock,
            'filters' => ['date_from' => $from->toDateString(), 'date_to' => $to->toDateString()],
        ]);
    }

    public function customers(Request $request)
    {
        $from = Carbon::parse($request->date_from ?? now()->subDays(30));
        $to = Carbon::parse($request->date_to ?? now());

        $newCustomers = User::where('role', 'customer')
            ->whereBetween('created_at', [$from, $to])
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(*) as count'))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $topCustomers = User::where('role', 'customer')
            ->withCount(['orders' => fn ($q) => $q->whereBetween('created_at', [$from, $to])])
            ->withSum(['orders' => fn ($q) => $q->whereBetween('created_at', [$from, $to])], 'total')
            ->having('orders_count', '>', 0)
            ->orderByDesc('orders_sum_total')
            ->limit(20)
            ->get();

        $stats = [
            'total_customers' => User::where('role', 'customer')->count(),
            'new_this_period' => $newCustomers->sum('count'),
            'with_orders' => User::where('role', 'customer')->has('orders')->count(),
        ];

        return Inertia::render('Admin/Reports/Customers', [
            'newCustomers' => $newCustomers,
            'topCustomers' => $topCustomers,
            'stats' => $stats,
            'filters' => ['date_from' => $from->toDateString(), 'date_to' => $to->toDateString()],
        ]);
    }
}
