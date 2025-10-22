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
            'role' => 'required|string',
            'facility_id' => 'nullable|integer',
            'district' => 'nullable|string',
            'sub_district' => 'nullable|string',
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

    public function approve($id)
    {
        $request = RegistrationRequest::findOrFail($id);

        $facilityId = match ($request->role) {
            'central_admin' => Facility::where('type', 'central')->first()?->id,
            'district_admin' => Facility::where('type', 'district')
                ->where('district', $request->district ?? null)
                ->where('sub_district', $request->sub_district ?? null)
                ->first()?->id,
            'clinic_staff' => Facility::where('type', 'clinic')
                ->where('id', $request->facility_id)
                ->first()?->id,

            'hospital_staff' => Facility::where('type', 'hospital')
                ->where('id', $request->facility_id)
                ->first()?->id,
            'mother' => Facility::where('id', $request->facility_id)->first()?->id,
            default => null,
        };

        $generatedPassword = Str::random(12); // generates a secure 12-character password

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($generatedPassword),
            'role' => $request->role,
            'facility_id' => $facilityId,
             'must_reset_password' => true,
        ]);


        $request->update([
            'status' => 'approved',
            'approved_at' => now(),
            'approved_by' => Auth::id(),
        ]);

        AuditLog::create([
            'action' => 'registration_approved',
            'details' => "Approved registration for {$request->email} (role: {$request->role})",
            'performed_by' => Auth::id(),
        ]);

        $token = Password::createToken($user);
        $resetLink = url("/password/reset/{$token}?email=" . urlencode($user->email));

        $details = [
            'name' => $user->name,
            'role' => $user->role,
            'location' => $user->facility?->name ?? 'N/A',
            'reset_link' => $resetLink,
        ];



        switch ($user->role) {
            case 'central_admin':
                $details['message'] = 'You now have access to the central administration dashboard.';
                break;
            case 'district_admin':
                $details['message'] = 'You are responsible for managing district-level operations.';
                break;
            case 'clinic_staff':
                $details['message'] = 'Welcome to the clinic team. You can now manage patient records and appointments.';
                break;
            case 'hospital_staff':
                $details['message'] = 'You have access to hospital-level tools and reporting.';
                break;
            case 'mother':
                $details['message'] = 'Your account has been approved. You can now track your child’s health journey.';
                break;
            default:
                $details['message'] = 'Your account has been approved.';
        }

        Mail::to($user->email)->queue(new RegistrationApproved($details));

        Log::info("User {$request->email} approved by admin ID: " . Auth::id());

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
