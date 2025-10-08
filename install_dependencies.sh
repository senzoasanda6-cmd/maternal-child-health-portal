#!/bin/bash

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check for Composer
if command_exists composer; then
    echo "Composer is installed. Installing PHP dependencies..."
    composer install
else
    echo "Composer is not installed. Please install Composer and add it to your PATH."
    echo "Installation instructions: https://getcomposer.org/download/"
fi

# Check for Node.js
if command_exists node; then
    echo "Node.js is installed. Installing Node.js dependencies..."
    cd maternal-child-health-frontend && npm install
else
    echo "Node.js is not installed. Please install Node.js and add it to your PATH."
    echo "Installation instructions: https://nodejs.org/"
fi

echo "Dependency installation script finished."
