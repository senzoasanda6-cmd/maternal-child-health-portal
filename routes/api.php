<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use App\Models\Facility;
// use App\Models\Hospital;
use App\Models\Child;
use App\Http\Controllers\PostnatalVisitController;
use App\Http\Controllers\VaccinationController;
use App\Http\Controllers\EventController;
use App\Helpers\VaccineHelper;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\Api\MotherController;
use App\Http\Controllers\Api\ChildController;
use App\Http\Controllers\Api\MotherDashboardController;
use App\Http\Controllers\PostnatalBookingController;
use App\Http\Controllers\CalendarEventController;
use App\Http\Controllers\AdminBookingController;
use App\Http\Controllers\MotherProfileController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\HealthWorkerController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\RegistrationRequestController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\FacilityController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AdminSettingsController;


// Publicly accessible route to get a list of all facilities
Route::get('/facilities', [FacilityController::class, 'index']);

Route::get('/login', function () {
    return response()->json(['message' => 'Please log in'], 401);
});

// Public registration request route
Route::post('/registration-request', [RegistrationRequestController::class, 'store']);

// Public login route
Route::post('/login', [LoginController::class, 'login']);

Route::post('/login', function (Request $request) {
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    if (!Auth::attempt($request->only('email', 'password'))) {
        return response()->json(['error' => 'Invalid credentials'], 401);
    }

    $request->session()->regenerate();

    return response()->json([
        'user' => Auth::user(),
    ]);
});

Route::middleware(['auth:sanctum'])->group(function () {
    // All other facility routes (create, show, update, delete) are protected
    Route::apiResource('facilities', FacilityController::class)->except(['index']);

    // 🔐 Registration
    Route::post('/register', function (Request $request) {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|string|in:mother,child,health_worker',
            'facility_id' => 'nullable|exists:facilities,id',
        ]);

        // Prevent unauthorized role assignment
        if (in_array($request->role, ['manager', 'clinical_manager']) && Auth::user()?->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized role assignment'], 403);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'facility_id' => $request->facility_id,
            'must_reset_password' => true,
        ]);

        // Return user info only (no token)
        return response()->json([
            'message' => 'Registration successful',
            'user' => $user,
        ]);
    });

    Route::post('/logout', function (Request $request) {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logged out']);
    });

    // 🔒 Authenticated User Info
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    // 🏥 Admin Routes
    Route::middleware(['checkrole:admin'])->prefix('admin')->group(function () {
        Route::get('/dashboard', fn() => response()->json(['message' => 'Welcome Admin']));

        // Facility Management (replaces Hospital Management)
        Route::apiResource('/facilities', FacilityController::class);
        Route::apiResource('/hospitals', FacilityController::class);


        // Registration Request Management
        Route::get('/registration-requests', [RegistrationRequestController::class, 'index']);
        Route::post('/registration-requests/{id}/approve', [RegistrationRequestController::class, 'approve']);
        Route::post('/registration-requests/{id}/reject', [RegistrationRequestController::class, 'reject']);

        // Admin Settings Management
        Route::get('/settings', [AdminSettingsController::class, 'getSettings']);
        Route::post('/settings', [AdminSettingsController::class, 'updateSettings']);
        // User Management
        Route::apiResource('/users', App\Http\Controllers\UserController::class);

        // Vaccine Schedule
        Route::get('/children/{childId}/vaccine-schedule', function ($childId) {
            $child = Child::with('vaccinations')->findOrFail($childId);
            $schedule = [
                6 => 'BCG',
                10 => 'Polio',
                14 => 'DTP',
                18 => 'Measles',
            ];

            $ageInWeeks = now()->diffInWeeks($child->dob);
            $given = $child->vaccinations->pluck('vaccine_name')->toArray();

            return collect($schedule)->map(function ($vaccine, $week) use ($ageInWeeks, $given) {
                return [
                    'vaccine' => $vaccine,
                    'due_week' => $week,
                    'status' => in_array($vaccine, $given) ? 'Completed' : ($ageInWeeks >= $week ? 'Overdue' : 'Upcoming'),
                ];
            })->values();
        });

        // Reports and Trends
        Route::get('/facilities/{id}/dashboard', [FacilityController::class, 'dashboard']);
        Route::get('/facilities/search', [FacilityController::class, 'search']);
        Route::get('/facilities/{id}/visit-trends', function (Request $request, $id) {
            $department = $request->query('department');

            $query = App\Models\PostnatalVisit::selectRaw('MONTH(visit_date) as month, COUNT(*) as count')
                ->where('facility_id', $id)
                ->whereYear('visit_date', now()->year);

            if ($department && $department !== 'All') {
                $query->where('department', $department);
            }

            $visits = $query->groupBy('month')->orderBy('month')->get();

            $months = collect(range(1, 12))->map(fn($m) => date('M', mktime(0, 0, 0, $m, 10)));
            $counts = $months->map(fn($label, $index) => optional($visits->firstWhere('month', $index + 1))->count ?? 0);

            return response()->json(['months' => $months, 'counts' => $counts]);
        });
        Route::get('/facilities/{id}/postnatal-visits', [ReportController::class, 'postnatalVisits']);
        Route::get('/facilities/{id}/vaccine-progress', [ReportController::class, 'vaccineProgress']);

        // Admin Profile Management
        Route::get('/profile', [AdminController::class, 'profile']);
        Route::put('/profile', [AdminController::class, 'update']);
    });

    // 🩺 Health Worker Routes
    Route::middleware(['checkrole:health_worker'])->get('/health/dashboard', function () {
        $user = Auth::user();
        $facility = Facility::with(['patients', 'appointments'])->find($user->facility_id);
        return response()->json($facility);
    });

    // 👶 Child Health Routes
    Route::get('/admin/reschedule-requests', [AdminBookingController::class, 'pendingReschedules']);
    Route::patch('/admin/bookings/{id}/approve-reschedule', [AdminBookingController::class, 'approveReschedule']);

    Route::get('/children', [ChildController::class, 'index']);
    Route::post('/children', [ChildController::class, 'store']);
    Route::patch('/children/{child}', [ChildController::class, 'update']);
    Route::delete('/children/{child}', [ChildController::class, 'destroy']);

    Route::get('/child-profile', [ChildController::class, 'show']);
    //Route::get('/events', [CalendarEventController::class, 'index']);
    Route::post('/postnatal-bookings', [PostnatalBookingController::class, 'store']);

    // Postnatal Visits
    Route::get('/children/{childId}/postnatal-visits', [PostnatalVisitController::class, 'index']);
    Route::post('/children/{childId}/postnatal-visits', [PostnatalVisitController::class, 'store']);

    // Vaccinations
    Route::get('/children/{childId}/vaccinations', [VaccinationController::class, 'index']);
    Route::post('/children/{childId}/vaccinations', [VaccinationController::class, 'store']);

    // Upcoming Vaccines
    Route::get('/children/{childId}/upcoming-vaccines', function ($childId) {
        $child = Child::with('vaccinations')->findOrFail($childId);
        return VaccineHelper::getUpcomingVaccines($child);
    });
    // Vaccine Schedule
    Route::get('/children/{childId}/vaccine-schedule', function ($childId) {
        $child = Child::with('vaccinations')->findOrFail($childId);
        return $child->getDueVaccines();
    });
    // Missed Vaccines
    Route::get('/children/{childId}/missed-vaccines', function ($childId) {
        $child = Child::with('vaccinations')->findOrFail($childId);
        return $child->getMissedVaccines();
    });
    // Events for Calendar
    Route::get('/events', [EventController::class, 'index']);

    Route::post('/contact-message', [ContactController::class, 'send']);

    Route::get('/mother-profile', [MotherProfileController::class, 'show']);
    Route::put('/mother-profile', [MotherProfileController::class, 'update']);
    Route::delete('/mother-profile', [MotherProfileController::class, 'destroy']);

    Route::middleware(['checkrole:health_worker'])->get('/health/patients', [HealthWorkerController::class, 'patients']);

    Route::get('/dashboard/last-visit', [DashboardController::class, 'lastVisit']);
    Route::get('/dashboard/pregnancy-stage', [DashboardController::class, 'pregnancyStage']);
    Route::get('/dashboard/appointments', [DashboardController::class, 'appointments']);

    Route::get('/mother/{id}/dashboard', [MotherDashboardController::class, 'show']);

    Route::apiResource('children', ChildController::class);
    Route::apiResource('mothers', MotherController::class);

    Route::get('/children/search', function (Request $request) {
        $query = Child::query();

        if ($request->filled('name')) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }

        if ($request->filled('dob')) {
            $query->whereDate('dob', $request->dob);
        }

        if ($request->filled('facility_id')) {
            $query->whereHas('motherProfile.user', function ($q) use ($request) {
                $q->where('facility_id', $request->facility_id);
            });
        }

        if ($request->filled('mother_id')) {
            $query->where('mother_id', $request->mother_id);
        }

        return $query->with('mother')->orderBy('name')->get();
    });
});

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/admin/audit-logs', [AuditLogController::class, 'index']);
});