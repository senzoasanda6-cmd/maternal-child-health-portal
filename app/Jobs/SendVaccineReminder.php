<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\App;
use App\Mail\VaccineReminderMail;

class SendVaccineReminder implements ShouldQueue
{
    use Queueable, SerializesModels;

    protected $user;
    protected $child;
    protected $vaccines;

    public function __construct($user, $child, $vaccines)
    {
        $this->user = $user;
        $this->child = $child;
        $this->vaccines = $vaccines;
    }

    public function handle()
    {
        // 🌍 Set preferred language
        App::setLocale($this->user->language ?? 'en');

        // 📧 Send Email
        Mail::to($this->user->email)->send(new VaccineReminderMail($this->user, $this->child, $this->vaccines));

        // 📱 Prepare localized message
        $message = __('vaccine.greeting', ['name' => $this->user->name]) . "\n" .
                   __('vaccine.message', ['child' => $this->child->name]) . "\n" .
                   implode(', ', $this->vaccines) . "\n" .
                   __('vaccine.closing');

        // 📲 Send SMS
        Http::post('https://sms-provider.com/send', [
            'to' => $this->user->phone,
            'message' => $message
        ]);

        // 📲 Send WhatsApp (example using Twilio)
        Http::post('https://api.twilio.com/whatsapp/send', [
            'to' => 'whatsapp:' . $this->user->phone,
            'from' => 'whatsapp:+14155238886', // your Twilio WhatsApp number
            'body' => $message
        ]);
    }
}
