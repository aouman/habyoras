<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\Subscription;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'property_id' => 'required|exists:properties,id',
            'agency_id' => 'required|exists:agencies,id',
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email',
            'phone' => 'nullable|string|max:20',
            'message' => 'required|string',
        ]);

        $subscription = Subscription::where('agency_id', $validated['agency_id'])->first();
        if (!$subscription || !$subscription->can_message) {
            return response()->json(['message' => "Cette agence ne peut pas recevoir de messages avec son plan actuel."], 403);
        }

        $msg = Message::create($validated);
        return response()->json($msg, 201);
    }

    public function agencyMessages(Request $request)
    {
        return Message::where('agency_id', $request->user()->id)
            ->with('property')
            ->latest()
            ->paginate(20);
    }

    public function markRead($id)
    {
        $message = Message::findOrFail($id);
        $message->update(['read' => true]);
        return response()->json($message);
    }

    public function destroy($id)
    {
        $message = Message::findOrFail($id);
        $message->delete();
        return response()->json(['message' => 'Message supprimé.']);
    }
}
