<#
Centralized script to clear/rebuild Laravel caches and run tests.
Usage (PowerShell):
  ./rebuild_and_test.ps1 [-RebuildCaches] [-RunTests]

By default it will: composer dump-autoload, php artisan optimize:clear, then run php artisan test.
Pass -RebuildCaches to also run route:cache and config:cache after clearing.
#>
param(
    [switch]$RebuildCaches = $false,
    [switch]$RunTests = $true
)

Write-Host "==> Running composer dump-autoload (optimized)" -ForegroundColor Cyan
composer dump-autoload -o
if ($LASTEXITCODE -ne 0) {
    Write-Error "composer dump-autoload failed (exit $LASTEXITCODE). Aborting."
    exit $LASTEXITCODE
}

Write-Host "==> Clearing Laravel caches (optimize:clear)" -ForegroundColor Cyan
php artisan optimize:clear
if ($LASTEXITCODE -ne 0) {
    Write-Error "php artisan optimize:clear failed (exit $LASTEXITCODE). Aborting."
    exit $LASTEXITCODE
}

if ($RebuildCaches) {
    Write-Host "==> Rebuilding route and config cache" -ForegroundColor Cyan
    php artisan route:cache
    if ($LASTEXITCODE -ne 0) { Write-Warning "route:cache failed" }
    php artisan config:cache
    if ($LASTEXITCODE -ne 0) { Write-Warning "config:cache failed" }
}

if ($RunTests) {
    Write-Host "==> Running PHPUnit tests (artisan test)" -ForegroundColor Cyan
    php artisan test --stop-on-failure
    $testExit = $LASTEXITCODE
    if ($testExit -ne 0) {
        Write-Error "Tests failed (exit $testExit)."
        exit $testExit
    }
    Write-Host "==> Tests passed." -ForegroundColor Green
}

Write-Host "==> Done." -ForegroundColor Green
exit 0
