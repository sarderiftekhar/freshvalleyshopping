<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class StripeWebhookController extends Controller
{
    public function handle(Request $request)
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $secret = config('services.stripe.webhook_secret');

        try {
            $event = \Stripe\Webhook::constructEvent($payload, $sigHeader, $secret);
        } catch (\Exception $e) {
            Log::error('Stripe webhook signature verification failed', ['error' => $e->getMessage()]);
            return response('Invalid signature', 400);
        }

        switch ($event->type) {
            case 'payment_intent.succeeded':
                $this->handlePaymentSucceeded($event->data->object);
                break;
            case 'payment_intent.payment_failed':
                $this->handlePaymentFailed($event->data->object);
                break;
            case 'charge.refunded':
                $this->handleChargeRefunded($event->data->object);
                break;
            default:
                Log::info('Unhandled Stripe event: ' . $event->type);
        }

        return response('OK', 200);
    }

    private function handlePaymentSucceeded($paymentIntent): void
    {
        $order = Order::where('stripe_charge_id', $paymentIntent->id)->first();
        if (!$order) return;

        $order->update([
            'payment_status' => 'paid',
            'status' => 'confirmed',
            'confirmed_at' => now(),
        ]);
    }

    private function handlePaymentFailed($paymentIntent): void
    {
        $order = Order::where('stripe_charge_id', $paymentIntent->id)->first();
        if (!$order) return;

        $order->update(['payment_status' => 'failed']);
    }

    private function handleChargeRefunded($charge): void
    {
        $order = Order::where('stripe_charge_id', $charge->payment_intent)->first();
        if (!$order) return;

        $refundedAmount = $charge->amount_refunded / 100;
        $order->update([
            'refund_amount' => $refundedAmount,
            'payment_status' => $refundedAmount >= $order->total ? 'refunded' : 'partially_refunded',
        ]);
    }
}
