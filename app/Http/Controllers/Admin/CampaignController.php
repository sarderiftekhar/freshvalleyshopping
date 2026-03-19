<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Jobs\DispatchCampaign;
use App\Models\ActivityLog;
use App\Models\EmailCampaign;
use App\Models\NewsletterSubscriber;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CampaignController extends Controller
{
    public function index(Request $request)
    {
        $campaigns = EmailCampaign::with('creator')
            ->when($request->status, fn ($q, $s) => $q->where('status', $s))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Marketing/Campaigns/Index', [
            'campaigns' => $campaigns,
            'filters' => $request->only(['status']),
        ]);
    }

    public function create()
    {
        $subscriberCount = NewsletterSubscriber::subscribed()->count();
        $customerCount = User::where('role', 'customer')->count();

        return Inertia::render('Admin/Marketing/Campaigns/Create', [
            'subscriberCount' => $subscriberCount,
            'customerCount' => $customerCount,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'subject' => 'required|string|max:255',
            'body_html' => 'required|string',
            'audience' => 'required|in:all_customers,subscribers,custom',
            'scheduled_at' => 'nullable|date|after:now',
        ]);

        $campaign = EmailCampaign::create([
            ...$request->only(['name', 'subject', 'body_html', 'audience', 'scheduled_at']),
            'status' => $request->scheduled_at ? 'scheduled' : 'draft',
            'created_by' => $request->user()->id,
        ]);

        ActivityLog::log('campaign.created', $campaign);

        return redirect()->route('admin.campaigns.index')->with('success', 'Campaign created.');
    }

    public function edit(EmailCampaign $campaign)
    {
        $subscriberCount = NewsletterSubscriber::subscribed()->count();
        $customerCount = User::where('role', 'customer')->count();

        return Inertia::render('Admin/Marketing/Campaigns/Edit', [
            'campaign' => $campaign,
            'subscriberCount' => $subscriberCount,
            'customerCount' => $customerCount,
        ]);
    }

    public function update(Request $request, EmailCampaign $campaign)
    {
        abort_if(!in_array($campaign->status, ['draft', 'scheduled']), 403, 'Cannot edit a sent campaign.');

        $request->validate([
            'name' => 'required|string|max:255',
            'subject' => 'required|string|max:255',
            'body_html' => 'required|string',
            'audience' => 'required|in:all_customers,subscribers,custom',
            'scheduled_at' => 'nullable|date|after:now',
        ]);

        $campaign->update([
            ...$request->only(['name', 'subject', 'body_html', 'audience', 'scheduled_at']),
            'status' => $request->scheduled_at ? 'scheduled' : 'draft',
        ]);

        return redirect()->route('admin.campaigns.index')->with('success', 'Campaign updated.');
    }

    public function destroy(EmailCampaign $campaign)
    {
        abort_if(!in_array($campaign->status, ['draft', 'scheduled']), 403);
        $campaign->delete();
        return back()->with('success', 'Campaign deleted.');
    }

    public function send(EmailCampaign $campaign)
    {
        abort_if($campaign->status !== 'draft', 403, 'Campaign must be in draft status to send.');

        $campaign->update(['status' => 'sending']);
        DispatchCampaign::dispatch($campaign);

        ActivityLog::log('campaign.sending', $campaign);

        return back()->with('success', 'Campaign is being sent.');
    }

    public function preview(EmailCampaign $campaign)
    {
        return response($campaign->body_html);
    }
}
