<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Investor extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'address',
        'total_investment',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'total_investment' => 'decimal:2',
    ];

    public function investments(): HasMany
    {
        return $this->hasMany(Investment::class);
    }

    // Get total investment amount for this investor
    public function getTotalInvestmentAmount(): float
    {
        return $this->investments()->sum('amount');
    }

    // Get investments by project
    public function getInvestmentsByProject(): array
    {
        return $this->investments()
            ->with('project')
            ->get()
            ->groupBy('project_id')
            ->map(function ($investments) {
                return [
                    'project' => $investments->first()->project,
                    'total_investment' => $investments->sum('amount'),
                    'investments' => $investments,
                ];
            })
            ->values()
            ->toArray();
    }
}
