<?php

namespace App\Http\Controllers;

use App\Models\Address;
use App\Models\DeliverySlot;
use App\Models\Order;
use App\Models\OrderItem;
use App\Services\StripeService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    public function index(Request $request)
    {
        $cart = session('cart', []);
        if (empty($cart)) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty.');
        }

        $addresses = $request->user()->addresses ?? collect();
        $slots = DeliverySlot::where('date', '>=', now()->toDateString())
            ->where('is_active', true)
            ->whereColumn('current_orders', '<', 'max_orders')
            ->orderBy('date')
            ->orderBy('start_time')
            ->get();

        return Inertia::render('Checkout', [
            'cart' => $cart,
            'addresses' => $addresses,
            'deliverySlots' => $slots,
            'stripeKey' => config('services.stripe.key'),
        ]);
    }

    public function createPaymentIntent(Request $request, StripeService $stripe)
    {
        $cart = session('cart', []);
        $total = collect($cart)->sum(fn ($item) => $item['price'] * $item['quantity']);
        $deliveryFee = $request->delivery_fee ?? 0;
        $amount = (int) (($total + $deliveryFee) * 100);

        $intent = $stripe->createPaymentIntent($amount, 'gbp', [
            'user_id' => (string) $request->user()->id,
        ]);

        return response()->json([
            'clientSecret' => $intent['client_secret'] ?? null,
            'error' => $intent['error'] ?? null,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'address_id' => 'nullable|exists:addresses,id',
            'delivery_slot_id' => 'nullable|exists:delivery_slots,id',
            'payment_intent_id' => 'required|string',
            'delivery_address' => 'required_without:address_id|array',
        ]);

        $cart = session('cart', []);
        if (empty($cart)) {
            return back()->with('error', 'Cart is empty.');
        }

        // Create or use existing address
        if ($request->address_id) {
            $address = Address::findOrFail($request->address_id);
        } else {
            $address = Address::create([
                'user_id' => $request->user()->id,
                ...$request->delivery_address,
            ]);
        }

        $total = collect($cart)->sum(fn ($item) => $item['price'] * $item['quantity']);
        $slot = $request->delivery_slot_id ? DeliverySlot::find($request->delivery_slot_id) : null;
        $deliveryFee = $slot->delivery_fee ?? 0;

        $order = Order::create([
            'user_id' => $request->user()->id,
            'order_number' => 'FV-' . strtoupper(Str::random(8)),
            'status' => 'pending',
            'payment_status' => 'pending',
            'payment_method' => 'stripe',
            'subtotal' => $total,
            'delivery_fee' => $deliveryFee,
            'total' => $total + $deliveryFee,
            'delivery_slot_id' => $request->delivery_slot_id,
            'delivery_address' => $address->toArray(),
            'stripe_charge_id' => $request->payment_intent_id,
        ]);

        foreach ($cart as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item['id'],
                'product_name' => $item['name'],
                'quantity' => $item['quantity'],
                'price' => $item['price'],
                'total' => $item['price'] * $item['quantity'],
                'options' => $item['options'] ?? null,
            ]);
        }

        if ($slot) {
            $slot->increment('current_orders');
        }

        session()->forget('cart');

        return redirect()->route('checkout.confirmation', $order->id);
    }

    public function confirmation(Order $order)
    {
        abort_if($order->user_id !== auth()->id(), 403);

        $order->load(['items', 'deliverySlot']);

        return Inertia::render('CheckoutConfirmation', [
            'order' => $order,
        ]);
    }
}
