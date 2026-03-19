<?php

namespace App\Services\Social;

use Illuminate\Support\Facades\Http;

class InstagramService
{
    private string $accessToken;
    private string $accountId;

    public function __construct()
    {
        $this->accessToken = config('services.facebook.page_access_token', '');
        $this->accountId = config('services.instagram.account_id', '');
    }

    public function createPost(string $imageUrl, string $caption): array
    {
        // Step 1: Create media container
        $container = Http::post("https://graph.facebook.com/v19.0/{$this->accountId}/media", [
            'image_url' => $imageUrl,
            'caption' => $caption,
            'access_token' => $this->accessToken,
        ])->json();

        if (empty($container['id'])) {
            return ['error' => 'Failed to create media container', 'details' => $container];
        }

        // Step 2: Publish
        $result = Http::post("https://graph.facebook.com/v19.0/{$this->accountId}/media_publish", [
            'creation_id' => $container['id'],
            'access_token' => $this->accessToken,
        ])->json();

        return $result;
    }
}
