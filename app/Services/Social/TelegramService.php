<?php

namespace App\Services\Social;

use Illuminate\Support\Facades\Http;

class TelegramService
{
    private string $botToken;
    private array $chatIds;

    public function __construct()
    {
        $this->botToken = config('services.telegram.bot_token', '');
        $this->chatIds = config('services.telegram.chat_ids', []);
    }

    public function sendMessage(string $chatId, string $message): array
    {
        $response = Http::post("https://api.telegram.org/bot{$this->botToken}/sendMessage", [
            'chat_id' => $chatId,
            'text' => $message,
            'parse_mode' => 'HTML',
        ]);

        return $response->json();
    }

    public function sendPhoto(string $chatId, string $photoUrl, string $caption): array
    {
        $response = Http::post("https://api.telegram.org/bot{$this->botToken}/sendPhoto", [
            'chat_id' => $chatId,
            'photo' => $photoUrl,
            'caption' => $caption,
            'parse_mode' => 'HTML',
        ]);

        return $response->json();
    }

    public function postToAll(string $message, ?string $imageUrl = null): array
    {
        $results = [];
        foreach ($this->chatIds as $chatId) {
            $results[$chatId] = $imageUrl
                ? $this->sendPhoto($chatId, $imageUrl, $message)
                : $this->sendMessage($chatId, $message);
        }
        return $results;
    }
}
