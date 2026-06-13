<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Agency;
use App\Models\Admin;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // === Agency Auth ===
    public function registerAgency(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:agencies',
            'password' => 'required|string|min:6',
            'city' => 'nullable|string|max:255',
        ]);

        $agency = Agency::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'city' => $validated['city'] ?? null,
        ]);

        $features = SubscriptionController::planFeatures('Basic');
        Subscription::create(array_merge([
            'agency_id' => $agency->id,
            'plan' => 'Basic',
            'amount' => '0 FCFA',
            'start_date' => now(),
            'status' => 'active',
        ], $features));

        $token = $agency->createToken('agency-token')->plainTextToken;

        return response()->json(['agency' => $agency, 'token' => $token], 201);
    }

    public function loginAgency(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $agency = Agency::where('email', $request->email)->first();

        if (!$agency || !Hash::check($request->password, $agency->password)) {
            throw ValidationException::withMessages(['email' => ['Identifiants incorrects.']]);
        }

        if (!$agency->active) {
            return response()->json(['message' => 'Compte désactivé.'], 403);
        }

        $token = $agency->createToken('agency-token')->plainTextToken;

        return response()->json(['agency' => $agency, 'token' => $token]);
    }

    public function meAgency(Request $request)
    {
        return response()->json($request->user());
    }

    public function logoutAgency(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnecté.']);
    }

    public function changePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:6|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($validated['current_password'], $user->password)) {
            throw ValidationException::withMessages(['current_password' => ['Mot de passe actuel incorrect.']]);
        }

        $user->password = Hash::make($validated['new_password']);
        $user->save();

        return response()->json(['message' => 'Mot de passe mis à jour.']);
    }

    // === Admin Auth ===
    public function loginAdmin(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $admin = Admin::where('email', $request->email)->first();

        if (!$admin || !Hash::check($request->password, $admin->password)) {
            throw ValidationException::withMessages(['email' => ['Identifiants incorrects.']]);
        }

        $token = $admin->createToken('admin-token')->plainTextToken;

        return response()->json(['admin' => $admin, 'token' => $token]);
    }

    public function meAdmin(Request $request)
    {
        return response()->json($request->user());
    }

    public function logoutAdmin(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Administrateur déconnecté.']);
    }
}
