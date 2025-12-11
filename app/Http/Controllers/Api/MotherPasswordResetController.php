<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Notifications\MotherResetPasswordNotification;

class MotherPasswordResetController extends Controller
{
    /**
     * Send password reset link to mother's email
     */
    public function sendResetLinkEmail(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        // Ensure the email belongs to a mother
        $mother = User::where('email', $request->email)
                      ->where('role', 'mother')
                      ->first();

        if (!$mother) {
            return response()->json(['message' => 'Email not found'], 404);
        }

        // Create password reset token
        $token = app('auth.password.broker')->createToken($mother);

        // Send reset email notification
        $mother->notify(new MotherResetPasswordNotification($token));

        return response()->json([
            'message' => 'Reset link sent to your email.'
        ]);
    }

    /**
     * Reset mother's password
     */
    public function reset(Request $request)
    {
        $request->validate([
            'token'    => 'required',
            'email'    => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        // Make sure the user is a mother
        $mother = User::where('email', $request->email)
                      ->where('role', 'mother')
                      ->first();

        if (!$mother) {
            return response()->json(['message' => 'Invalid email or role'], 404);
        }

        $status = Password::broker('users')->reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->password = Hash::make($password);
                $user->save();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json([
                'message' => 'Password has been reset successfully.'
            ], 200);
        }

        return response()->json([
            'message' => __($status)
        ], 400);
    }
}
