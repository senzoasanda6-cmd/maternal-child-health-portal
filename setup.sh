#!/bin/bash

# Setup script for Maternal Child Health Portal

echo "=========================================="
echo "Maternal Child Health Portal - Setup"
echo "=========================================="
echo ""

# Step 1: Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Copying from .env.example..."
    cp .env.example .env
    # Generate APP_KEY
    php artisan key:generate
    echo "✅ .env file created with APP_KEY generated"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "Step 1/4: Installing PHP dependencies..."
composer install
echo "✅ PHP dependencies installed"

echo ""
echo "Step 2/4: Running database migrations..."
php artisan migrate --force
echo "✅ Database migrations completed"

echo ""
echo "Step 3/4: Seeding database with sample data..."
php artisan db:seed
echo "✅ Database seeded with sample data"

echo ""
echo "Step 4/4: Installing Node dependencies..."
cd mch-frontend
npm install --legacy-peer-deps
echo "✅ Node dependencies installed"

echo ""
echo "=========================================="
echo "Setup completed successfully!"
echo "=========================================="
echo ""
echo "To start development:"
echo "1. Start Laravel backend: php artisan serve"
echo "2. Start React frontend: cd mch-frontend && npm start"
echo ""
