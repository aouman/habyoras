<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Agency;
use Illuminate\Http\Request;

class AgencyController extends Controller
{
    public function index()
    {
        return Agency::withCount('properties')->get();
    }

    public function show($id)
    {
        $agency = Agency::with('properties')->findOrFail($id);
        return response()->json($agency);
    }

    public function update(Request $request, $id)
    {
        $agency = Agency::findOrFail($id);

        $validated = $request->validate([
            'name' => 'string|max:255',
            'city' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'phone_call' => 'nullable|string|max:20',
            'phone_whatsapp' => 'nullable|string|max:20',
            'email' => 'email|unique:agencies,email,' . $id,
        ]);

        $agency->update($validated);
        return response()->json($agency);
    }

    public function toggleStatus($id)
    {
        $agency = Agency::findOrFail($id);
        $agency->update(['active' => !$agency->active]);
        return response()->json($agency);
    }

    public function toggleVerification($id)
    {
        $agency = Agency::findOrFail($id);
        $agency->update(['verified' => !$agency->verified]);
        return response()->json($agency);
    }

    public function updateProfile(Request $request)
    {
        $agency = $request->user();
        $validated = $request->validate([
            'name' => 'string|max:255',
            'city' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'phone_call' => 'nullable|string|max:20',
            'phone_whatsapp' => 'nullable|string|max:20',
            'logo' => 'nullable|string',
        ]);
        $agency->update($validated);
        return response()->json($agency);
    }
}
