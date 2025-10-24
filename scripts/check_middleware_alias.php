<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

// Boot the app (this will run service providers)
$request = Illuminate\Http\Request::capture();
$kernel->bootstrap();

$router = $app->make(Illuminate\Routing\Router::class);

echo "Router aliases:\n";
print_r($router->getMiddleware());

// Find a representative admin route
$routes = $router->getRoutes();
$found = null;
foreach ($routes as $route) {
    $uri = $route->uri();
    if (str_starts_with($uri, 'api/admin') || str_contains($uri, 'admin')) {
        $found = $route;
        break;
    }
}

if ($found) {
    echo "\nFound route: " . $found->uri() . "\n";
    echo "Raw middleware:\n";
    print_r($found->gatherMiddleware());
    echo "Resolved middleware (via router):\n";
    print_r($router->gatherRouteMiddleware($found));
} else {
    echo "No admin route found.\n";
}

echo "\nKernel middleware aliases:\n";
$kernelAppKernel = $app->make(App\Http\Kernel::class);
if (method_exists($kernelAppKernel, 'getMiddlewareAliases')) {
    print_r($kernelAppKernel->getMiddlewareAliases());
} else {
    echo "getMiddlewareAliases not available on this kernel.\n";
}


