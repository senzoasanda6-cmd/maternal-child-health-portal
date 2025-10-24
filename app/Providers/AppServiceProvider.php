<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\Appointment;
use App\Models\RegistrationRequest;
use App\Policies\AppointmentPolicy;
use App\Policies\RegistrationRequestPolicy;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(Appointment::class, AppointmentPolicy::class);
        Gate::policy(RegistrationRequest::class, RegistrationRequestPolicy::class);
        // Ensure the router has the 'checkrole' middleware alias registered.
        // This avoids a "Target class [checkrole] does not exist" error when
        // the router's alias map hasn't been populated from the kernel for
        // some runtime configurations.
        if ($this->app->bound('router')) {
            $this->app->router->aliasMiddleware('checkrole', \App\Http\Middleware\RoleMiddleware::class);
        }
    }
}
