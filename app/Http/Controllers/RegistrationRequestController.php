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
use App\Models\Facility;


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
            'facility_id' => 'nullable|integer',
            'district' => 'nullable|string',
            'comments' => 'nullable|string',
        ]);

        $registrationData = $validated;
        unset($registrationData['password'], $registrationData['password_confirmation']);
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

        // Determine facility assignment
        $facilityId = match ($request->role) {
            'central_admin' => Facility::where('type', 'central')->first()?->id,
            'district_admin' => Facility::where('type', 'district')
                ->where('district', $request->district ?? null)
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

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
            'role' => $request->role,
            'facility_id' => $facilityId,
        ]);

        $request->update(['status' => 'approved']);

        $token = Password::createToken($user);
        $resetLink = url("/password/reset/{$token}?email=" . urlencode($user->email));

        $hospital = Hospital::find($user->hospital_id);
        $hospitalName = $hospital ? $hospital->name : 'N/A';
        $details = [
            'name' => $user->name,
            'role' => $user->role,
            'reset_link' => $resetLink,
            'location' => $user->facility?->name ?? $hospitalName ?? 'N/A',
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

        // Send rejection email
        Mail::to($request->email)->send(new RegistrationRejected([
            'name' => $request->name,
            'role' => $request->role,
        ]));

        Log::info("User {$request->email} rejected by admin ID: " . Auth::id());

        return response()->json(['message' => 'User rejected and notified']);
    }
}
