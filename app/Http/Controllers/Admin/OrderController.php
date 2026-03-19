<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Order;
use App\Models\User;
use App\Services\StripeService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = Order::with(['user', 'assignedTo'])
            ->when($request->search, fn ($q, $s) => $q->where('order_number', 'like', "%{$s}%")
                ->orWhereHas('user', fn ($q2) => $q2->where('name', 'like', "%{$s}%")))
            ->when($request->status, fn ($q, $s) => $q->where('status', $s))
            ->when($request->date_from, fn ($q, $d) => $q->whereDate('created_at', '>=', $d))
            ->when($request->date_to, fn ($q, $d) => $q->whereDate('created_at', '<=', $d))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'filters' => $request->only(['search', 'status', 'date_from', 'date_to']),
        ]);
    }

    public function show(Order $order)
    {
        $order->load(['user', 'items.product', 'statusHistory.changedBy', 'assignedTo', 'deliverySlot']);

        return Inertia::render('Admin/Orders/Show', [
            'order' => $order,
        ]);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|string|in:pending,confirmed,preparing,dispatched,delivered,cancelled',
            'note' => 'nullable|string|max:500',
        ]);

        if ($request->status === 'cancelled') {
            $request->validate(['cancellation_reason' => 'required|string|max:500']);
            $order->cancellation_reason = $request->cancellation_reason;
        }

        $order->transitionTo($request->status, $request->user(), $request->note);

        ActivityLog::log('order.status_updated', $order, [
            'status' => $request->status,
            'note' => $request->note,
        ]);

        return back()->with('success', 'Order status updated.');
    }

    public function refund(Request $request, Order $order, StripeService $stripe)
    {
        $request->validate([
            'amount' => 'required|numeric|min:0.01|max:' . ($order->total - ($order->refund_amount ?? 0)),
            'reason' => 'required|string|max:500',
        ]);

        if (!$order->stripe_charge_id) {
            return back()->with('error', 'No payment found for this order.');
        }

        $result = $stripe->refundPayment($order->stripe_charge_id, (int) ($request->amount * 100));

        if (isset($result['id'])) {
            $order->update([
                'refund_amount' => ($order->refund_amount ?? 0) + $request->amount,
                'refund_reason' => $request->reason,
            ]);

            ActivityLog::log('order.refunded', $order, [
                'amount' => $request->amount,
                'reason' => $request->reason,
            ]);

            return back()->with('success', "Refund of £{$request->amount} processed.");
        }

        return back()->with('error', 'Refund failed. Please try again.');
    }

    public function addNote(Request $request, Order $order)
    {
        $request->validate(['note' => 'required|string|max:1000']);

        $order->update(['admin_notes' => trim(($order->admin_notes ? $order->admin_notes . "\n---\n" : '') . "[{$request->user()->name}] " . $request->note)]);

        return back()->with('success', 'Note added.');
    }

    public function export(Request $request)
    {
        $orders = Order::with(['user', 'items'])
            ->when($request->status, fn ($q, $s) => $q->where('status', $s))
            ->when($request->date_from, fn ($q, $d) => $q->whereDate('created_at', '>=', $d))
            ->when($request->date_to, fn ($q, $d) => $q->whereDate('created_at', '<=', $d))
            ->latest()
            ->get();

        $csv = "Order #,Customer,Email,Status,Items,Total,Payment,Date\n";
        foreach ($orders as $order) {
            $csv .= implode(',', [
                $order->order_number,
                '"' . ($order->user->name ?? 'Guest') . '"',
                $order->user->email ?? '',
                $order->status,
                $order->items->count(),
                $order->total,
                $order->payment_status ?? 'N/A',
                $order->created_at->format('Y-m-d H:i'),
            ]) . "\n";
        }

        return response($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="orders-' . now()->format('Y-m-d') . '.csv"',
        ]);
    }
}
