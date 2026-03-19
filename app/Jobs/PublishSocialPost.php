<?php

namespace App\Jobs;

use App\Models\SocialPost;
use App\Services\Social\FacebookService;
use App\Services\Social\InstagramService;
use App\Services\Social\TelegramService;
use App\Services\Social\WhatsAppService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class PublishSocialPost implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 2;

    public function __construct(private SocialPost $post) {}

    public function handle(): void
    {
        $results = [];
        $imageUrl = $this->post->image ? url(Storage::url($this->post->image)) : null;

        foreach ($this->post->platforms as $platform) {
            try {
                $results[$platform] = match ($platform) {
                    'facebook' => app(FacebookService::class)->postToPage($this->post->content, $imageUrl),
                    'instagram' => $imageUrl
                        ? app(InstagramService::class)->createPost($imageUrl, $this->post->content)
                        : ['error' => 'Instagram requires an image'],
                    'telegram' => app(TelegramService::class)->postToAll($this->post->content, $imageUrl),
                    'whatsapp' => app(WhatsAppService::class)->sendToGroup(
                        config('services.whatsapp.group_id', ''),
                        $this->post->content,
                        $imageUrl
                    ),
                    default => ['error' => "Unknown platform: {$platform}"],
                };
            } catch (\Exception $e) {
                $results[$platform] = ['error' => $e->getMessage()];
                Log::error("Social post failed for {$platform}", [
                    'post_id' => $this->post->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        $this->post->update([
            'platform_results' => $results,
            'status' => collect($results)->every(fn ($r) => !isset($r['error'])) ? 'posted' : 'failed',
            'posted_at' => now(),
        ]);
    }
}
