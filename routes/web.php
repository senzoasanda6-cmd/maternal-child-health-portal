<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/debug-csrf', function (Request $request) {
    return response()->json([
        'csrf_token' => csrf_token(),
        'session' => session()->all(),
    ]);
});