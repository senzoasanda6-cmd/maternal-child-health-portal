<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\AdminSettingsController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/debug-csrf', function (Request $request) {
    return response()->json([
        'csrf_token' => csrf_token(),
        'session' => session()->all(),
    ]);
});
Route::middleware(['auth', 'can:isAdmin'])->group(function () {
    Route::get('/admin/settings', [AdminSettingsController::class, 'edit'])->name('admin.settings.edit');
    Route::post('/admin/settings', [AdminSettingsController::class, 'update'])->name('admin.settings.update');
});
