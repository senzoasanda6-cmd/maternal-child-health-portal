#!/usr/bin/env bash
# Centralized script to clear/rebuild Laravel caches and run tests.
# Usage: ./rebuild_and_test.sh [--rebuild-caches] [--no-tests]

REBUILD_CACHES=false
RUN_TESTS=true

while [[ "$#" -gt 0 ]]; do
  case "$1" in
    --rebuild-caches) REBUILD_CACHES=true; shift;;
    --no-tests) RUN_TESTS=false; shift;;
    *) echo "Unknown option: $1"; exit 1;;
  esac
done

set -euo pipefail

echo "==> Running composer dump-autoload (optimized)"
composer dump-autoload -o

echo "==> Clearing Laravel caches (optimize:clear)"
php artisan optimize:clear || true

if [ "$REBUILD_CACHES" = true ]; then
  echo "==> Rebuilding route and config cache"
  php artisan route:cache || true
  php artisan config:cache || true
fi

if [ "$RUN_TESTS" = true ]; then
  echo "==> Running PHPUnit tests (artisan test)"
  php artisan test --stop-on-failure
  echo "==> Tests completed"
fi

echo "==> Done."