<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Content;

class RescheduleRejected extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public $booking) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Your Reschedule Request Was Rejected');
    }

    public function content(): Content
    {
        return new Content(markdown: 'emails.reschedule_rejected');
    }

    public function attachments(): array
    {
        return [];
    }
}
