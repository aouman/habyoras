<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    protected $fillable = [
        'code', 'discount_percent', 'discount_amount', 'applicable_plans',
        'max_uses', 'used_count', 'valid_from', 'valid_until', 'active',
    ];

    protected $casts = [
        'applicable_plans' => 'array',
        'active' => 'boolean',
        'valid_from' => 'date',
        'valid_until' => 'date',
    ];

    public function isValid(): bool
    {
        if (!$this->active) return false;
        if ($this->max_uses > 0 && $this->used_count >= $this->max_uses) return false;
        if ($this->valid_from && now()->lt($this->valid_from)) return false;
        if ($this->valid_until && now()->gt($this->valid_until)) return false;
        return true;
    }

    public function appliesToPlan(string $plan): bool
    {
        if (empty($this->applicable_plans)) return true;
        return in_array($plan, $this->applicable_plans);
    }

    public function applyDiscount(int $amount): int
    {
        if ($this->discount_percent) {
            return max(0, $amount - (int) round($amount * $this->discount_percent / 100));
        }
        if ($this->discount_amount) {
            return max(0, $amount - $this->discount_amount);
        }
        return $amount;
    }
}
