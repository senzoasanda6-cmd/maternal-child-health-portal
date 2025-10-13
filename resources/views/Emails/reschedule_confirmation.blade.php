@component('mail::message')
# Appointment Rescheduled

Dear {{ $booking->fullName }},

Your postnatal visit has been rescheduled:

**New Date:** {{ $booking->preferredDate }}  
**New Time:** {{ $booking->preferredTime }}  
**Location:** {{ $booking->location }}  
**Reason:** {{ $booking->reason }}

If this change wasn't expected, please contact us.

Thanks,  
{{ config('app.name') }}
@endcomponent
