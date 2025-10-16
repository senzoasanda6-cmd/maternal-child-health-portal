<?php

namespace App\Http\Controllers;

use App\Models\RegistrationRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\RegistrationApproved;
use App\Mail\RegistrationRejected;
use Illuminate\Support\Facades\Password;
use App\Models\Hospital;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;


class RegistrationRequestController extends Controller
{
    use AuthorizesRequests;
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:registration_requests,email',
            'password' => 'required|string|min:6',
            'password_confirmation' => 'same:password',
            'role' => 'required|string',
            'hospital_id' => 'nullable|integer',
            'comments' => 'nullable|string',
        ]);

        // Optionally hash password before storing
        $validated['password'] = Hash::make($validated['password']);

        RegistrationRequest::create($validated);

        return response()->json(['message' => 'Request submitted'], 201);
    }

    public function index()
    {
        $this->authorize('viewAny', RegistrationRequest::class);

        return RegistrationRequest::where('status', 'pending')->get();
    }

    public function approve($id)
    {
        $request = RegistrationRequest::findOrFail($id);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
            'role' => $request->role,
            'hospital_id' => $request->hospital_id,
        ]);

        $request->update(['status' => 'approved']);

        $token = Password::createToken($user);
        $resetLink = url("/password/reset/{$token}?email=" . urlencode($user->email));

        $hospital = Hospital::find($user->hospital_id);
        $hospitalName = $hospital ? $hospital->name : 'N/A';

        Mail::to($user->email)->queue(new RegistrationApproved([
            'name' => $user->name,
            'role' => $user->role,
            'hospital' => $hospitalName,
            'reset_link' => $resetLink,
        ]));

        Log::info("User {$request->email} approved by admin ID: " . Auth::id());

        return response()->json(['message' => 'User approved and notified']);
    }
    public function reject($id)
    {
        $request = RegistrationRequest::findOrFail($id);
        $request->update(['status' => 'rejected']);

        // Send rejection email
        Mail::to($request->email)->send(new RegistrationRejected([
            'name' => $request->name,
            'role' => $request->role,
        ]));

        Log::info("User {$request->email} rejected by admin ID: " . Auth::id());

        return response()->json(['message' => 'User rejected and notified']);
    }
}
