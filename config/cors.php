<?php

return [

    'paths' => ['api/*', 'login', 'logout', 'register', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    // Add any frontend dev origins here. Do NOT use ['*'] when
    // 'supports_credentials' is true — list explicit origins instead.
    'allowed_origins' => [
        'http://localhost:3000',
        'http://10.147.249.115:3000',
        'http://localhost:3004',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
