<?php

namespace Database\Seeders;

use App\Models\Subscription;
use App\Http\Controllers\Api\SubscriptionController;
use Illuminate\Database\Seeder;

class SubscriptionSeeder extends Seeder
{
    public function run()
    {
        $subs = [
            ['agency_id' => 1, 'plan' => 'Gold', 'amount' => '120 000 FCFA/an', 'start_date' => '2025-01-15', 'end_date' => '2026-01-15', 'status' => 'active'],
            ['agency_id' => 2, 'plan' => 'Premium', 'amount' => '50 000 FCFA/an', 'start_date' => '2025-03-01', 'end_date' => '2026-03-01', 'status' => 'active'],
            ['agency_id' => 3, 'plan' => 'Gold', 'amount' => '120 000 FCFA/an', 'start_date' => '2024-11-20', 'end_date' => '2025-11-20', 'status' => 'active'],
            ['agency_id' => 4, 'plan' => 'Basic', 'amount' => '0 FCFA', 'start_date' => '2025-06-01', 'end_date' => null, 'status' => 'active'],
            ['agency_id' => 5, 'plan' => 'Premium', 'amount' => '50 000 FCFA/an', 'start_date' => '2025-02-10', 'end_date' => '2025-08-10', 'status' => 'expired'],
        ];

        foreach ($subs as $s) {
            $features = SubscriptionController::planFeatures($s['plan']);
            Subscription::create(array_merge($s, $features));
        }
    }
}
