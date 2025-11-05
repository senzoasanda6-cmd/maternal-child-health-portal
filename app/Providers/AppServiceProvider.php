<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\Appointment;
use App\Models\RegistrationRequest;
use App\Policies\AppointmentPolicy;
use App\Policies\RegistrationRequestPolicy;
use App\Models\Facility;
use App\Policies\FacilityPolicy;
use Illuminate\Support\Facades\Route;


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
        Gate::policy(Facility::class, FacilityPolicy::class);

        // Ensure the router has the 'checkrole' middleware alias registered.
        // This avoids a "Target class [checkrole] does not exist" error when
        // the router's alias map hasn't been populated from the kernel for
        // some runtime configurations.
        Route::aliasMiddleware('checkrole', \App\Http\Middleware\RoleMiddleware::class);
    }
}
