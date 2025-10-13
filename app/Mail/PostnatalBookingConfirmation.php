<?php

namespace App\Mail;

use App\Models\PostnatalBooking;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Content;

class PostnatalBookingConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public PostnatalBooking $booking) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your Postnatal Visit Confirmation',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.booking_confirmation',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
