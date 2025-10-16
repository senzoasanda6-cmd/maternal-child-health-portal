<?php


namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class RegistrationRejected extends Mailable
{
    use Queueable, SerializesModels;

    public $userData;

    public function __construct($userData)
    {
        $this->userData = $userData;
    }

    public function build()
    {
        return $this->subject('Your Registration Request Was Rejected')
            ->view('emails.registration_rejected');
    }
}
