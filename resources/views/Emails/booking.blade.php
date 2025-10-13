@component('mail::message')
# New Postnatal Booking

**Name:** {{ $booking->fullName }}  
**Date:** {{ $booking->preferredDate }}  
**Time:** {{ $booking->preferredTime }}  
**Location:** {{ $booking->location }}  
**Reason:** {{ $booking->reason }}

@component('mail::button', ['url' => route('admin.bookings')])
Review Booking
@endcomponent

Thanks,  
{{ config('app.name') }}
@endcomponent
