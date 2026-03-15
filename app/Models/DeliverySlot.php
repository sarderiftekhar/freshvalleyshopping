<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DeliverySlot extends Model
{
    protected $fillable = [
        'delivery_date',
        'label',
        'max_orders',
        'current_orders',
        'is_active',
    ];

    protected $casts = [
        'delivery_date' => 'date',
        'is_active' => 'boolean',
    ];

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function getIsAvailableAttribute(): bool
    {
        return $this->is_active && $this->current_orders < $this->max_orders;
    }
}
