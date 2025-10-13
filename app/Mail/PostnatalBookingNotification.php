<?php

namespace App\Mail;

use App\Models\PostnatalBooking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PostnatalBookingNotification extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public PostnatalBooking $booking) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Postnatal Booking Notification',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.booking',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
