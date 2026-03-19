<?php

namespace App\Jobs;

use App\Models\EmailCampaign;
use App\Models\NewsletterSubscriber;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class DispatchCampaign implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(private EmailCampaign $campaign) {}

    public function handle(): void
    {
        $recipients = $this->getRecipients();
        $this->campaign->update(['total_recipients' => $recipients->count()]);

        $recipients->chunk(50)->each(function ($chunk) {
            foreach ($chunk as $recipient) {
                SendCampaignEmail::dispatch(
                    $this->campaign,
                    $recipient['email'],
                    $recipient['name'] ?? '',
                    $recipient['unsubscribe_token'] ?? null,
                )->delay(now()->addSeconds(rand(1, 10)));
            }
        });

        $this->campaign->update([
            'status' => 'sent',
            'sent_at' => now(),
        ]);
    }

    private function getRecipients(): \Illuminate\Support\Collection
    {
        return match ($this->campaign->audience) {
            'subscribers' => NewsletterSubscriber::subscribed()
                ->get(['email', 'name', 'unsubscribe_token'])
                ->map(fn ($s) => $s->toArray()),

            'all_customers' => User::where('role', 'customer')
                ->where('is_active', true)
                ->get(['email', 'name'])
                ->map(fn ($u) => ['email' => $u->email, 'name' => $u->name, 'unsubscribe_token' => null]),

            default => collect(),
        };
    }
}
