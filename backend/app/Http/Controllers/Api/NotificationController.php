<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $query = Notification::where('active', true);
        $agency = null;

        if ($request->bearerToken()) {
            $token = PersonalAccessToken::findToken($request->bearerToken());
            if ($token) {
                $agency = $token->tokenable;
                if ($agency instanceof \App\Models\Agency) {
                    $plan = Subscription::where('agency_id', $agency->id)->value('plan');
                    $query->where(function ($q) use ($agency, $plan) {
                        $q->where('target_type', 'all')
                          ->orWhere(function ($q) use ($agency) {
                              $q->where('target_type', 'agency')->where('target_identifier', (string) $agency->id);
                          })
                          ->orWhere(function ($q) use ($plan) {
                              $q->where('target_type', 'plan')->where('target_identifier', $plan);
                          });
                    });
                    return $query->latest()->get();
                }
            }
        }

        return $query->where('target_type', 'all')->latest()->get();
    }

    public function adminIndex()
    {
        return Notification::latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'message' => 'required|string|max:5000',
            'target_type' => 'required|in:all,agency,plan',
            'target_identifier' => 'required_if:target_type,agency,plan|nullable|string',
        ]);

        $notification = Notification::create($validated);

        return response()->json($notification, 201);
    }

    public function update(Request $request, $id)
    {
        $notification = Notification::findOrFail($id);
        $notification->update(['active' => !$notification->active]);
        return response()->json($notification);
    }

    public function destroy($id)
    {
        $notification = Notification::findOrFail($id);
        $notification->delete();
        return response()->json(['message' => 'Notification supprimée.']);
    }
}
