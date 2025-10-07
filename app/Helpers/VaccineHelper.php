<?php

namespace App\Helpers;

use Carbon\Carbon;

class VaccineHelper
{
    public static function getUpcomingVaccines($child)
    {
        $ageInWeeks = Carbon::parse($child->dob)->diffInWeeks(now());

        $schedule = [
            6 => 'BCG',
            10 => 'Polio',
            14 => 'DTP',
            18 => 'Measles',
        ];

        $given = $child->vaccinations->pluck('vaccine_name')->toArray();
        $upcoming = [];

        foreach ($schedule as $week => $vaccine) {
            if ($ageInWeeks >= $week && !in_array($vaccine, $given)) {
                $upcoming[] = $vaccine;
            }
        }

        return $upcoming;
    }
}
