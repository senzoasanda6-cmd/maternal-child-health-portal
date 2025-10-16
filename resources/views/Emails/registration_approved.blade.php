<!DOCTYPE html>
<html>

<head>
    <title>Registration Approved</title>
</head>

<body>
    <h2>Dear {{ $userData['name'] }},</h2>
    <p>Your registration as a <strong>{{ $userData['role'] }}</strong> at <strong>{{ $userData['hospital'] }}</strong> has been approved.</p>
    <p>To set your password and access your account, click the link below:</p>
    <p><a href="{{ $userData['reset_link'] }}">Set Your Password</a></p>
    <p>Thank you for joining the Maternal & Child Health Portal.</p>

</body>

</html>