@component('mail::message')
# Hello, {{ $name }}!

Your account has been approved.

@component('mail::button', ['url' => $reset_link])
Set Your Password
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent
