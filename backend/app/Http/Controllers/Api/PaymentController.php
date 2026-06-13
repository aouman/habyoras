<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    public function initPayment(Request $request)
    {
        $validated = $request->validate([
            'plan' => 'required|in:Premium,Gold',
            'coupon_code' => 'nullable|string|max:50',
        ]);

        $prices = ['Premium' => 50000, 'Gold' => 120000];
        $amount = $prices[$validated['plan']] ?? 0;
        $couponId = null;
        $discountLabel = null;

        if ($validated['coupon_code'] ?? null) {
            $coupon = Coupon::where('code', $validated['coupon_code'])->first();

            if (!$coupon || !$coupon->isValid() || !$coupon->appliesToPlan($validated['plan'])) {
                return response()->json(['message' => 'Code promo invalide ou inapplicable.'], 422);
            }

            $amount = $coupon->applyDiscount($amount);
            $couponId = $coupon->id;
            $discountLabel = $coupon->discount_percent
                ? "-{$coupon->discount_percent}%"
                : '-' . number_format($coupon->discount_amount, 0, '', ' ') . ' XOF';
        }

        $apiKey = config('services.geniuspay.public_key');
        $apiSecret = config('services.geniuspay.secret_key');
        $baseUrl = config('services.geniuspay.base_url');
        $successUrl = config('services.geniuspay.checkout_success_url');
        $errorUrl = config('services.geniuspay.checkout_error_url');

        $agency = $request->user();
        $transactionId = 'TXN-' . strtoupper(Str::random(12));

        $response = Http::withHeaders([
            'X-API-Key' => $apiKey,
            'X-API-Secret' => $apiSecret,
            'Content-Type' => 'application/json',
        ])->post($baseUrl . '/payments', [
            'amount' => $amount,
            'currency' => 'XOF',
            'description' => 'Abonnement ' . $validated['plan'] . ' - ' . $agency->name,
            'customer' => [
                'name' => $agency->name,
                'email' => $agency->email,
                'phone' => $agency->phone_call,
            ],
            'success_url' => $successUrl . '?reference={reference}&plan=' . $validated['plan'],
            'error_url' => $errorUrl,
            'metadata' => [
                'agency_id' => (string) $agency->id,
                'plan' => $validated['plan'],
                'transaction_id' => $transactionId,
            ],
        ]);

        if (!$response->successful()) {
            return response()->json([
                'message' => 'Erreur de paiement. Veuillez réessayer.',
                'error' => $response->json(),
            ], 502);
        }

        $data = $response->json('data');

        $payment = Payment::create([
            'agency_id' => $agency->id,
            'plan' => $validated['plan'],
            'amount' => number_format($amount, 0, '', ' '),
            'currency' => 'XOF',
            'method' => 'geniuspay_checkout',
            'transaction_id' => $transactionId,
            'geniuspay_reference' => $data['reference'],
            'status' => 'pending',
        ]);

        if ($couponId) {
            $payment->update(['coupon_id' => $couponId]);
            Coupon::where('id', $couponId)->increment('used_count');
        }

        return response()->json([
            'checkout_url' => $data['checkout_url'] ?? $data['payment_url'],
            'reference' => $data['reference'],
            'discounted_amount' => $amount,
            'discount_label' => $discountLabel,
            'message' => 'Redirection vers la page de paiement sécurisée...',
        ]);
    }

    public function history(Request $request)
    {
        return Payment::where('agency_id', $request->user()->id)
            ->latest()
            ->paginate(10);
    }
}
