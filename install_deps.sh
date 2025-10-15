#!/bin/bash

# Check for a -f flag to force installation
NPM_ARGS="--legacy-peer-deps"
if [[ " $@ " =~ " -f " ]]; then
    echo "Force flag (-f) detected. Using --force for npm install."
    NPM_ARGS="$NPM_ARGS --force"
fi

# Flags to control which installations to run
RUN_NPM=true
RUN_COMP=true

if [[ " $@ " =~ " -npm " ]]; then
    RUN_COMP=false
elif [[ " $@ " =~ " -comp " ]]; then
    RUN_NPM=false
fi

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check for Composer
if $RUN_COMP; then
    if command_exists composer; then
        echo "Composer is installed. Installing PHP dependencies..."
        composer install
    else
        echo "Composer is not installed. Please install Composer and add it to your PATH."
        echo "Installation instructions: https://getcomposer.org/download/"
    fi
fi

# Check for Node.js
if $RUN_NPM; then
    if command_exists node; then
        echo "Node.js is installed. Installing Node.js dependencies..."
        # Use a subshell to run commands in the frontend directory
        # This prevents the script's working directory from changing
        (cd mch-frontend && npm install $NPM_ARGS)
    else
        echo "Node.js is not installed. Please install Node.js and add it to your PATH."
        echo "Installation instructions: https://nodejs.org/"
    fi
fi

echo "Dependency installation script finished."
