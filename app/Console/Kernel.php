<?php
use App\Jobs\SendMissedVaccineAlert;

$schedule->job(new SendMissedVaccineAlert)->weekly();
