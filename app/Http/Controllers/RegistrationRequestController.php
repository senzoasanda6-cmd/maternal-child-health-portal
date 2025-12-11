<?php

namespace App\Http\Controllers;

use App\Models\RegistrationRequest;
use App\Models\User;
use App\Models\Facility;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Mail\RegistrationApproved;
use App\Mail\RegistrationRejected;
use Illuminate\Support\Str;


class RegistrationRequestController extends Controller
{
    use AuthorizesRequests;

    public function store(Request $request)
    {
        // Validate based on role
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:registration_requests,email|unique:users,email',
            'role' => 'required|string|in:mother,health_worker',
            'password' => $request->role === 'mother' ? 'required|string|min:8' : 'nullable',
            'password_confirmation' => $request->role === 'mother' ? 'required|string|same:password' : 'nullable',
            'designation' => 'nullable|string',
            'custom_designation' => 'nullable|string|max:100',
            'facility_id' => 'nullable|integer',
            'district' => 'nullable|string',
            'sub_district' => 'nullable|string',
        ]);

        if ($validated['role'] === 'mother') {
            // Immediate registration for mothers
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => 'mother',
                'facility_id' => $validated['facility_id'] ?? null,
                'must_reset_password' => false,
            ]);

            // Optional: send welcome email
            Mail::to($user->email)->queue(new RegistrationApproved([
                'name' => $user->name,
                'role' => $user->role,
                'location' => $user->facility?->name ?? 'N/A',
                'message' => 'Your account has been created. You can now track your child’s health journey.',
            ]));

            return response()->json(['message' => 'Account created successfully'], 201);
        }

        // Health workers: create a pending registration request
        unset($validated['password'], $validated['password_confirmation']);

        $validated['status'] = 'pending';

        $registration = RegistrationRequest::create($validated);

        return response()->json(['message' => 'Registration request submitted for approval'], 201);
    }

    public function index()
    {
        $this->authorize('viewAny', RegistrationRequest::class);

        return RegistrationRequest::with('facility')
            ->where('status', 'pending')
            ->get();
    }

    public function approve(Request $request, $id)
    {
        $registration = RegistrationRequest::findOrFail($id);
        $this->authorize('update', $registration);

        $subRole = $request->input('sub_role')
            ?: $registration->custom_designation
            ?: $registration->designation;

        $facilityId = match ($registration->role) {
            'health_worker' => Facility::find($registration->facility_id)?->id,
            default => null,
        };

        // Generate a random password
        $generatedPassword = Str::random(12);

        $user = User::create([
            'name' => $registration->name,
            'email' => $registration->email,
            'password' => Hash::make($generatedPassword),
            'role' => $registration->role,
            'sub_role' => $subRole,
            'facility_id' => $facilityId,
            'must_reset_password' => true,
        ]);

        // Update registration request status
        $registration->update([
            'status' => 'approved',
            'approved_at' => now(),
            'approved_by' => Auth::id(),
        ]);

        // Audit log
        AuditLog::create([
            'action' => 'registration_approved',
            'details' => "Approved registration for {$registration->email} (role: {$registration->role}, sub-role: {$subRole})",
            'performed_by' => Auth::id(),
        ]);

        // Send password reset link
        $token = Password::createToken($user);
        $resetLink = url("/password/reset/{$token}?email=" . urlencode($user->email));

        $details = [
            'name' => $user->name,
            'role' => $user->role,
            'location' => $user->facility?->name ?? 'N/A',
            'reset_link' => $resetLink,
            'sub_role' => $user->sub_role,
            'message' => "Welcome to the health team as a {$user->sub_role}. You can now manage patient care.",
        ];

        Mail::to($user->email)->queue(new RegistrationApproved($details));

        return response()->json(['message' => 'User approved and notified']);
    }




    public function reject(Request $request, $id)
    {
        $registration = RegistrationRequest::findOrFail($id);

        // Authorization: ensure only admins or authorized users can reject
        $this->authorize('update', $registration);

        // Optional rejection reason from admin
        $validated = $request->validate([
            'reason' => 'nullable|string|max:500',
        ]);

        $reason = $validated['reason'] ?? 'No specific reason provided';

        // Update the registration request status
        $registration->update([
            'status' => 'rejected',
            'rejected_at' => now(),
            'rejected_by' => Auth::id(),
            'rejection_reason' => $reason,
        ]);

        // Send rejection email
        Mail::to($registration->email)->queue(new RegistrationRejected([
            'name' => $registration->name,
            'role' => $registration->role,
            'reason' => $reason,
        ]));

        // Log the action
        AuditLog::create([
            'action' => 'registration_rejected',
            'details' => "Rejected registration for {$registration->email} (role: {$registration->role}). Reason: {$reason}",
            'performed_by' => Auth::id(),
        ]);

        return response()->json(['message' => 'Registration request rejected and user notified']);
    }
}
