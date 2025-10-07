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
use App\Helpers\VaccineHelper;

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
