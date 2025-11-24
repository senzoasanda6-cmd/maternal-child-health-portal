@echo off
REM Setup script for Maternal Child Health Portal on Windows

echo ==========================================
echo Maternal Child Health Portal - Setup
echo ==========================================
echo.

REM Step 1: Check if .env file exists
if not exist .env (
    echo Copying .env.example to .env...
    copy .env.example .env
    php artisan key:generate
    echo [OK] .env file created with APP_KEY generated
) else (
    echo [OK] .env file already exists
)

echo.
echo Step 1/4: Installing PHP dependencies...
call composer install
if %errorlevel% neq 0 (
    echo [ERROR] Composer install failed
    exit /b 1
)
echo [OK] PHP dependencies installed

echo.
echo Step 2/4: Running database migrations...
call php artisan migrate --force
if %errorlevel% neq 0 (
    echo [ERROR] Migrations failed
    exit /b 1
)
echo [OK] Database migrations completed

echo.
echo Step 3/4: Seeding database with sample data...
call php artisan db:seed
if %errorlevel% neq 0 (
    echo [ERROR] Database seeding failed
    exit /b 1
)
echo [OK] Database seeded with sample data

echo.
echo Step 4/4: Installing Node dependencies...
cd mch-frontend
call npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo [ERROR] NPM install failed
    exit /b 1
)
echo [OK] Node dependencies installed

echo.
echo ==========================================
echo Setup completed successfully!
echo ==========================================
echo.
echo To start development:
echo 1. Start Laravel backend: php artisan serve
echo 2. Start React frontend: cd mch-frontend ^&^& npm start
echo.
pause
