<!DOCTYPE html>
<html>

<head>
    <title>Registration Rejected</title>
</head>

<body>
    <h2>Dear {{ $userData['name'] }},</h2>

    <p>
        We regret to inform you that your registration request as a 
        <strong>{{ $userData['role'] }}</strong> has been rejected.
    </p>

    @if(!empty($userData['reason']))
        <p><strong>Reason for rejection:</strong> {{ $userData['reason'] }}</p>
    @endif

    <p>
        If you believe this was a mistake or would like to reapply, please contact our support team or your local facility.
    </p>

    <p>
        Thank you for your interest in the Maternal & Child Health Portal.
    </p>
</body>

</html>
