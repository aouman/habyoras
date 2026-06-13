<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\AgencyInvitationMail;
use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'nullable|string|max:20',
            'message' => 'required|string',
        ]);

        $contact = Contact::create($validated);

        $registerUrl = config('app.url') . '/auth?register=1';
        Mail::to($contact->email)->send(new AgencyInvitationMail($contact->name, $registerUrl));

        return response()->json(['message' => 'Message envoyé. Vérifiez vos emails pour le lien d\'inscription.'], 201);
    }
}
