<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';

// Boot the application so we can use Eloquent
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;

$email = 'district_admin@example.com';
$user = User::where('email', $email)->first();

if (!$user) {
    echo "User not found: $email\n";
    exit(1);
}

if (!method_exists($user, 'createToken')) {
    echo "User model does not support createToken()\n";
    exit(1);
}

$token = $user->createToken('cli-token')->plainTextToken;
echo $token . PHP_EOL;
