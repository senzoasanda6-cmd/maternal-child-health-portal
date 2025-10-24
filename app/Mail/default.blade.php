@component('mail::message')
# Welcome, {{ $name }}!

Your account has been approved.

@component('mail::button', ['url' => $reset_link])
Set Your Password
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent
