<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();
use Illuminate\Support\Facades\Route;
$routes = Route::getRoutes();
foreach ($routes as $r) {
    if ($r->uri() === 'api/admin/registration-requests') {
        echo "raw:" . PHP_EOL;
        var_export($r->gatherMiddleware());
        echo PHP_EOL . "resolved:" . PHP_EOL;
        var_export(app('router')->gatherRouteMiddleware($r));
        echo PHP_EOL;
    }
}
