@component('mail::message')
# Hello, {{ $name }}!

Your registration as a **District Admin** has been approved.

You are responsible for managing district-level operations in **{{ $location }}**.

@component('mail::button', ['url' => $reset_link])
Set Your Password
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent
