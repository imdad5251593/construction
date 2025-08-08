<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectSale extends Model
{
    protected $fillable = [
        'project_id',
        'buyer_name',
        'buyer_email',
        'buyer_phone',
        'buyer_address',
        'total_sale_price',
        'cash_amount',
        'credit_amount',
        'sale_date',
        'notes',
    ];

    protected $casts = [
        'sale_date' => 'date',
        'total_sale_price' => 'decimal:2',
        'cash_amount' => 'decimal:2',
        'credit_amount' => 'decimal:2',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
