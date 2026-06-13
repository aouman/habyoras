<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    public function initPayment(Request $request)
    {
        $validated = $request->validate([
            'plan' => 'required|in:Premium,Gold',
            'method' => 'required|in:card,mobile_money',
            'mobile_operator' => 'required_if:method,mobile_money|in:MTN,Orange,Moov,Wave|nullable',
            'phone' => 'required_if:method,mobile_money|string|nullable',
            'card_number' => 'required_if:method,card|nullable|string',
            'card_expiry' => 'required_if:method,card|nullable|string',
            'card_cvv' => 'required_if:method,card|nullable|string',
        ]);

        $prices = ['Premium' => '50 000', 'Gold' => '120 000'];
        $amount = $prices[$validated['plan']] ?? '0';

        $payment = Payment::create([
            'agency_id' => $request->user()->id,
            'plan' => $validated['plan'],
            'amount' => $amount,
            'currency' => 'XOF',
            'method' => $validated['method'],
            'mobile_operator' => $validated['mobile_operator'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'transaction_id' => 'TXN-' . strtoupper(Str::random(12)),
            'status' => 'pending',
        ]);

        return response()->json([
            'payment' => $payment,
            'message' => 'Paiement initié. Veuillez confirmer le paiement.',
        ]);
    }

    public function confirmPayment(Request $request, $id)
    {
        $payment = Payment::where('id', $id)->where('agency_id', $request->user()->id)->firstOrFail();

        if ($payment->status !== 'pending') {
            return response()->json(['message' => 'Ce paiement a déjà été traité.'], 400);
        }

        $payment->update(['status' => 'completed']);

        $prices = ['Premium' => '50 000 FCFA/an', 'Gold' => '120 000 FCFA/an'];
        $features = SubscriptionController::planFeatures($payment->plan);

        Subscription::updateOrCreate(
            ['agency_id' => $request->user()->id],
            array_merge([
                'plan' => $payment->plan,
                'amount' => $prices[$payment->plan] ?? '0 FCFA',
                'start_date' => now(),
                'end_date' => now()->addYear(),
                'status' => 'active',
            ], $features)
        );

        return response()->json([
            'message' => 'Paiement confirmé. Votre abonnement ' . $payment->plan . ' est actif.',
            'payment' => $payment->fresh(),
        ]);
    }

    public function history(Request $request)
    {
        return Payment::where('agency_id', $request->user()->id)
            ->latest()
            ->paginate(10);
    }
}
