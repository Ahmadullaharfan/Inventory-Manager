FROM php:8.2-fpm-alpine

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    oniguruma-dev \
    libxml2-dev \
    zip \
    unzip

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy application files
COPY . .

# Install dependencies (non-blocking)
RUN composer install --no-interaction --optimize-autoloader 2>/dev/null || echo "Composer install skipped - use your own Laravel project"

EXPOSE 8000

# Simple PHP server if artisan doesn't exist
CMD if [ -f artisan ]; then php artisan serve --host=0.0.0.0 --port=8000; else php -S 0.0.0.0:8000 -t public 2>/dev/null || echo "Laravel app not found. Replace backend/ with your Laravel project."; fi
