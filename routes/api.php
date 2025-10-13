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


use App\Http\Controllers\Auth\LoginController;

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

// 🔐 Login
Route::post('/login', function (Request $request) {
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    if (!Auth::attempt($request->only('email', 'password'))) {
        return response()->json(['error' => 'Invalid credentials'], 401);
    }

    $user = Auth::user();

    return response()->json([
        'user' => $user,
        'token' => $user->createToken('authToken')->plainTextToken,
    ]);
});

// 🔒 Authenticated User Info
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// 🏥 Admin Routes
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('/admin/dashboard', function () {
        return response()->json(['message' => 'Welcome Admin']);
    });

    Route::get('/admin/hospitals', function () {
        return Hospital::withCount(['patients', 'appointments'])->get();
    });

    Route::get('/admin/hospital/{id}/dashboard', function ($id) {
        $hospital = Hospital::with(['patients', 'appointments'])->findOrFail($id);
        return response()->json($hospital);
    });
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

        $dashboard = [];
        foreach ($schedule as $week => $vaccine) {
            $dashboard[] = [
                'vaccine' => $vaccine,
                'due_week' => $week,
                'status' => in_array($vaccine, $given) ? 'Completed' : ($ageInWeeks >= $week ? 'Overdue' : 'Upcoming'),
            ];
        }

        return $dashboard;
    });
});

// 🩺 Health Worker Routes
Route::middleware(['auth:sanctum', 'role:health_worker'])->get('/health/dashboard', function () {
    $user = Auth::user();
    $hospital = Hospital::with(['patients', 'appointments'])->find($user->hospital_id);
    return response()->json($hospital);
});

// 👶 Child Health Routes
Route::get('/admin/reschedule-requests', [AdminBookingController::class, 'pendingReschedules']);
Route::patch('/admin/bookings/{id}/approve-reschedule', [AdminBookingController::class, 'approveReschedule']);


Route::get('/events', [CalendarEventController::class, 'index']);
Route::post('/postnatal-bookings', [PostnatalBookingController::class, 'store']);
Route::middleware('auth:sanctum')->group(function () {
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
    Route::middleware(['auth:sanctum', 'role:admin'])->get('/hospitals/{id}/dashboard', function ($id) {
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
    Route::middleware(['auth:sanctum', 'role:admin'])->get('/hospitals/{id}/visit-trends', function (Request $request, $id) {
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

    Route::middleware('auth:sanctum')->get('/dashboard/last-visit', [DashboardController::class, 'lastVisit']);
    Route::middleware('auth:sanctum')->get('/dashboard/pregnancy-stage', [DashboardController::class, 'pregnancyStage']);
    Route::middleware('auth:sanctum')->get('/dashboard/appointments', [DashboardController::class, 'appointments']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/mother/{id}/dashboard', [MotherDashboardController::class, 'show']);
    });

    Route::middleware('auth:sanctum')->group(function () {
        Route::middleware('auth:sanctum')->apiResource('children', ChildController::class);

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
