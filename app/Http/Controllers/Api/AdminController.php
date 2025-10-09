<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function index()
    {
        return User::select('id', 'name', 'email', 'role')->orderBy('name')->get();
    }

    public function updateRole(Request $request, $id)
    {
        $request->validate([
            'role' => 'required|string|in:user,admin,mother,child,health_worker',
        ]);

        $user = User::findOrFail($id);
        $user->role = $request->role;
        $user->save();

        return response()->json(['message' => 'Role updated successfully']);
    }

    public function destroy($id)
    {
        $user = auth()->user();

        if ($user->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $target = User::findOrFail($id);

        if ($target->role === 'admin') {
            return response()->json(['error' => 'Cannot delete another admin'], 403);
        }

        $target->delete();

        return response()->json(['message' => 'User deleted']);
    }

}
