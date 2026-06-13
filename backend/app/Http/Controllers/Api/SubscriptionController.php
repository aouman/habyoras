<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    public static function planFeatures(string $plan): array
    {
        return match ($plan) {
            'Gold' => [
                'max_properties' => 0,
                'unlimited_properties' => true,
                'can_message' => true,
                'has_advanced_stats' => true,
                'has_priority_support' => true,
                'has_featured' => true,
                'max_collaborators' => 10,
            ],
            'Premium' => [
                'max_properties' => 15,
                'unlimited_properties' => false,
                'can_message' => true,
                'has_advanced_stats' => true,
                'has_priority_support' => true,
                'has_featured' => true,
                'max_collaborators' => 3,
            ],
            default => [
                'max_properties' => 5,
                'unlimited_properties' => false,
                'can_message' => false,
                'has_advanced_stats' => false,
                'has_priority_support' => false,
                'has_featured' => false,
                'max_collaborators' => 0,
            ],
        };
    }

    public function index()
    {
        return Subscription::with('agency')->get();
    }

    public function mySubscription(Request $request)
    {
        $user = $request->user();
        $agencyId = $user instanceof \App\Models\Collaborator ? $user->agency_id : $user->id;
        $sub = Subscription::where('agency_id', $agencyId)->first();
        return response()->json($sub);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'agency_id' => 'required|exists:agencies,id',
            'plan' => 'required|in:Basic,Premium,Gold',
            'amount' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date',
        ]);

        $features = self::planFeatures($validated['plan']);
        $validated = array_merge($validated, $features);

        $subscription = Subscription::create($validated);
        return response()->json($subscription, 201);
    }

    public function update(Request $request, $id)
    {
        $subscription = Subscription::findOrFail($id);
        $validated = $request->validate([
            'plan' => 'in:Basic,Premium,Gold',
            'status' => 'in:active,expired',
            'end_date' => 'nullable|date',
        ]);

        if (isset($validated['plan'])) {
            $features = self::planFeatures($validated['plan']);
            $validated = array_merge($validated, $features);
        }

        $subscription->update($validated);
        return response()->json($subscription);
    }
}
