@component('mail::message')
# Welcome, {{ $name }}!

Your registration as a **{{ $role }}** has been approved.

**Assigned Facility:** {{ $location }}

{{ $messageText }}

@component('mail::button', ['url' => $reset_link])
Set Your Password
@endcomponent

Please click the button above to set your password and access your account.

Thanks,<br>
{{ config('app.name') }}
@endcomponent
