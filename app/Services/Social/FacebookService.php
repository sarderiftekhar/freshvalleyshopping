<?php

namespace App\Services\Social;

use Illuminate\Support\Facades\Http;

class FacebookService
{
    private string $pageAccessToken;
    private string $pageId;

    public function __construct()
    {
        $this->pageAccessToken = config('services.facebook.page_access_token', '');
        $this->pageId = config('services.facebook.page_id', '');
    }

    public function postToPage(string $message, ?string $imageUrl = null): array
    {
        if ($imageUrl) {
            $response = Http::post("https://graph.facebook.com/v19.0/{$this->pageId}/photos", [
                'url' => $imageUrl,
                'message' => $message,
                'access_token' => $this->pageAccessToken,
            ]);
        } else {
            $response = Http::post("https://graph.facebook.com/v19.0/{$this->pageId}/feed", [
                'message' => $message,
                'access_token' => $this->pageAccessToken,
            ]);
        }

        return $response->json();
    }
}
