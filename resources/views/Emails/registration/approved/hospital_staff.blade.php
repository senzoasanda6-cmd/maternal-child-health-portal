@component('mail::message')
# Welcome to the Hospital Team, {{ $name }}!

Your account has been approved for **{{ $location }}**.

You now have access to hospital-level tools and reporting.

@component('mail::button', ['url' => $reset_link])
Set Your Password
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent
