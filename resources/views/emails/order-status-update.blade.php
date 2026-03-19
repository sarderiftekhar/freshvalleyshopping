<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f5f5f5; color: #333; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; }
        .header { background: #16a34a; padding: 24px; text-align: center; color: #fff; }
        .content { padding: 32px 24px; line-height: 1.6; }
        .status-badge { display: inline-block; padding: 6px 16px; border-radius: 20px; font-weight: 600; text-transform: capitalize; }
        .status-confirmed { background: #dbeafe; color: #1d4ed8; }
        .status-preparing { background: #fef3c7; color: #b45309; }
        .status-dispatched { background: #e0e7ff; color: #4338ca; }
        .status-delivered { background: #dcfce7; color: #15803d; }
        .status-cancelled { background: #fee2e2; color: #dc2626; }
        .footer { background: #f9fafb; padding: 24px; text-align: center; font-size: 12px; color: #6b7280; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Order Update</h1>
        </div>
        <div class="content">
            <p>Hi {{ $order->user->name }},</p>
            <p>Your order <strong>#{{ $order->order_number }}</strong> has been updated:</p>
            <p><span class="status-badge status-{{ $status }}">{{ ucfirst($status) }}</span></p>

            @if($note)
            <p><strong>Note:</strong> {{ $note }}</p>
            @endif

            <p>If you have any questions, please don't hesitate to contact us.</p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} Fresh Valley Shopping</p>
        </div>
    </div>
</body>
</html>
