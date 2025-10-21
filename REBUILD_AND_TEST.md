Rebuild and Test Script

Two helper scripts are provided at the repo root to clear/rebuild Laravel caches and run the test suite:

- `rebuild_and_test.ps1` — PowerShell script (Windows). Usage:
  - `./rebuild_and_test.ps1` (default: clear caches and run tests)
  - `./rebuild_and_test.ps1 -RebuildCaches` (also run `route:cache` and `config:cache`)
  - `./rebuild_and_test.ps1 -RunTests:$false` (skip running tests)

- `rebuild_and_test.sh` — Bash script (Unix/macOS). Usage:
  - `./rebuild_and_test.sh` (default: clear caches and run tests)
  - `./rebuild_and_test.sh --rebuild-caches` (also run `route:cache` and `config:cache`)
  - `./rebuild_and_test.sh --no-tests` (skip running tests)

Notes:
- If your application runs in a persistent process (php artisan serve, Octane, Swoole, Docker containers, or Windows IIS), restart the process after running these scripts so changes take effect.
- The scripts run `composer dump-autoload -o` and `php artisan optimize:clear` before tests.
- The scripts will exit with a non-zero code if composer or the test command fails.
