@component('mail::message')
# Reschedule Approved

Dear {{ $booking->fullName }},

Your request to reschedule your postnatal appointment has been approved.

**New Date:** {{ $booking->preferredDate }}  
**New Time:** {{ $booking->preferredTime }}  
**Location:** {{ $booking->location }}

We look forward to seeing you.

Thanks,  
{{ config('app.name') }}
@endcomponent
