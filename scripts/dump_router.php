<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
$router = app('router');
$ref = new ReflectionClass($router);
$prop = $ref->getProperty('middleware');
$prop->setAccessible(true);
$middleware = $prop->getValue($router);
echo "router middleware aliases:\n";
var_export($middleware);

$propGroups = $ref->getProperty('middlewareGroups');
$propGroups->setAccessible(true);
$groups = $propGroups->getValue($router);
echo "\nrouter middleware groups:\n";
var_export($groups);
