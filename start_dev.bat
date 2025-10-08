@echo off
echo "Starting Laravel server..."
start "Laravel" php artisan serve

echo "Starting React frontend..."
cd maternal-child-health-frontend
start "Frontend" npm start