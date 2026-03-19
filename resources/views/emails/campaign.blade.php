<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f5f5f5; color: #333; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; }
        .header { background: #16a34a; padding: 24px; text-align: center; }
        .header img { max-height: 40px; }
        .header h1 { color: #fff; margin: 8px 0 0; font-size: 18px; }
        .content { padding: 32px 24px; line-height: 1.6; }
        .footer { background: #f9fafb; padding: 24px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; }
        .footer a { color: #16a34a; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Fresh Valley Shopping</h1>
        </div>
        <div class="content">
            {!! $body !!}
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} Fresh Valley Shopping. All rights reserved.</p>
            @if($unsubscribeUrl)
                <p><a href="{{ $unsubscribeUrl }}">Unsubscribe</a> from our mailing list.</p>
            @endif
        </div>
    </div>
</body>
</html>
