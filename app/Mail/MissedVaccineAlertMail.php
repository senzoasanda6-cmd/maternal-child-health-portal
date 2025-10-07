<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class MissedVaccineAlertMail extends Mailable
{
    use Queueable, SerializesModels;

    public $child;
    public $missed;

    public function __construct($child, $missed)
    {
        $this->child = $child;
        $this->missed = $missed;
    }

    public function build()
    {
        return $this->subject('Missed Vaccines Alert')
            ->view('emails.missed_vaccine_alert')
            ->with([
                'child' => $this->child,
                'missed' => $this->missed,
            ]);
    }
}
