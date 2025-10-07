<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\App;

class VaccineReminderMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $child;
    public $vaccines;

    /**
     * Create a new message instance.
     */
    public function __construct($user, $child, $vaccines)
    {
        $this->user = $user;
        $this->child = $child;
        $this->vaccines = $vaccines;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        App::setLocale($this->user->language ?? 'en');

        return $this->subject(__('vaccine.subject'))
            ->view('emails.vaccine_reminder')
            ->with([
                'greeting' => __('vaccine.greeting', ['name' => $this->user->name]),
                'message' => __('vaccine.message', ['child' => $this->child->name]),
                'vaccines' => $this->vaccines,
                'closing' => __('vaccine.closing'),
            ]);
    }
}
