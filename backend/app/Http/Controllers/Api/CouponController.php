<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    public function validateCoupon(Request $request)
    {
        $request->validate([
            'code' => 'required|string|max:50',
            'plan' => 'required|in:Premium,Gold',
        ]);

        $coupon = Coupon::where('code', $request->code)->first();

        if (!$coupon) {
            return response()->json(['valid' => false, 'message' => 'Code promo invalide.'], 404);
        }

        if (!$coupon->isValid()) {
            return response()->json(['valid' => false, 'message' => 'Ce code promo a expiré ou n\'est plus valide.'], 422);
        }

        if (!$coupon->appliesToPlan($request->plan)) {
            return response()->json(['valid' => false, 'message' => 'Ce code promo ne s\'applique pas à ce plan.'], 422);
        }

        $prices = ['Premium' => 50000, 'Gold' => 120000];
        $original = $prices[$request->plan];
        $discounted = $coupon->applyDiscount($original);

        return response()->json([
            'valid' => true,
            'coupon' => $coupon->only(['id', 'code', 'discount_percent', 'discount_amount']),
            'original_amount' => $original,
            'discounted_amount' => $discounted,
        ]);
    }

    public function adminIndex()
    {
        return Coupon::orderBy('created_at', 'desc')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50|unique:coupons,code',
            'discount_percent' => 'nullable|integer|min:1|max:100',
            'discount_amount' => 'nullable|integer|min:1',
            'applicable_plans' => 'nullable|array',
            'applicable_plans.*' => 'in:Premium,Gold',
            'max_uses' => 'integer|min:0',
            'valid_from' => 'nullable|date',
            'valid_until' => 'nullable|date|after_or_equal:valid_from',
            'active' => 'boolean',
        ]);

        if (empty($validated['discount_percent']) && empty($validated['discount_amount'])) {
            return response()->json(['message' => 'Vous devez définir un pourcentage ou un montant de réduction.'], 422);
        }

        $coupon = Coupon::create(array_merge($validated, ['used_count' => 0]));

        return response()->json($coupon, 201);
    }

    public function update(Request $request, $id)
    {
        $coupon = Coupon::findOrFail($id);

        $validated = $request->validate([
            'code' => 'required|string|max:50|unique:coupons,code,' . $id,
            'discount_percent' => 'nullable|integer|min:1|max:100',
            'discount_amount' => 'nullable|integer|min:1',
            'applicable_plans' => 'nullable|array',
            'applicable_plans.*' => 'in:Premium,Gold',
            'max_uses' => 'integer|min:0',
            'valid_from' => 'nullable|date',
            'valid_until' => 'nullable|date|after_or_equal:valid_from',
            'active' => 'boolean',
        ]);

        $coupon->update($validated);

        return response()->json($coupon);
    }

    public function destroy($id)
    {
        Coupon::findOrFail($id)->delete();
        return response()->json(['message' => 'Coupon supprimé.']);
    }
}
