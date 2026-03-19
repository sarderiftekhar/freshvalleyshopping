<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmailCampaign extends Model
{
    protected $fillable = [
        'name',
        'subject',
        'body_html',
        'body_text',
        'status',
        'audience',
        'audience_filters',
        'total_recipients',
        'sent_count',
        'failed_count',
        'opened_count',
        'scheduled_at',
        'sent_at',
        'created_by',
    ];

    protected $casts = [
        'audience_filters' => 'array',
        'scheduled_at' => 'datetime',
        'sent_at' => 'datetime',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
