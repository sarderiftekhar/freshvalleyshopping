<?php

namespace App\Services;

use App\Models\Order;

class StripeService
{
    private \Stripe\StripeClient $stripe;

    public function __construct()
    {
        $this->stripe = new \Stripe\StripeClient(config('services.stripe.secret'));
    }

    public function createPaymentIntent(Order $order): \Stripe\PaymentIntent
    {
        return $this->stripe->paymentIntents->create([
            'amount' => (int) ($order->total * 100),
            'currency' => 'gbp',
            'metadata' => [
                'order_id' => $order->id,
                'order_number' => $order->order_number,
            ],
        ]);
    }

    public function getPaymentIntent(string $paymentIntentId): \Stripe\PaymentIntent
    {
        return $this->stripe->paymentIntents->retrieve($paymentIntentId);
    }

    public function refundPayment(Order $order, ?int $amountInPence = null, ?string $reason = null): \Stripe\Refund
    {
        $params = ['payment_intent' => $order->stripe_payment_intent_id];

        if ($amountInPence) {
            $params['amount'] = $amountInPence;
        }

        if ($reason) {
            $params['metadata'] = ['reason' => $reason];
        }

        return $this->stripe->refunds->create($params);
    }
}
