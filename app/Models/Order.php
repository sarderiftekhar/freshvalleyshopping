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
        'stripe_charge_id',
        'refund_amount',
        'refund_reason',
        'notes',
        'admin_notes',
        'cancellation_reason',
        'assigned_to',
        'confirmed_at',
        'preparing_at',
        'dispatched_at',
        'delivered_at',
        'cancelled_at',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'delivery_fee' => 'decimal:2',
        'total' => 'decimal:2',
        'refund_amount' => 'decimal:2',
        'confirmed_at' => 'datetime',
        'preparing_at' => 'datetime',
        'dispatched_at' => 'datetime',
        'delivered_at' => 'datetime',
        'cancelled_at' => 'datetime',
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

    public function statusHistory(): HasMany
    {
        return $this->hasMany(OrderStatusHistory::class);
    }

    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function transitionTo(string $status, ?User $changedBy = null, ?string $note = null): void
    {
        $fromStatus = $this->status;

        $this->update([
            'status' => $status,
            "{$status}_at" => now(),
        ]);

        OrderStatusHistory::create([
            'order_id' => $this->id,
            'from_status' => $fromStatus,
            'to_status' => $status,
            'changed_by' => $changedBy?->id,
            'note' => $note,
        ]);
    }
}
