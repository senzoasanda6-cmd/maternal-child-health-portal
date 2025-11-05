<?php

namespace App\Http\Controllers\Dashboard;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use App\Models\PrenatalVisit;
use App\Models\PostnatalVisit;
use Carbon\Carbon;

class UnifiedVisitController extends Controller
{
    public function unifiedVisit(Request $request)
    {
        $user = Auth::user();
        $now = Carbon::now();

        $prenatal = PrenatalVisit::with(['facility', 'provider', 'child', 'immunizations'])
            ->where('user_id', $user->id)
            ->latest('visit_date')
            ->first();

        $postnatal = PostnatalVisit::with(['facility', 'provider', 'child', 'immunizations'])
            ->where('user_id', $user->id)
            ->latest('visit_date')
            ->first();

        $visit = null;
        $type = null;

        if ($prenatal && $postnatal) {
            $visit = $prenatal->visit_date > $postnatal->visit_date ? $prenatal : $postnatal;
            $type = $visit === $prenatal ? 'prenatal' : 'postnatal';
        } elseif ($prenatal) {
            $visit = $prenatal;
            $type = 'prenatal';
        } elseif ($postnatal) {
            $visit = $postnatal;
            $type = 'postnatal';
        }

        if (!$visit) {
            return response()->json(['message' => 'No visits found'], 404);
        }

        $past = $visit->immunizations->filter(fn($i) => $i->administered_on !== null);
        $upcoming = $visit->immunizations->filter(fn($i) =>
            $i->administered_on === null && $i->scheduled_on && Carbon::parse($i->scheduled_on)->isFuture()
        );
        $missed = $visit->immunizations->filter(fn($i) =>
            $i->administered_on === null && $i->scheduled_on && Carbon::parse($i->scheduled_on)->isPast()
        );

        return response()->json([
            'visit_type' => $type,
            'visit_date' => $visit->visit_date,
            'notes' => $visit->notes,
            'facility' => optional($visit->facility)->only(['id', 'name', 'location']),
            'provider' => optional($visit->provider)->only(['id', 'name', 'email']),
            'child' => optional($visit->child)->only(['id', 'name', 'birth_date', 'gender']),
            'immunizations' => [
                'past' => $past->map(fn($i) => $i->only(['id', 'vaccine_name', 'dose', 'administered_on', 'notes'])),
                'upcoming' => $upcoming->map(fn($i) => $i->only(['id', 'vaccine_name', 'dose', 'scheduled_on', 'notes'])),
                'missed' => $missed->map(fn($i) => $i->only(['id', 'vaccine_name', 'dose', 'scheduled_on', 'notes'])),
            ],
        ]);
    }
}
