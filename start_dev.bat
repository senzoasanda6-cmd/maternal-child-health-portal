@echo off
echo "Starting Laravel server..."
start "Laravel" php artisan serve

echo "Starting React frontend..."
cd mch-frontend
start "Frontend" npm start