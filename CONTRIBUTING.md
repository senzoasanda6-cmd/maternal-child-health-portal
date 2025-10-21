# Contributing notes

When you add or change middleware aliases in `app/Http/Kernel.php`, or modify middleware classes, Laravel's cached files may need to be cleared and rebuilt so the application recognizes the changes. If the app starts returning errors like "Target class [checkrole] does not exist.", it's often caused by stale cached routes/config.

Local quick fix:

```bash
php artisan optimize:clear
```

In production or when using route/config caching as part of deployment, ensure you run these steps during deploy after changes are made:

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

If you rely on route caching in production, remember to rebuild the caches after kernel/middleware changes.
