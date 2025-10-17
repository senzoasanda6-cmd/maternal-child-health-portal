<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use App\Models\Hospital;
use App\Models\Child;
use App\Http\Controllers\PostnatalVisitController;
use App\Http\Controllers\VaccinationController;
use App\Http\Controllers\EventController;
use App\Helpers\VaccineHelper;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HospitalController;
use App\Http\Controllers\Api\MotherController;
use App\Http\Controllers\Api\ChildController;
use App\Http\Controllers\Api\MotherDashboardController;
use App\Http\Controllers\PostnatalBookingController;
use App\Http\Controllers\CalendarEventController;
use App\Http\Controllers\AdminBookingController;
use App\Http\Controllers\MotherProfileController;
use App\Http\Controllers\ContactController;
use app\Http\Controllers\HealthWorkerController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\RegistrationRequestController;
use App\Http\Controllers\ReportController;

Route::get('/login', function () {
    return response()->json(['message' => 'Please log in'], 401);
});

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

// 🔐 Registration
Route::post('/register', function (Request $request) {
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users',
        'password' => 'required|string|min:8|confirmed',
        'role' => 'required|string|in:mother,child,health_worker',
        'hospital_id' => 'nullable|exists:hospitals,id',
    ]);

    if (in_array($request->role, ['manager', 'clinical_manager']) && Auth::user()?->role !== 'admin') {
        return response()->json(['error' => 'Unauthorized role assignment'], 403);
    }

    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
        'role' => $request->role,
        'hospital_id' => $request->hospital_id,
    ]);

    return response()->json([
        'token' => $user->createToken('authToken')->plainTextToken,
        'user' => $user,
    ]);
});
Route::post('/logout', function () {
    Auth::guard('web')->logout();
    return response()->json(['message' => 'Logged out']);
});
// 🔐 Registration Request
Route::post('/registration-request', [RegistrationRequestController::class, 'store']);

Route::middleware(['auth', 'can:admin'])->group(function () {
    Route::get('/admin/registration-requests', [RegistrationRequestController::class, 'index']);
    Route::post('/admin/registration-requests/{id}/approve', [RegistrationRequestController::class, 'approve']);
    Route::post('/admin/registration-requests/{id}/reject', [RegistrationRequestController::class, 'reject']);
});


// 🔒 Authenticated User Info
Route::middleware('auth')->get('/user', function (Request $request) {
    return $request->user();
});

// 🏥 Admin Routes
Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', fn() => response()->json(['message' => 'Welcome Admin']));

    // Hospital Management
    Route::get('/hospitals', [HospitalController::class, 'index']);
    Route::post('/hospitals', [HospitalController::class, 'store']);
    Route::get('/hospitals/{id}', [HospitalController::class, 'show']);
    Route::put('/hospitals/{id}', [HospitalController::class, 'update']);
    Route::delete('/hospitals/{id}', [HospitalController::class, 'destroy']);
    Route::get('/hospitals-summary', [HospitalController::class, 'summary']);
    Route::get('/hospitals/{id}/dashboard', [HospitalController::class, 'dashboard']);
    Route::get('/admin/hospitals/search', [HospitalController::class, 'search']);
    Route::get('/admin/hospitals/{id}/visit-trends', [HospitalController::class, 'visitTrends']);
    Route::get('/hospitals/{id}/postnatal-visits', [ReportController::class, 'postnatalVisits']);
    Route::get('/hospitals/{id}/vaccine-progress', [ReportController::class, 'vaccineProgress']);

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
});


// 🩺 Health Worker Routes
Route::middleware(['auth', 'role:health_worker'])->get('/health/dashboard', function () {
    $user = Auth::user();
    $hospital = Hospital::with(['patients', 'appointments'])->find($user->hospital_id);
    return response()->json($hospital);
});

// 👶 Child Health Routes
Route::get('/admin/reschedule-requests', [AdminBookingController::class, 'pendingReschedules']);
Route::patch('/admin/bookings/{id}/approve-reschedule', [AdminBookingController::class, 'approveReschedule']);
Route::middleware('auth')->group(function () {
    Route::get('/children', [ChildController::class, 'index']);
    Route::post('/children', [ChildController::class, 'store']);
    Route::patch('/children/{child}', [ChildController::class, 'update']);
    Route::delete('/children/{child}', [ChildController::class, 'destroy']);
});
Route::middleware('auth')->group(function () {
    Route::get('/child-profile', [ChildController::class, 'show']);
});
Route::get('/events', [CalendarEventController::class, 'index']);
Route::post('/postnatal-bookings', [PostnatalBookingController::class, 'store']);
Route::middleware('auth')->group(function () {
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
    // Vaccine Progress Summary
    Route::get('/children/{childId}/vaccine-progress', function ($childId) {
        $child = Child::with('vaccinations')->findOrFail($childId);
        return $child->getVaccineProgressSummary();
    });
    // Hospital Vaccine Progress Summary
    Route::get('/hospital/{hospitalId}/vaccine-progress', function ($hospitalId) {
        $hospital = Hospital::with('children.vaccinations')->findOrFail($hospitalId);

        $summary = [
            'completed' => 0,
            'missed' => 0,
            'upcoming' => 0,
            'total_children' => $hospital->children->count(),
        ];

        foreach ($hospital->children as $child) {
            $progress = $child->getVaccineProgressSummary();
            $summary['completed'] += $progress['completed'];
            $summary['missed'] += $progress['missed'];
            $summary['upcoming'] += $progress['upcoming'];
        }

        return $summary;
    });
    // Hospital Dashboard for Admin
    Route::middleware(['auth', 'role:admin'])->get('/hospitals/{id}/dashboard', function ($id) {
        $hospital = App\Models\Hospital::withCount(['patients', 'appointments'])
            ->findOrFail($id);

        $visitsCount = App\Models\PostnatalVisit::where('hospital_id', $id)->count();

        return response()->json([
            'id' => $hospital->id,
            'name' => $hospital->name,
            'patients_count' => $hospital->patients_count,
            'appointments_count' => $hospital->appointments_count,
            'visits_count' => $visitsCount,
        ]);
    });
    // Events for Calendar
    Route::get('/events', [EventController::class, 'index']);

    // Monthly Visit Trends for Admin
    Route::middleware(['auth', 'role:admin'])->get('/hospitals/{id}/visit-trends', function (Request $request, $id) {
        $department = $request->query('department');

        $query = App\Models\PostnatalVisit::selectRaw('MONTH(visit_date) as month, COUNT(*) as count')
            ->where('hospital_id', $id)
            ->whereYear('visit_date', now()->year);

        if ($department && $department !== 'All') {
            $query->where('department', $department);
        }

        $visits = $query->groupBy('month')->orderBy('month')->get();

        $months = collect(range(1, 12))->map(fn($m) => date('M', mktime(0, 0, 0, $m, 10)));
        $counts = $months->map(fn($label, $index) => optional($visits->firstWhere('month', $index + 1))->count ?? 0);

        return response()->json([
            'months' => $months,
            'counts' => $counts,
        ]);
    });
    Route::post('/contact-message', [ContactController::class, 'send']);
    Route::middleware('auth')->group(function () {
        Route::get('/mother-profile', [MotherProfileController::class, 'show']);
        Route::put('/mother-profile', [MotherProfileController::class, 'update']);
        Route::delete('/mother-profile', [MotherProfileController::class, 'destroy']);
    });

    Route::middleware(['auth', 'role:health_worker'])->get('/health/patients', [HealthWorkerController::class, 'patients']);

    Route::middleware('auth')->get('/dashboard/last-visit', [DashboardController::class, 'lastVisit']);
    Route::middleware('auth')->get('/dashboard/pregnancy-stage', [DashboardController::class, 'pregnancyStage']);
    Route::middleware('auth')->get('/dashboard/appointments', [DashboardController::class, 'appointments']);
    Route::middleware('auth')->group(function () {
        Route::get('/mother/{id}/dashboard', [MotherDashboardController::class, 'show']);
    });

    Route::middleware('auth')->group(function () {
        Route::middleware('auth')->apiResource('children', ChildController::class);

        Route::apiResource('mothers', MotherController::class);
    });

    Route::get('/children/search', function (Request $request) {
        $query = Child::query();

        if ($request->filled('name')) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }

        if ($request->filled('dob')) {
            $query->whereDate('dob', $request->dob);
        }

        if ($request->filled('hospital_id')) {
            $query->where('hospital_id', $request->hospital_id);
        }

        if ($request->filled('mother_id')) {
            $query->where('mother_id', $request->mother_id);
        }

        return $query->with('hospital', 'mother')->orderBy('name')->get();
    });
});