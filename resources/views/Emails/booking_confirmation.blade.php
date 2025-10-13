@component('mail::message')
# Postnatal Visit Confirmed

Dear {{ $booking->fullName }},

Thank you for booking your postnatal checkup. Here are your appointment details:

**Date:** {{ $booking->preferredDate }}  
**Time:** {{ $booking->preferredTime }}  
**Location:** {{ $booking->location }}  
**Reason:** {{ $booking->reason }}

If you need to reschedule, please contact us at support@yourclinic.com.

We look forward to seeing you!

Thanks,  
{{ config('app.name') }}
@endcomponent
