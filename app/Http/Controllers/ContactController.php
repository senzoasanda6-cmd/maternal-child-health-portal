<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function send(Request $request)
    {
        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'message' => 'required|string|max:2000',
        ]);

        Mail::raw("Message from: {$validated['name']}\n\n{$validated['message']}", function ($mail) {
            $mail->to('your@email.com')
                 ->subject('New Mental Health Contact Message');
        });

        return response()->json(['success' => true]);
    }
}
