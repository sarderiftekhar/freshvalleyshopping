<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f5f5f5; color: #333; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; }
        .header { background: #16a34a; padding: 24px; text-align: center; color: #fff; }
        .content { padding: 32px 24px; }
        table { width: 100%; border-collapse: collapse; margin: 16px 0; }
        th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
        th { background: #f9fafb; font-weight: 600; }
        .total-row td { font-weight: 700; border-top: 2px solid #333; }
        .footer { background: #f9fafb; padding: 24px; text-align: center; font-size: 12px; color: #6b7280; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Order Confirmation</h1>
            <p>Thank you for your order!</p>
        </div>
        <div class="content">
            <p>Hi {{ $order->user->name }},</p>
            <p>Your order <strong>#{{ $order->order_number }}</strong> has been received and is being processed.</p>

            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($order->items as $item)
                    <tr>
                        <td>{{ $item->product_name }}</td>
                        <td>{{ $item->quantity }}</td>
                        <td>&pound;{{ number_format($item->total, 2) }}</td>
                    </tr>
                    @endforeach
                    <tr>
                        <td colspan="2">Subtotal</td>
                        <td>&pound;{{ number_format($order->subtotal, 2) }}</td>
                    </tr>
                    <tr>
                        <td colspan="2">Delivery</td>
                        <td>&pound;{{ number_format($order->delivery_fee, 2) }}</td>
                    </tr>
                    <tr class="total-row">
                        <td colspan="2">Total</td>
                        <td>&pound;{{ number_format($order->total, 2) }}</td>
                    </tr>
                </tbody>
            </table>

            @if($order->deliverySlot)
            <p><strong>Delivery:</strong> {{ $order->deliverySlot->date }} ({{ $order->deliverySlot->start_time }} - {{ $order->deliverySlot->end_time }})</p>
            @endif
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} Fresh Valley Shopping</p>
        </div>
    </div>
</body>
</html>
