<?php

namespace App\Services\Social;

use Illuminate\Support\Facades\Http;

class WhatsAppService
{
    private string $apiUrl;
    private string $apiToken;

    public function __construct()
    {
        $this->apiUrl = config('services.whatsapp.api_url', '');
        $this->apiToken = config('services.whatsapp.api_token', '');
    }

    public function sendToGroup(string $groupId, string $message, ?string $imageUrl = null): array
    {
        $payload = [
            'messaging_product' => 'whatsapp',
            'to' => $groupId,
            'type' => 'text',
            'text' => ['body' => $message],
        ];

        if ($imageUrl) {
            $payload['type'] = 'image';
            $payload['image'] = [
                'link' => $imageUrl,
                'caption' => $message,
            ];
            unset($payload['text']);
        }

        $response = Http::withToken($this->apiToken)
            ->post("{$this->apiUrl}/messages", $payload);

        return $response->json();
    }
}
