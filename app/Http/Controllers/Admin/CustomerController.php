<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $customers = User::where('role', 'customer')
            ->withCount('orders')
            ->withSum('orders', 'total')
            ->when($request->search, fn ($q, $s) => $q->where('name', 'like', "%{$s}%")
                ->orWhere('email', 'like', "%{$s}%"))
            ->when($request->status === 'active', fn ($q) => $q->where('is_active', true))
            ->when($request->status === 'inactive', fn ($q) => $q->where('is_active', false))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Customers/Index', [
            'customers' => $customers,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function show(User $customer)
    {
        $customer->load([
            'orders' => fn ($q) => $q->latest()->limit(20),
            'orders.items',
            'addresses',
        ]);
        $customer->loadCount('orders');
        $customer->loadSum('orders', 'total');

        $favourites = $customer->favourites()->with('images')->limit(20)->get();
        $history = $customer->browsingHistory()
            ->with('product.images')
            ->latest('viewed_at')
            ->limit(20)
            ->get();

        return Inertia::render('Admin/Customers/Show', [
            'customer' => $customer,
            'favourites' => $favourites,
            'browsingHistory' => $history,
        ]);
    }

    public function toggleActive(User $customer)
    {
        $customer->update(['is_active' => !$customer->is_active]);

        ActivityLog::log(
            $customer->is_active ? 'customer.activated' : 'customer.deactivated',
            $customer
        );

        return back()->with('success', 'Customer status updated.');
    }

    public function export(Request $request)
    {
        $customers = User::where('role', 'customer')
            ->withCount('orders')
            ->withSum('orders', 'total')
            ->get();

        $csv = "Name,Email,Phone,Orders,Total Spent,Status,Joined\n";
        foreach ($customers as $c) {
            $csv .= implode(',', [
                '"' . $c->name . '"',
                $c->email,
                $c->phone ?? '',
                $c->orders_count,
                number_format($c->orders_sum_total ?? 0, 2),
                $c->is_active ? 'Active' : 'Inactive',
                $c->created_at->format('Y-m-d'),
            ]) . "\n";
        }

        return response($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="customers-' . now()->format('Y-m-d') . '.csv"',
        ]);
    }
}
