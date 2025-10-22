@component('mail::message')
# Welcome, {{ $name }}!

Your account as a **Central Admin** has been approved.

You now have access to the central administration dashboard.

@component('mail::button', ['url' => $reset_link])
Set Your Password
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent
