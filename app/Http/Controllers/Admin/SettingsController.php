<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Services\SettingsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function __construct(private SettingsService $settings) {}

    public function general()
    {
        return Inertia::render('Admin/Settings/General', [
            'settings' => $this->settings->getGroup('general'),
        ]);
    }

    public function updateGeneral(Request $request)
    {
        $request->validate([
            'site_name' => 'required|string|max:255',
            'site_tagline' => 'nullable|string|max:255',
            'contact_email' => 'required|email',
            'contact_phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
        ]);

        $this->settings->setMany($request->only([
            'site_name', 'site_tagline', 'contact_email', 'contact_phone', 'address',
        ]), 'general');

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('settings', 'public');
            $this->settings->set('site_logo', $path, 'general');
        }

        ActivityLog::log('settings.general_updated', null);

        return back()->with('success', 'General settings updated.');
    }

    public function delivery()
    {
        return Inertia::render('Admin/Settings/Delivery', [
            'settings' => $this->settings->getGroup('delivery'),
        ]);
    }

    public function updateDelivery(Request $request)
    {
        $request->validate([
            'default_delivery_fee' => 'required|numeric|min:0',
            'free_delivery_threshold' => 'required|numeric|min:0',
            'minimum_order' => 'required|numeric|min:0',
            'delivery_zones' => 'nullable|string',
        ]);

        $this->settings->setMany($request->only([
            'default_delivery_fee', 'free_delivery_threshold', 'minimum_order', 'delivery_zones',
        ]), 'delivery');

        ActivityLog::log('settings.delivery_updated', null);

        return back()->with('success', 'Delivery settings updated.');
    }

    public function payment()
    {
        $settings = $this->settings->getGroup('payment');
        // Mask secret keys for display
        if (isset($settings['stripe_secret_key'])) {
            $settings['stripe_secret_key'] = str_repeat('*', 20) . substr($settings['stripe_secret_key'], -4);
        }

        return Inertia::render('Admin/Settings/Payment', [
            'settings' => $settings,
        ]);
    }

    public function updatePayment(Request $request)
    {
        $request->validate([
            'stripe_public_key' => 'nullable|string',
            'stripe_secret_key' => 'nullable|string',
            'stripe_webhook_secret' => 'nullable|string',
            'currency' => 'required|string|size:3',
        ]);

        $data = ['currency' => $request->currency];
        if ($request->stripe_public_key && !str_contains($request->stripe_public_key, '***')) {
            $data['stripe_public_key'] = $request->stripe_public_key;
        }
        if ($request->stripe_secret_key && !str_contains($request->stripe_secret_key, '***')) {
            $data['stripe_secret_key'] = $request->stripe_secret_key;
        }
        if ($request->stripe_webhook_secret && !str_contains($request->stripe_webhook_secret, '***')) {
            $data['stripe_webhook_secret'] = $request->stripe_webhook_secret;
        }

        $this->settings->setMany($data, 'payment');

        ActivityLog::log('settings.payment_updated', null);

        return back()->with('success', 'Payment settings updated.');
    }

    public function email()
    {
        return Inertia::render('Admin/Settings/Email', [
            'settings' => $this->settings->getGroup('email'),
        ]);
    }

    public function updateEmail(Request $request)
    {
        $request->validate([
            'mail_from_name' => 'required|string|max:255',
            'mail_from_address' => 'required|email',
            'mail_reply_to' => 'nullable|email',
        ]);

        $this->settings->setMany($request->only([
            'mail_from_name', 'mail_from_address', 'mail_reply_to',
        ]), 'email');

        ActivityLog::log('settings.email_updated', null);

        return back()->with('success', 'Email settings updated.');
    }

    public function testEmail(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        try {
            Mail::raw('This is a test email from Fresh Valley Shopping admin.', function ($message) use ($request) {
                $message->to($request->email)->subject('Test Email - Fresh Valley Shopping');
            });
            return back()->with('success', 'Test email sent.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to send test email: ' . $e->getMessage());
        }
    }
}
