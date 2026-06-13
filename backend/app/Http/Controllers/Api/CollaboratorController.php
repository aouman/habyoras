<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Collaborator;
use App\Models\Agency;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class CollaboratorController extends Controller
{
    public function index(Request $request)
    {
        $agencyId = $request->user() instanceof Collaborator ? $request->user()->agency_id : $request->user()->id;
        return Collaborator::where('agency_id', $agencyId)->get();
    }

    public function generateInviteCode(Request $request)
    {
        $agency = $request->user();

        $sub = Subscription::where('agency_id', $agency->id)->first();
        $maxCollaborators = $sub?->max_collaborators ?? 0;

        if ($maxCollaborators <= 0) {
            return response()->json(['message' => 'Votre formule ne permet pas d\'ajouter des collaborateurs.'], 403);
        }

        $agency->invite_code = Str::random(32);
        $agency->save();

        $frontendUrl = $request->input('frontend_url', config('app.url'));
        $inviteLink = "{$frontendUrl}/auth?invite_code={$agency->invite_code}";

        return response()->json([
            'invite_code' => $agency->invite_code,
            'invite_link' => $inviteLink,
            'max_collaborators' => $maxCollaborators,
            'current_count' => Collaborator::where('agency_id', $agency->id)->count(),
        ]);
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'invite_code' => 'required|string|exists:agencies,invite_code',
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:agency_collaborators,email',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $agency = Agency::where('invite_code', $validated['invite_code'])->first();

        $sub = Subscription::where('agency_id', $agency->id)->first();
        $maxCollaborators = $sub?->max_collaborators ?? 0;
        $currentCount = Collaborator::where('agency_id', $agency->id)->count();

        if ($currentCount >= $maxCollaborators) {
            return response()->json(['message' => 'Ce code d\'invitation a atteint sa limite d\'utilisations.'], 403);
        }

        $collaborator = Collaborator::create([
            'agency_id' => $agency->id,
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'active' => true,
        ]);

        $token = $collaborator->createToken('collaborator-token')->plainTextToken;

        return response()->json([
            'collaborator' => $collaborator->load('agency'),
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $collaborator = Collaborator::where('email', $request->email)->first();

        if (!$collaborator || !Hash::check($request->password, $collaborator->password)) {
            throw ValidationException::withMessages(['email' => ['Identifiants incorrects.']]);
        }

        if (!$collaborator->active) {
            return response()->json(['message' => 'Compte désactivé.'], 403);
        }

        $token = $collaborator->createToken('collaborator-token')->plainTextToken;

        return response()->json([
            'collaborator' => $collaborator->load('agency'),
            'token' => $token,
        ]);
    }

    public function me(Request $request)
    {
        $collaborator = $request->user()->load('agency');
        return response()->json([
            'id' => $collaborator->id,
            'name' => $collaborator->name,
            'email' => $collaborator->email,
            'agency_id' => $collaborator->agency_id,
            'agency_name' => $collaborator->agency->name,
            'agency' => $collaborator->agency,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnecté.']);
    }

    public function destroy(Request $request, $id)
    {
        $agencyId = $request->user() instanceof Collaborator ? $request->user()->agency_id : $request->user()->id;
        $collaborator = Collaborator::where('agency_id', $agencyId)->findOrFail($id);
        $collaborator->delete();
        return response()->json(['message' => 'Collaborateur supprimé.']);
    }
}
