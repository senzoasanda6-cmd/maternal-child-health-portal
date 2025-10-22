<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
    public function index(Request $request)
    {
        $query = AuditLog::with('performer')->latest();

        // Optional filters
        if ($request->has('action')) {
            $query->where('action', $request->action);
        }

        if ($request->has('performed_by')) {
            $query->where('performed_by', $request->performed_by);
        }

        return response()->json($query->paginate(20));
    }
}
