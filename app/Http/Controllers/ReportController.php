<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PostnatalVisit;
use App\Models\Vaccination;
use App\Models\Appointment;
use Carbon\Carbon;

class ReportController extends Controller
{
    /**
     * Get vaccine progress stats from seeded appointments
     * Counts appointments by phase=vaccination and status
     */
    public function vaccineProgress($id, Request $request)
    {
        $query = Appointment::where('facility_id', $id)
            ->where('phase', 'vaccination');

        // Apply date range filters if provided
        if ($request->filled('start_date')) {
            $query->where('date', '>=', $request->start_date);
        }
        if ($request->filled('end_date')) {
            $query->where('date', '<=', $request->end_date);
        }

        $appointments = $query->with(['child', 'user'])->get();

        // Calculate statistics
        $completed = $appointments->where('status', 'completed')->count();
        $missed = $appointments->where('status', 'no_show')->count();
        $upcoming = $appointments->where('status', 'scheduled')->count();
        $totalChildren = $appointments->pluck('child_id')->unique()->count();

        return response()->json([
            'completed' => $completed,
            'missed' => $missed,
            'upcoming' => $upcoming,
            'total_children' => $totalChildren,
            'total_appointments' => $appointments->count(),
        ]);
    }

    /**
     * Get postnatal visit stats from seeded appointments
     * Counts appointments by phase=postnatal and groups by date
     */
    public function postnatalVisits($id, Request $request)
    {
        $query = Appointment::where('facility_id', $id)
            ->where('phase', 'postnatal');

        // Apply date range filters if provided
        if ($request->filled('start_date')) {
            $query->where('date', '>=', $request->start_date);
        }
        if ($request->filled('end_date')) {
            $query->where('date', '<=', $request->end_date);
        }

        $appointments = $query->with(['child', 'user'])->get();

        // Calculate statistics
        $totalVisits = $appointments->count();
        $totalChildren = $appointments->pluck('child_id')->unique()->count();
        $averagePerChild = $totalChildren > 0 ? round($totalVisits / $totalChildren, 2) : 0;

        // Group by date for trend chart
        $visitsByDay = $appointments->groupBy(function ($apt) {
            return $apt->date->format('Y-m-d');
        })->map(function ($group) {
            return $group->count();
        })->toArray();

        return response()->json([
            'total_visits' => $totalVisits,
            'average_visits_per_child' => $averagePerChild,
            'total_children' => $totalChildren,
            'visits_by_day' => $visitsByDay,
        ]);
    }

    /**
     * Get visit trends (all phases) from seeded appointments
     */
    public function visitTrends($id, Request $request)
    {
        $query = Appointment::where('facility_id', $id);

        // Apply date range filters if provided
        if ($request->filled('start_date')) {
            $query->where('date', '>=', $request->start_date);
        }
        if ($request->filled('end_date')) {
            $query->where('date', '<=', $request->end_date);
        }

        $appointments = $query->get();

        // Group by phase
        $byPhase = $appointments->groupBy('phase')->map(function ($group) {
            return [
                'total' => $group->count(),
                'completed' => $group->where('status', 'completed')->count(),
                'scheduled' => $group->where('status', 'scheduled')->count(),
                'cancelled' => $group->where('status', 'cancelled')->count(),
            ];
        })->toArray();

        // Group by date for trend
        $byDate = $appointments->groupBy(function ($apt) {
            return $apt->date->format('Y-m-d');
        })->map(function ($group) {
            return $group->count();
        })->toArray();

        return response()->json([
            'by_phase' => $byPhase,
            'by_date' => $byDate,
            'total_appointments' => $appointments->count(),
        ]);
    }
}
