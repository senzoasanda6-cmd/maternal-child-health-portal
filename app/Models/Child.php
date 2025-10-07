<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Carbon\Carbon;

class Child extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'dob',
        'mother_id',
        'hospital_id',
        // Add other relevant fields
    ];

    // 📅 Static vaccine schedule (age in weeks)
    protected static $vaccineSchedule = [
        6 => ['BCG'],
        10 => ['Polio'],
        14 => ['DTP'],
        18 => ['Measles'],
        24 => ['Hepatitis B'],
        36 => ['MMR'],
    ];

    // 🔗 Relationships
    public function postnatalVisits()
    {
        return $this->hasMany(PostnatalVisit::class);
    }

    public function vaccinations()
    {
        return $this->hasMany(Vaccination::class);
    }

    public function mother()
    {
        return $this->belongsTo(User::class, 'mother_id');
    }

    public function hospital()
    {
        return $this->belongsTo(Hospital::class);
    }

    // 📊 Age-based vaccine schedule logic
    public function getDueVaccines()
    {
        $age = $this->getAgeInWeeks();
        $given = $this->vaccinations->pluck('vaccine_name')->toArray();
        $due = [];

        foreach (self::$vaccineSchedule as $week => $vaccines) {
            foreach ($vaccines as $vaccine) {
                if (!in_array($vaccine, $given)) {
                    $due[] = [
                        'vaccine' => $vaccine,
                        'due_week' => $week,
                        'status' => $age >= $week ? 'Overdue' : 'Upcoming',
                    ];
                }
            }
        }

        return $due;
    }

    public function getUpcomingVaccines()
    {
        $ageInWeeks = $this->getAgeInWeeks();
        $given = $this->vaccinations->pluck('vaccine_name')->toArray();
        $upcoming = [];

        foreach (self::$vaccineSchedule as $week => $vaccines) {
            if ($ageInWeeks >= $week) {
                foreach ($vaccines as $vaccine) {
                    if (!in_array($vaccine, $given)) {
                        $upcoming[] = $vaccine;
                    }
                }
            }
        }

        return $upcoming;
    }

    public function getMissedVaccines()
    {
        $age = $this->getAgeInWeeks();
        $given = $this->vaccinations->pluck('vaccine_name')->toArray();
        $missed = [];

        foreach (self::$vaccineSchedule as $week => $vaccines) {
            if ($age > $week) {
                foreach ($vaccines as $vaccine) {
                    if (!in_array($vaccine, $given)) {
                        $missed[] = [
                            'vaccine' => $vaccine,
                            'due_week' => $week,
                            'status' => 'Missed',
                        ];
                    }
                }
            }
        }

        return $missed;
    }

    public function getVaccineProgressSummary()
    {
        $age = $this->getAgeInWeeks();
        $given = $this->vaccinations->pluck('vaccine_name')->toArray();

        $completed = 0;
        $missed = 0;
        $upcoming = 0;

        foreach (self::$vaccineSchedule as $week => $vaccines) {
            foreach ($vaccines as $vaccine) {
                if (in_array($vaccine, $given)) {
                    $completed++;
                } elseif ($age > $week) {
                    $missed++;
                } else {
                    $upcoming++;
                }
            }
        }

        return [
            'completed' => $completed,
            'missed' => $missed,
            'upcoming' => $upcoming,
        ];
    }

    public function getCoveragePercentage()
    {
        $total = collect(self::$vaccineSchedule)->flatten()->count();
        $given = $this->vaccinations->pluck('vaccine_name')->count();

        return $total > 0 ? round(($given / $total) * 100, 1) : 0;
    }

    public function getNextDueVaccine()
    {
        $age = $this->getAgeInWeeks();
        $given = $this->vaccinations->pluck('vaccine_name')->toArray();

        foreach (self::$vaccineSchedule as $week => $vaccines) {
            if ($age < $week) {
                foreach ($vaccines as $vaccine) {
                    if (!in_array($vaccine, $given)) {
                        return [
                            'vaccine' => $vaccine,
                            'due_week' => $week,
                            'status' => 'Upcoming',
                        ];
                    }
                }
            }
        }

        return null;
    }

    public function getAgeInWeeks()
    {
        if (empty($this->dob)) {
            return 0;
        }
        $dob = $this->dob instanceof Carbon ? $this->dob : Carbon::parse($this->dob);
        return now()->diffInWeeks($dob);
    }

    public function getAgeInMonths()
    {
        if (empty($this->dob)) {
            return 0;
        }
        $dob = $this->dob instanceof Carbon ? $this->dob : Carbon::parse($this->dob);
        return now()->diffInMonths($dob);
    }
}
