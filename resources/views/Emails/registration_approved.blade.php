<!DOCTYPE html>
<html>

<head>
    <title>Registration Approved</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f9fafb;
            color: #333;
            padding: 20px;
        }

        .email-container {
            max-width: 600px;
            margin: auto;
            background-color: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 30px;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
        }

        .header img {
            max-height: 60px;
        }

        .footer {
            margin-top: 40px;
            font-size: 12px;
            color: #6b7280;
            text-align: center;
        }

        .social-icons {
            margin-top: 10px;
        }

        .social-icons a {
            margin: 0 8px;
            text-decoration: none;
            display: inline-block;
        }

        .social-icons img {
            height: 24px;
            width: 24px;
            vertical-align: middle;
        }

        .button {
            display: inline-block;
            padding: 12px 20px;
            background-color: #2563eb;
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
            margin-top: 20px;
        }
    </style>
</head>

<body>
    <div class="email-container">
        <div class="header">
            <img src="https://yourdomain.com/logo.png" alt="Maternal & Child Health Portal Logo">
            <h2>Maternal & Child Health Portal</h2>
        </div>

        <p>Dear {{ $name }},</p>

        <p>Your registration as a <strong>{{ $role }}</strong> has been approved.</p>

        @if(!empty($message))
        <p>{{ $message }}</p>
        @endif

        @if(!empty($location))
        <p>Assigned Location: <strong>{{ $location }}</strong></p>
        @endif

        <p>To set your password and access your account, click the button below:</p>
        <p><a href="{{ $reset_link }}" class="button">Set Your Password</a></p>

        <p>Thank you for joining the Maternal & Child Health Portal.</p>

        <div class="footer">
            &copy; {{ date('Y') }} Maternal & Child Health Portal. All rights reserved.

            <div class="social-icons">
                <a href="https://facebook.com/yourpage" target="_blank">
                    <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook">
                </a>
                <a href="https://twitter.com/yourhandle" target="_blank">
                    <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter">
                </a>
                <a href="https://instagram.com/yourprofile" target="_blank">
                    <img src="https://cdn-icons-png.flaticon.com/512/733/733558.png" alt="Instagram">
                </a>
                <a href="https://linkedin.com/company/yourcompany" target="_blank">
                    <img src="https://cdn-icons-png.flaticon.com/512/733/733561.png" alt="LinkedIn">
                </a>
            </div>
        </div>
    </div>
</body>

</html>