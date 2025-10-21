<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class MiddlewareCheckTest extends TestCase
{
    public function test_checkrole_middleware_alias_registered()
    {
        // Find an admin route and assert it has middleware referencing 'checkrole'
        $found = false;
        $adminRouteFound = false;

        foreach (Route::getRoutes() as $route) {
            $uri = $route->uri();
            if (str_starts_with($uri, 'api/admin')) {
                $adminRouteFound = true;
                $middlewares = $route->gatherMiddleware();
                foreach ($middlewares as $m) {
                    if (str_contains($m, 'checkrole')) {
                        $found = true;
                        break 2;
                    }
                }
            }
        }

        $this->assertTrue($adminRouteFound, "No admin routes found to check.");
        $this->assertTrue($found, "No admin route uses the 'checkrole' middleware alias.");
    }
}
