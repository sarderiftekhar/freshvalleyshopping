<?php

namespace App\Services;

use App\Models\Setting;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

class SettingsService
{
    public function get(string $key, mixed $default = null): mixed
    {
        $setting = Cache::remember("setting.{$key}", 3600, function () use ($key) {
            return Setting::where('key', $key)->first();
        });

        return $setting ? $setting->casted_value : $default;
    }

    public function set(string $key, mixed $value, string $group = 'general', string $type = 'string'): void
    {
        Setting::updateOrCreate(
            ['key' => $key],
            ['value' => is_array($value) ? json_encode($value) : (string) $value, 'group' => $group, 'type' => $type]
        );

        Cache::forget("setting.{$key}");
    }

    public function getGroup(string $group): Collection
    {
        return Setting::group($group)->get()->mapWithKeys(function ($setting) {
            return [$setting->key => $setting->casted_value];
        });
    }

    public function setMany(array $settings, string $group = 'general'): void
    {
        foreach ($settings as $key => $value) {
            $this->set($key, $value, $group);
        }
    }
}
