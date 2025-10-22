<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class RegistrationApproved extends Mailable
{
    use Queueable, SerializesModels;

    public $details;

    public function __construct($details)
    {
        $this->details = $details;
    }

    public function build()
    {
        $role = $this->details['role'] ?? 'default';
        $template = "emails.registration.approved." . $role;

        // Fallback if template doesn't exist
        if (!view()->exists($template)) {
            $template = "emails.registration.approved.default";
        }

        return $this->subject('Your Account Has Been Approved')
            ->markdown($template)
            ->with($this->details);
    }
}
