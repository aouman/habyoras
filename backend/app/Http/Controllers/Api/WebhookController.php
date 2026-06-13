<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WebhookController extends Controller
{
    public function handleGeniusPay(Request $request)
    {
        $signature = $request->header('X-Webhook-Signature');
        $timestamp = $request->header('X-Webhook-Timestamp');
        $event = $request->header('X-Webhook-Event');

        if (!$signature || !$timestamp || !$event) {
            return response()->json(['status' => 400, 'detail' => 'Missing headers'], 400);
        }

        if (abs(time() - (int)$timestamp) > 300) {
            return response()->json(['status' => 400, 'detail' => 'Timestamp too old'], 400);
        }

        $secret = config('services.geniuspay.webhook_secret');
        $payload = $request->all();

        $data = $timestamp . '.' . json_encode($payload);
        $expected = hash_hmac('sha256', $data, $secret);

        if (!hash_equals($expected, $signature)) {
            Log::warning('GeniusPay webhook: invalid signature');
            return response()->json(['status' => 401, 'detail' => 'Invalid signature'], 401);
        }

        $reference = $payload['data']['reference'] ?? null;
        if (!$reference) {
            return response()->json(['status' => 400, 'detail' => 'Missing reference'], 400);
        }

        $payment = Payment::where('geniuspay_reference', $reference)->first();
        if (!$payment) {
            Log::warning("GeniusPay webhook: payment not found for reference {$reference}");
            return response()->json(['status' => 404, 'detail' => 'Payment not found'], 404);
        }

        if ($event === 'payment.success') {
            if ($payment->status === 'completed') {
                return response()->json(['status' => 200, 'detail' => 'Already processed']);
            }

            $payment->update(['status' => 'completed']);

            $prices = ['Premium' => '50 000 FCFA/an', 'Gold' => '120 000 FCFA/an'];
            $features = SubscriptionController::planFeatures($payment->plan);

            Subscription::updateOrCreate(
                ['agency_id' => $payment->agency_id],
                array_merge([
                    'plan' => $payment->plan,
                    'amount' => $prices[$payment->plan] ?? '0 FCFA',
                    'start_date' => now(),
                    'end_date' => now()->addYear(),
                    'status' => 'active',
                ], $features)
            );

            Log::info("GeniusPay: payment {$reference} completed, subscription activated for agency {$payment->agency_id}");
        } elseif ($event === 'payment.failed') {
            $payment->update(['status' => 'failed']);
            Log::info("GeniusPay: payment {$reference} failed");
        }

        return response()->json(['status' => 200]);
    }
}
