<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use App\Helpers\VaccineHelper;
use App\Models\User;
use App\Models\Child;
use App\Models\Facility;
use App\Http\Controllers\{
    PostnatalVisitController,
    VaccinationController,
    EventController,
    DashboardController,
    Api\MotherController,
    Api\ChildController,
    Api\MotherDashboardController,
    PostnatalBookingController,
    CalendarEventController,
    AdminBookingController,
    MotherProfileController,
    ContactController,
    HealthWorkerController,
    Auth\LoginController,
    RegistrationRequestController,
    ReportController,
    FacilityController,
    UserController,
    AdminController,
    AdminSettingsController,
    AuditLogController,
    Dashboard\UnifiedVisitController,
};
use Illuminate\Session\Middleware\StartSession;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;

// Public Routes
Route::middleware([ // This group will wrap all stateful API routes
    \App\Http\Middleware\EncryptCookies::class,
    \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
    StartSession::class,
    EnsureFrontendRequestsAreStateful::class,
])->group(function () {

    // Public routes for authentication
    Route::post('/login', [LoginController::class, 'login']);
    Route::get('/login', fn() => response()->json(['message' => 'Please log in'], 401))
        ->name('login'); // ✅ Correct place

    Route::get('/facilities', [FacilityController::class, 'index']);
    Route::post('/registration-request', [RegistrationRequestController::class, 'store']);

    // Authenticated Routes
    Route::middleware([
        'auth:sanctum',
        \App\Http\Middleware\CheckLoginDuration::class,
    ])->group(function () {
        Route::get('/dashboard/unified-visit', [UnifiedVisitController::class, 'unifiedVisit']);

        // User session and logout
        Route::post('/refresh', fn() => response()->json([
            'user' => Auth::user(),
            'message' => 'Session refreshed successfully',
        ]));
        Route::get('/user', fn(Request $request) => $request->user());
        Route::post('/logout', function (Request $request) {
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            return response()->json(['message' => 'Logged out']);
        });

        // Admin Routes
        Route::middleware('checkrole:admin')->prefix('admin')->group(function () {
            Route::get('/dashboard', fn() => response()->json(['message' => 'Welcome Admin']));
            Route::apiResource('/facilities', FacilityController::class);
            Route::apiResource('/users', UserController::class);
            Route::get('/registration-requests', [RegistrationRequestController::class, 'index']);
            Route::post('/registration-requests/{id}/approve', [RegistrationRequestController::class, 'approve']);
            Route::post('/registration-requests/{id}/reject', [RegistrationRequestController::class, 'reject']);
            Route::get('/facilities/{id}/dashboard', [FacilityController::class, 'dashboard']);
            Route::get('/facilities/{id}/visit-trends', [ReportController::class, 'visitTrends']);
            Route::get('/facilities/{id}/postnatal-visits', [ReportController::class, 'postnatalVisits']);
            Route::get('/facilities/{id}/vaccine-progress', [ReportController::class, 'vaccineProgress']);
            Route::get('/profile', [AdminController::class, 'profile']);
            Route::put('/profile', [AdminController::class, 'update']);
            Route::get('/settings', [AdminSettingsController::class, 'getSettings']);
            Route::post('/settings', [AdminSettingsController::class, 'updateSettings']);
            Route::get('/children/{childId}/vaccine-schedule', function ($childId) {
                $child = Child::with('vaccinations')->findOrFail($childId);
                return $child->getDueVaccines();
            });
            Route::get('/reschedule-requests', [AdminBookingController::class, 'pendingReschedules']);
            Route::patch('/bookings/{id}/approve-reschedule', [AdminBookingController::class, 'approveReschedule']);
            Route::get('audit-logs', [AuditLogController::class, 'index']);
            Route::get('/settings', [AdminSettingsController::class, 'getSettings']);
        });

        // District Admin Routes
        Route::middleware('checkrole:district_admin')->prefix('district')->group(function () {
            Route::get('/facilities', [FacilityController::class, 'districtFacilities']);
            Route::get('/facilities/export', [FacilityController::class, 'exportDistrictFacilities']);
            Route::get('/dashboard', fn() => response()->json(['message' => 'Welcome District Admin']));
            Route::get('/home', fn() => response()->json(['message' => 'District Admin Home']));
        });

        // Health Worker Routes
        Route::middleware('checkrole:health_worker,midwife,facility_worker,facility_nurse,facility_doctor')->prefix('health')->group(function () {
            Route::get('/dashboard', function () {
                $facility = Facility::with(['patients', 'appointments'])->find(Auth::user()->facility_id);
                return response()->json($facility);
            });
            Route::get('/patients', [HealthWorkerController::class, 'patients']);
            Route::get('/children/{childId}', [ChildController::class, 'show']);
            Route::get('/children/{childId}/postnatal-visits', [PostnatalVisitController::class, 'index']);
            Route::get('/children/{childId}/vaccinations', [VaccinationController::class, 'index']);
            Route::get('/children/{childId}/vaccine-progress', [ReportController::class, 'vaccineProgress']);
        });

        // Child Routes
        Route::prefix('children')->group(function () {
            Route::get('/', [ChildController::class, 'index']);
            Route::get('/search', [ChildController::class, 'search']);
            Route::post('/', [ChildController::class, 'store']);
            Route::get('/{child}', [ChildController::class, 'show']);
            Route::patch('/{child}', [ChildController::class, 'update']);
            Route::delete('/{child}', [ChildController::class, 'destroy']);
            Route::get('/{childId}/postnatal-visits', [PostnatalVisitController::class, 'index']);
            Route::post('/{childId}/postnatal-visits', [PostnatalVisitController::class, 'store']);
            Route::get('/{childId}/vaccinations', [VaccinationController::class, 'index']);
            Route::post('/{childId}/vaccinations', [VaccinationController::class, 'store']);
            Route::get('/{childId}/upcoming-vaccines', fn($childId) => VaccineHelper::getUpcomingVaccines(Child::findOrFail($childId)));
            Route::get('/{childId}/missed-vaccines', fn($childId) => Child::findOrFail($childId)->getMissedVaccines());
        });

        // Mother Routes
        Route::prefix('mother')->group(function () {
            Route::get('/profile', [MotherProfileController::class, 'show']);
            Route::put('/profile', [MotherProfileController::class, 'update']);
            Route::delete('/profile', [MotherProfileController::class, 'destroy']);
            Route::get('/dashboard', [MotherDashboardController::class, 'show']);
            Route::get('/{id}/dashboard', [MotherDashboardController::class, 'show']);
        });

        // Postnatal Bookings
        Route::post('/postnatal-bookings', [PostnatalBookingController::class, 'store']);

        // Events & Contact
        Route::get('/events', [EventController::class, 'index']);
        Route::post('/contact-message', [ContactController::class, 'send']);

        // Dashboard Widgets
        Route::get('/dashboard/last-visit', [DashboardController::class, 'lastVisit']);
        Route::get('/dashboard/pregnancy-stage', [DashboardController::class, 'pregnancyStage']);
        Route::get('/dashboard/appointments', [DashboardController::class, 'appointments']);
    });
});

// DB Test Route
Route::get('/db-test', function () {
    try {
        \Illuminate\Support\Facades\DB::connection()->getPdo();
        return response()->json(['message' => 'Database connection successful']);
    } catch (\Exception $e) {
        return response()->json(['message' => 'Database connection failed', 'error' => $e->getMessage()], 500);
    }
});
