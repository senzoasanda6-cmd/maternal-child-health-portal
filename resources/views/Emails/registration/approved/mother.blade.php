@component('mail::message')
# Welcome, {{ $name }}!

Your account has been approved. You can now track your child’s health journey and access maternal care resources.

@component('mail::button', ['url' => $reset_link])
Set Your Password
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent
