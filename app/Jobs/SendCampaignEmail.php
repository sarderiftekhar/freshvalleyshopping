<?php

namespace App\Jobs;

use App\Models\EmailCampaign;
use App\Models\NewsletterSubscriber;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendCampaignEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $backoff = 60;

    public function __construct(
        private EmailCampaign $campaign,
        private string $email,
        private string $name,
        private ?string $unsubscribeToken = null,
    ) {}

    public function handle(): void
    {
        $unsubscribeUrl = $this->unsubscribeToken
            ? url("/newsletter/unsubscribe/{$this->unsubscribeToken}")
            : null;

        try {
            Mail::send('emails.campaign', [
                'body' => $this->campaign->body_html,
                'unsubscribeUrl' => $unsubscribeUrl,
                'campaignName' => $this->campaign->name,
            ], function ($message) {
                $message->to($this->email, $this->name)
                    ->subject($this->campaign->subject);
            });

            $this->campaign->increment('sent_count');
        } catch (\Exception $e) {
            $this->campaign->increment('failed_count');
            throw $e;
        }
    }
}
