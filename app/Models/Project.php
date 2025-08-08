<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Project extends Model
{
    protected $fillable = [
        'name',
        'description',
        'location',
        'total_investment',
        'total_expenses',
        'sale_price',
        'credit_amount',
        'is_completed',
        'is_sold',
        'start_date',
        'end_date',
        'sale_date',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'sale_date' => 'date',
        'is_completed' => 'boolean',
        'is_sold' => 'boolean',
        'total_investment' => 'decimal:2',
        'total_expenses' => 'decimal:2',
        'sale_price' => 'decimal:2',
        'credit_amount' => 'decimal:2',
    ];

    public function investments(): HasMany
    {
        return $this->hasMany(Investment::class);
    }

    public function expenses(): HasMany
    {
        return $this->hasMany(Expense::class);
    }

    public function sale(): HasOne
    {
        return $this->hasOne(ProjectSale::class);
    }

    // Calculate total profit excluding credit amount
    public function calculateProfit(): float
    {
        $cashReceived = $this->sale ? $this->sale->cash_amount : 0;
        $totalSpent = $this->total_investment + $this->total_expenses;
        return $cashReceived - $totalSpent;
    }

    // Get profit per investor based on their investment ratio
    public function getProfitDistribution(): array
    {
        $totalProfit = $this->calculateProfit();
        $totalInvestment = $this->total_investment;
        
        if ($totalInvestment == 0) {
            return [];
        }

        $distribution = [];
        foreach ($this->investments as $investment) {
            $ratio = $investment->amount / $totalInvestment;
            $distribution[] = [
                'investor_id' => $investment->investor_id,
                'investor_name' => $investment->investor->name,
                'investment_amount' => $investment->amount,
                'profit_share' => $totalProfit * $ratio,
                'ratio' => $ratio,
            ];
        }

        return $distribution;
    }
}
