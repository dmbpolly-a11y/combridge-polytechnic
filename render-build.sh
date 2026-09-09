#!/usr/bin/env bash
# Render build script for Laravel

set -o errexit

echo "Installing Composer dependencies..."
composer install --optimize-autoloader --no-dev --no-interaction

echo "Clearing caches..."
php artisan config:clear
php artisan cache:clear
php artisan view:clear

echo "Setting up storage directories..."
mkdir -p storage/framework/{sessions,views,cache}
mkdir -p storage/logs
mkdir -p bootstrap/cache

echo "Setting permissions..."
chmod -R 775 storage bootstrap/cache

echo "Build completed successfully!"
