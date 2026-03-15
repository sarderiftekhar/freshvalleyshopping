<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $fillable = [
        'order_number',
        'user_id',
        'delivery_slot_id',
        'email',
        'phone',
        'delivery_address',
        'postcode',
        'city',
        'subtotal',
        'delivery_fee',
        'total',
        'status',
        'payment_status',
        'stripe_payment_intent_id',
        'notes',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'delivery_fee' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function deliverySlot(): BelongsTo
    {
        return $this->belongsTo(DeliverySlot::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
