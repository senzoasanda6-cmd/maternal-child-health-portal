<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Hospital;

Route::post('/register', function (Request $request) {
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users',
        'password' => 'required|string|min:8|confirmed',
        'role' => 'required|string|in:mother,child,health_worker',
        'hospital_id' => 'nullable|exists:hospitals,id',
    ]);
    $user = User::where('name', '=', $request->name)->first();
    // Only allow privileged roles if current user is admin
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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::middleware(['auth:sanctum', 'role:admin'])->get('/admin/dashboard', function () {
    return response()->json(['message' => 'Welcome Admin']);
});

Route::middleware(['auth:sanctum', 'role:health_worker'])->get('/health/dashboard', function () {
    $user = Auth::user();
    $hospital = Hospital::with(['patients', 'appointments'])->find($user->hospital_id);
    return response()->json($hospital);
});

Route::middleware(['',''])->get('', function (Request $request) {
    return $request->user();
});
Route::middleware(['auth:sanctum', 'role:admin'])->get('/admin/hospitals', function () {
    return Hospital::withCount(['patients', 'appointments'])->get();
});

Route::middleware(['auth:sanctum', 'role:admin'])->get('/admin/hospital/{id}/dashboard', function ($id) {
    $hospital = Hospital::with(['patients', 'appointments'])->findOrFail($id);
    return response()->json($hospital);
});
