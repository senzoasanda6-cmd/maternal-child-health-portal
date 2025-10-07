<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Http;
use App\Mail\MissedVaccineAlertMail;

class SendMissedVaccineAlert implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle()
    {
        $children = \App\Models\Child::with('vaccinations', 'mother')->get();

        foreach ($children as $child) {
            $missed = $child->getMissedVaccines();

            if (count($missed)) {
                $message = "Dear {$child->mother->name}, {$child->name} has missed the following vaccines:\n" .
                    implode(', ', array_column($missed, 'vaccine')) . "\nPlease visit your clinic soon.";

                // Send email
                Mail::to($child->mother->email)->send(new MissedVaccineAlertMail($child, $missed));

                // Send SMS or WhatsApp
                Http::post('https://sms-provider.com/send', [
                    'to' => $child->mother->phone,
                    'message' => $message
                ]);
            }
        }
    }

}
