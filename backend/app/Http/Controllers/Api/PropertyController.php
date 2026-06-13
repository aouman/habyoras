<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\Message;
use App\Models\Subscription;
use Illuminate\Http\Request;

class PropertyController extends Controller
{
    public function index(Request $request)
    {
        $query = Property::with('agency')->where('moderation', 'Approuvé');

        if ($request->type && $request->type !== 'Tous') {
            $query->where('type', $request->type);
        }
        if ($request->transaction && $request->transaction !== 'Tous') {
            $query->where('transaction', $request->transaction);
        }
        if ($request->city && $request->city !== 'Toutes') {
            $query->where('city', $request->city);
        }
        if ($request->min) {
            $query->where('price', '>=', $request->min);
        }
        if ($request->max) {
            $query->where('price', '<=', $request->max);
        }
        if ($request->beds) {
            $query->where('bedrooms', '>=', $request->beds);
        }
        if ($request->q) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', "%{$request->q}%")
                  ->orWhere('commune', 'like', "%{$request->q}%");
            });
        }

        return $query->latest()->paginate(9);
    }

    public function show($id)
    {
        $property = Property::with('agency')->findOrFail($id);
        $property->increment('views');
        return response()->json($property);
    }

    public function myProperties(Request $request)
    {
        $agencyId = $request->user() instanceof \App\Models\Collaborator
            ? $request->user()->agency_id
            : $request->user()->id;

        $query = Property::where('agency_id', $agencyId);

        if ($request->boolean('draft')) {
            $query->where('draft', true);
        } else {
            $query->where('draft', false);
        }

        return $query->latest()->paginate(6);
    }

    public function store(Request $request)
    {
        $agency = $request->user();
        $agencyId = $agency instanceof \App\Models\Collaborator ? $agency->agency_id : $agency->id;

        if (!$request->input('draft')) {
            $subscription = Subscription::where('agency_id', $agencyId)->first();
            $maxProps = $subscription?->max_properties ?? 5;
            $unlimited = $subscription?->unlimited_properties ?? false;

            if (!$unlimited) {
                $currentCount = Property::where('agency_id', $agencyId)->where('draft', false)->count();
                if ($currentCount >= $maxProps) {
                    return response()->json(['message' => "Vous avez atteint la limite de {$maxProps} biens de votre plan abonnement."], 403);
                }
            }
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'price' => 'required|numeric',
            'type' => 'required|in:Appartement,Villa,Terrain,Bureau,Immeuble',
            'transaction' => 'required|in:Location,Vente',
            'city' => 'required|string|max:255',
            'commune' => 'required|string|max:255',
            'country' => 'nullable|string|max:255',
            'surface' => 'nullable|numeric',
            'bedrooms' => 'nullable|integer',
            'bathrooms' => 'nullable|integer',
            'parking' => 'nullable|integer',
            'description' => 'nullable|string',
            'images' => 'nullable|array',
            'amenities' => 'nullable|array',
            'google_maps_link' => 'nullable|string',
            'status' => 'nullable|in:Actif,En pause,Loué,Vendu',
        ]);

        $validated['agency_id'] = $agencyId;

        if ($request->input('draft')) {
            $validated['draft'] = true;
            $validated['moderation'] = 'En attente';
            $validated['status'] = 'En pause';
        }

        $property = Property::create($validated);

        return response()->json($property, 201);
    }

    public function update(Request $request, $id)
    {
        $property = Property::findOrFail($id);
        $agencyId = $request->user() instanceof \App\Models\Collaborator
            ? $request->user()->agency_id
            : $request->user()->id;

        if ($property->agency_id !== $agencyId) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $validated = $request->validate([
            'title' => 'string|max:255',
            'price' => 'numeric',
            'type' => 'in:Appartement,Villa,Terrain,Bureau,Immeuble',
            'transaction' => 'in:Location,Vente',
            'city' => 'string|max:255',
            'commune' => 'string|max:255',
            'country' => 'nullable|string|max:255',
            'surface' => 'nullable|numeric',
            'bedrooms' => 'nullable|integer',
            'bathrooms' => 'nullable|integer',
            'parking' => 'nullable|integer',
            'description' => 'nullable|string',
            'images' => 'nullable|array',
            'amenities' => 'nullable|array',
            'google_maps_link' => 'nullable|string',
            'status' => 'nullable|in:Actif,En pause,Loué,Vendu',
            'draft' => 'nullable|boolean',
        ]);

        if ($property->draft && !$request->input('draft')) {
            $subscription = Subscription::where('agency_id', $request->user()->id)->first();
            $maxProps = $subscription?->max_properties ?? 5;
            $unlimited = $subscription?->unlimited_properties ?? false;
            if (!$unlimited) {
                $currentCount = Property::where('agency_id', $request->user()->id)->where('draft', false)->count();
                if ($currentCount >= $maxProps) {
                    return response()->json(['message' => "Vous avez atteint la limite de {$maxProps} biens de votre plan abonnement."], 403);
                }
            }
            $validated['draft'] = false;
            $validated['moderation'] = 'En attente';
            $validated['status'] = 'Actif';
        }

        $property->update($validated);
        return response()->json($property);
    }

    public function destroy($id, Request $request)
    {
        $property = Property::findOrFail($id);

        if ($request->user() instanceof \App\Models\Admin || $property->agency_id === $request->user()->id) {
            $property->delete();
            return response()->json(['message' => 'Bien supprimé.']);
        }

        return response()->json(['message' => 'Non autorisé.'], 403);
    }

    // Admin moderation
    public function moderate(Request $request, $id)
    {
        $property = Property::findOrFail($id);
        $validated = $request->validate([
            'moderation' => 'required|in:En attente,Approuvé',
        ]);
        $property->update($validated);
        return response()->json($property);
    }

    public function report($id)
    {
        $property = Property::findOrFail($id);
        $property->update(['reported' => true]);
        return response()->json(['message' => 'Bien signalé.']);
    }

    public function adminIndex(Request $request)
    {
        $query = Property::with('agency');

        if ($request->moderation) {
            $query->where('moderation', $request->moderation);
        }
        if ($request->reported) {
            $query->where('reported', true);
        }
        if ($request->q) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', "%{$request->q}%")
                  ->orWhereHas('agency', function ($aq) use ($request) {
                      $aq->where('name', 'like', "%{$request->q}%");
                  });
            });
        }

        return $query->latest()->paginate(6);
    }

    public function myStats(Request $request)
    {
        $agencyId = $request->user() instanceof \App\Models\Collaborator
            ? $request->user()->agency_id
            : $request->user()->id;

        $totalViews = Property::where('agency_id', $agencyId)->sum('views');
        $totalProperties = Property::where('agency_id', $agencyId)->where('draft', false)->count();
        $totalMessages = Message::where('agency_id', $agencyId)->count();
        $topProperties = Property::where('agency_id', $agencyId)
            ->where('draft', false)
            ->orderBy('views', 'desc')
            ->take(5)
            ->get(['id', 'title', 'images', 'views']);

        $available = Property::where('agency_id', $agencyId)->where('status', 'Actif')->count();
        $pending = Property::where('agency_id', $agencyId)->where('moderation', 'En attente')->count();
        $sold = Property::where('agency_id', $agencyId)->whereIn('status', ['Loué', 'Vendu'])->count();

        return response()->json([
            'total_views' => $totalViews,
            'total_properties' => $totalProperties,
            'total_messages' => $totalMessages,
            'available' => $available,
            'pending' => $pending,
            'sold' => $sold,
            'top_properties' => $topProperties,
        ]);
    }
}
