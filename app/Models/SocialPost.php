<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SocialPost extends Model
{
    protected $fillable = [
        'content',
        'image',
        'platforms',
        'platform_results',
        'status',
        'scheduled_at',
        'posted_at',
        'created_by',
        'product_id',
    ];

    protected $casts = [
        'platforms' => 'array',
        'platform_results' => 'array',
        'scheduled_at' => 'datetime',
        'posted_at' => 'datetime',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
