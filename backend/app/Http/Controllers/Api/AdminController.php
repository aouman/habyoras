<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Agency;
use App\Models\Property;
use App\Models\Subscription;
use App\Models\Message;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function dashboard()
    {
        $totalAgencies = Agency::count();
        $totalProperties = Property::count();
        $totalMessages = Message::count();
        $activeSubscriptions = Subscription::where('status', 'active')->count();
        $reportedProperties = Property::where('reported', true)->count();
        $pendingProperties = Property::where('moderation', 'En attente')->count();

        $propertiesByType = Property::selectRaw('type, count(*) as count')
            ->groupBy('type')->get();

        $latestProperties = Property::with('agency')
            ->latest()->take(5)->get();

        return response()->json([
            'total_agencies' => $totalAgencies,
            'total_properties' => $totalProperties,
            'total_messages' => $totalMessages,
            'active_subscriptions' => $activeSubscriptions,
            'reported_properties' => $reportedProperties,
            'pending_properties' => $pendingProperties,
            'properties_by_type' => $propertiesByType,
            'latest_properties' => $latestProperties,
        ]);
    }

    public function users()
    {
        // In a full app this would fetch from a users table
        return response()->json([]);
    }
}
