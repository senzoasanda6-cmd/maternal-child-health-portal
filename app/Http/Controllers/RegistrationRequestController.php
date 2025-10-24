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
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:registration_requests,email',
            'role' => 'required|string|in:mother,health_worker',
            'designation' => 'nullable|string', // NEW
            'facility_id' => 'nullable|integer',
            'district' => 'nullable|string',
            'sub_district' => 'nullable|string',
            'custom_designation' => 'nullable|string|max:100',

        ]);




        $registrationData = $validated;

        unset($registrationData['password_confirmation']);
        $registrationData['status'] = 'pending';

        RegistrationRequest::create($registrationData);

        return response()->json(['message' => 'Request submitted'], 201);
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
            'mother', 'health_worker' => Facility::find($registration->facility_id)?->id,
            default => null,
        };

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

        $registration->update([
            'status' => 'approved',
            'approved_at' => now(),
            'approved_by' => Auth::id(),
        ]);

        AuditLog::create([
            'action' => 'registration_approved',
            'details' => "Approved registration for {$registration->email} (role: {$registration->role}, sub-role: {$subRole})",
            'performed_by' => Auth::id(),
        ]);

        $token = Password::createToken($user);
        $resetLink = url("/password/reset/{$token}?email=" . urlencode($user->email));

        $details = [
            'name' => $user->name,
            'role' => $user->role,
            'location' => $user->facility?->name ?? 'N/A',
            'reset_link' => $resetLink,
            'sub_role' => $user->sub_role,
            'message' => match ($user->role) {
                'health_worker' => "Welcome to the health team as a {$user->sub_role}. You can now manage patient care.",
                'mother' => 'Your account has been approved. You can now track your child’s health journey.',
                default => 'Your account has been approved.',
            },
        ];

        Mail::to($user->email)->queue(new RegistrationApproved($details));
        Log::info("User {$registration->email} approved by admin ID: " . Auth::id());

        return response()->json(['message' => 'User approved and notified']);
    }



    public function reject($id)
    {
        $request = RegistrationRequest::findOrFail($id);
        $request->update(['status' => 'rejected']);

        Mail::to($request->email)->send(new RegistrationRejected([
            'name' => $request->name,
            'role' => $request->role,
        ]));

        AuditLog::create([
            'action' => 'registration_rejected',
            'details' => "Rejected registration for {$request->email} (role: {$request->role})",
            'performed_by' => Auth::id(),
        ]);

        Log::info("User {$request->email} rejected by admin ID: " . Auth::id());

        return response()->json(['message' => 'User rejected and notified']);
    }
}
