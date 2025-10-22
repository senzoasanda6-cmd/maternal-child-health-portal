@component('mail::message')
# Welcome to the Clinic Team, {{ $name }}!

Your account has been approved for **{{ $location }}**.

You can now manage patient records, appointments, and clinic operations.

@component('mail::button', ['url' => $reset_link])
Set Your Password
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent
