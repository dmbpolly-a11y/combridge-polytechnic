FROM php:8.2-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    default-mysql-client \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy composer files first
COPY composer.json composer.lock ./

# Install dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

# Copy application files
COPY . .

# Create required directories and set permissions
RUN mkdir -p storage/framework/{sessions,views,cache} \
    && mkdir -p storage/logs \
    && mkdir -p bootstrap/cache \
    && chmod -R 777 storage bootstrap/cache

# Create startup script
RUN echo '#!/bin/bash\n\
echo "Starting Combridge Polytechnic System..."\n\
\n\
# Clear and cache config\n\
php artisan config:clear\n\
php artisan config:cache\n\
\n\
# Clear and cache routes\n\
php artisan route:clear\n\
php artisan route:cache\n\
\n\
# Clear views\n\
php artisan view:clear\n\
\n\
# Run migrations\n\
echo "Running database migrations..."\n\
php artisan migrate --force || echo "Migration failed or already up to date"\n\
\n\
# Start server\n\
echo "Starting web server on port ${PORT:-8000}..."\n\
php artisan serve --host=0.0.0.0 --port=${PORT:-8000}\n\
' > /start.sh && chmod +x /start.sh

EXPOSE 8000

CMD ["/start.sh"]
