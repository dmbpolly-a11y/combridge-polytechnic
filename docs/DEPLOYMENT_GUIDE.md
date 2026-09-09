# Deployment Guide
## Combridge Centre for Polytechnic Studies Management System

This guide provides step-by-step instructions for deploying the Combridge Polytechnic Management System to production.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Server Requirements](#server-requirements)
3. [Installation Steps](#installation-steps)
4. [Configuration](#configuration)
5. [Database Setup](#database-setup)
6. [Post-Deployment](#post-deployment)
7. [Security Checklist](#security-checklist)
8. [Troubleshooting](#troubleshooting)
9. [Maintenance](#maintenance)

---

## Prerequisites

### Required Software
- PHP 8.1 or higher
- Composer 2.x
- MySQL 8.0 or MariaDB 10.3+
- Node.js 16.x or higher (for asset compilation)
- NPM or Yarn
- Git
- Web server (Apache/Nginx)

### Optional but Recommended
- Redis (for caching and queues)
- Supervisor (for queue workers)
- SSL Certificate (Let's Encrypt)

---

## Server Requirements

### PHP Extensions
```bash
php -m | grep -E 'BCMath|Ctype|Fileinfo|JSON|Mbstring|OpenSSL|PDO|Tokenizer|XML|cURL|GD|MySQL'
```

Required extensions:
- BCMath
- Ctype
- Fileinfo
- JSON
- Mbstring
- OpenSSL
- PDO
- Tokenizer
- XML
- cURL
- GD or Imagick
- MySQL/MySQLi

### Server Specifications

**Minimum**:
- 2 CPU cores
- 2 GB RAM
- 20 GB storage
- 10 Mbps network

**Recommended**:
- 4 CPU cores
- 4 GB RAM
- 50 GB SSD storage
- 100 Mbps network

---

## Installation Steps

### Step 1: Clone Repository

```bash
# Navigate to web directory
cd /var/www

# Clone the repository
git clone <repository-url> combridge-polytechnic

# Navigate to project directory
cd combridge-polytechnic

# Set correct permissions
sudo chown -R www-data:www-data /var/www/combridge-polytechnic
sudo chmod -R 755 /var/www/combridge-polytechnic
sudo chmod -R 775 /var/www/combridge-polytechnic/storage
sudo chmod -R 775 /var/www/combridge-polytechnic/bootstrap/cache
```

### Step 2: Install Dependencies

```bash
# Install PHP dependencies
composer install --optimize-autoloader --no-dev

# Install Node dependencies
npm install

# Compile assets
npm run production
```

### Step 3: Environment Configuration

```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Edit environment file
nano .env
```

---

## Configuration

### Database Configuration

Edit `.env` file:

```env
APP_NAME="Combridge Polytechnic System"
APP_ENV=production
APP_KEY=base64:... # Generated automatically
APP_DEBUG=false
APP_URL=https://yourdomain.com

LOG_CHANNEL=stack
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=combridge_polytechnic
DB_USERNAME=your_database_user
DB_PASSWORD=your_secure_password

BROADCAST_DRIVER=log
CACHE_DRIVER=redis
FILESYSTEM_DISK=local
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis
SESSION_LIFETIME=120

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=combridgecentre@gmail.com
MAIL_PASSWORD=your_email_app_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=combridgecentre@gmail.com
MAIL_FROM_NAME="${APP_NAME}"
```

### Cache Configuration

```bash
# Cache configuration
php artisan config:cache

# Cache routes
php artisan route:cache

# Cache views
php artisan view:cache

# Optimize autoloader
composer dump-autoload --optimize
```

### Web Server Configuration

#### Apache Configuration

Create `/etc/apache2/sites-available/combridge.conf`:

```apache
<VirtualHost *:80>
    ServerName yourdomain.com
    ServerAlias www.yourdomain.com
    ServerAdmin combridgecentre@gmail.com
    DocumentRoot /var/www/combridge-polytechnic/public

    <Directory /var/www/combridge-polytechnic/public>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/combridge-error.log
    CustomLog ${APACHE_LOG_DIR}/combridge-access.log combined

    # Redirect to HTTPS
    RewriteEngine on
    RewriteCond %{SERVER_NAME} =yourdomain.com [OR]
    RewriteCond %{SERVER_NAME} =www.yourdomain.com
    RewriteRule ^ https://%{SERVER_NAME}%{REQUEST_URI} [END,NE,R=permanent]
</VirtualHost>
```

Enable site:
```bash
sudo a2ensite combridge.conf
sudo a2enmod rewrite
sudo systemctl reload apache2
```

#### Nginx Configuration

Create `/etc/nginx/sites-available/combridge`:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/combridge-polytechnic/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/combridge /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-apache  # For Apache
# OR
sudo apt install certbot python3-certbot-nginx   # For Nginx

# Obtain certificate
sudo certbot --apache -d yourdomain.com -d www.yourdomain.com  # Apache
# OR
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com   # Nginx

# Test auto-renewal
sudo certbot renew --dry-run
```

---

## Database Setup

### Step 1: Create Database

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE combridge_polytechnic CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Create user
CREATE USER 'combridge_user'@'localhost' IDENTIFIED BY 'secure_password_here';

# Grant privileges
GRANT ALL PRIVILEGES ON combridge_polytechnic.* TO 'combridge_user'@'localhost';

# Flush privileges
FLUSH PRIVILEGES;

# Exit MySQL
EXIT;
```

### Step 2: Run Migrations

```bash
# Run migrations
php artisan migrate --force

# ⚠️ IMPORTANT: Verify all tables created
php artisan tinker
> DB::select('SHOW TABLES');
```

### Step 3: Seed Database (Initial Setup Only)

```bash
# Seed with sample data (DEVELOPMENT/TESTING ONLY)
php artisan db:seed

# OR seed specific data
php artisan db:seed --class=RoleSeeder
php artisan db:seed --class=PermissionSeeder
php artisan db:seed --class=UserSeeder
```

**⚠️ WARNING**: Do NOT run full seeding on production! Only seed roles, permissions, and create your own admin account.

### Step 4: Create Production Admin

```bash
php artisan tinker
```

```php
// Create admin user
$user = \App\Models\User::create([
    'first_name' => 'Admin',
    'last_name' => 'User',
    'email' => 'admin@combridgecentre.ac.ug',
    'password' => \Hash::make('YourSecurePassword123!'),
    'phone' => '+256393258879',
    'status' => 'active',
    'email_verified_at' => now(),
]);

// Assign administrator role
$role = \App\Models\Role::where('name', 'administrator')->first();
$user->roles()->attach($role->id);

echo "Admin created successfully!";
exit;
```

---

## Post-Deployment

### Step 1: Queue Workers

Create Supervisor configuration `/etc/supervisor/conf.d/combridge-worker.conf`:

```ini
[program:combridge-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/combridge-polytechnic/artisan queue:work redis --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/combridge-polytechnic/storage/logs/worker.log
stopwaitsecs=3600
```

Start workers:
```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start combridge-worker:*
```

### Step 2: Cron Jobs

Add to crontab:
```bash
sudo crontab -e -u www-data
```

Add line:
```bash
* * * * * cd /var/www/combridge-polytechnic && php artisan schedule:run >> /dev/null 2>&1
```

### Step 3: File Permissions

```bash
sudo chown -R www-data:www-data /var/www/combridge-polytechnic
sudo chmod -R 755 /var/www/combridge-polytechnic
sudo chmod -R 775 /var/www/combridge-polytechnic/storage
sudo chmod -R 775 /var/www/combridge-polytechnic/bootstrap/cache
```

### Step 4: Storage Link

```bash
php artisan storage:link
```

### Step 5: Test Installation

Visit your domain:
```
https://yourdomain.com
```

Try logging in:
```
Email: admin@combridgecentre.ac.ug
Password: YourSecurePassword123!
```

---

## Security Checklist

### Essential Security Steps

- [ ] **APP_DEBUG=false** in production
- [ ] **Strong APP_KEY** generated
- [ ] **Secure database password** (20+ characters, mixed)
- [ ] **SSL certificate** installed and working
- [ ] **File permissions** correctly set (755/775)
- [ ] **.env file** protected (chmod 600)
- [ ] **Git folder** not accessible via web
- [ ] **Default passwords changed** for all accounts
- [ ] **Firewall configured** (UFW/iptables)
- [ ] **Fail2ban installed** for SSH protection
- [ ] **Regular backups** configured
- [ ] **Error logging** enabled (not displayed)
- [ ] **CSRF protection** enabled
- [ ] **Rate limiting** configured
- [ ] **Session timeout** set appropriately

### Additional Hardening

```bash
# Disable directory listing
# Add to .htaccess (Apache) or server config
Options -Indexes

# Protect .env file
<Files .env>
    Order allow,deny
    Deny from all
</Files>

# Hide PHP version
expose_php = Off  # In php.ini

# Configure firewall (UFW)
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable
```

### Change Default Credentials

**IMMEDIATELY after deployment:**

1. Change admin password
2. Update all default email addresses
3. Configure unique bursar/librarian accounts
4. Remove or disable any test accounts

---

## Troubleshooting

### Common Issues

#### 1. 500 Internal Server Error

**Check**:
```bash
# Laravel logs
tail -f storage/logs/laravel.log

# Web server logs
tail -f /var/log/apache2/error.log  # Apache
tail -f /var/log/nginx/error.log    # Nginx
```

**Common causes**:
- Wrong file permissions
- Missing .env file
- Database connection failed
- Missing PHP extensions

#### 2. Database Connection Failed

**Check**:
```bash
# Test database connection
php artisan tinker
> DB::connection()->getPdo();
```

**Verify**:
- Database exists
- User has privileges
- Credentials in .env are correct
- MySQL service is running

#### 3. Permission Denied Errors

```bash
# Fix permissions
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

#### 4. Assets Not Loading

```bash
# Rebuild assets
npm run production

# Clear cache
php artisan cache:clear
php artisan view:clear
php artisan config:clear
```

#### 5. Queue Jobs Not Running

```bash
# Check supervisor status
sudo supervisorctl status

# Restart workers
sudo supervisorctl restart combridge-worker:*

# Check logs
tail -f storage/logs/worker.log
```

### Debug Mode (Temporary)

**Only enable for troubleshooting, disable immediately after!**

```env
APP_DEBUG=true
LOG_LEVEL=debug
```

---

## Maintenance

### Regular Tasks

#### Daily
- Monitor error logs
- Check system resources
- Verify backups completed

#### Weekly
- Review user activity
- Check disk space
- Update dependencies (if needed)

#### Monthly
- Security updates
- Performance optimization
- Database optimization

### Backup Strategy

#### Database Backup

Create backup script `/root/backup-combridge.sh`:

```bash
#!/bin/bash

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/combridge"
DB_NAME="combridge_polytechnic"
DB_USER="combridge_user"
DB_PASS="secure_password_here"

# Create backup directory
mkdir -p $BACKUP_DIR

# Database backup
mysqldump -u$DB_USER -p$DB_PASS $DB_NAME | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Files backup
tar -czf $BACKUP_DIR/files_$DATE.tar.gz /var/www/combridge-polytechnic/storage

# Keep only last 7 days
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Backup completed: $DATE"
```

Make executable and schedule:
```bash
chmod +x /root/backup-combridge.sh

# Add to crontab
crontab -e
0 2 * * * /root/backup-combridge.sh >> /var/log/combridge-backup.log 2>&1
```

### Update Procedure

```bash
# 1. Backup first!
/root/backup-combridge.sh

# 2. Enable maintenance mode
php artisan down

# 3. Pull latest code
git pull origin main

# 4. Update dependencies
composer install --no-dev --optimize-autoloader
npm install && npm run production

# 5. Run migrations
php artisan migrate --force

# 6. Clear caches
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 7. Restart queue workers
sudo supervisorctl restart combridge-worker:*

# 8. Disable maintenance mode
php artisan up
```

### Performance Optimization

```bash
# Enable OPcache (php.ini)
opcache.enable=1
opcache.memory_consumption=128
opcache.max_accelerated_files=10000
opcache.revalidate_freq=2

# Enable Redis caching
CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

# Optimize autoloader
composer dump-autoload --optimize --classmap-authoritative

# Cache everything
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## Monitoring

### Server Monitoring

- CPU usage: `htop` or `top`
- Disk space: `df -h`
- Memory: `free -m`
- MySQL: `mysqladmin -u root -p status`

### Application Monitoring

```bash
# Queue status
php artisan queue:monitor

# Failed jobs
php artisan queue:failed

# Logs
tail -f storage/logs/laravel.log
```

### External Monitoring (Recommended)

- **Uptime monitoring**: UptimeRobot, Pingdom
- **Performance**: New Relic, Datadog
- **Error tracking**: Sentry, Bugsnag

---

## Support & Resources

### Documentation
- Laravel: https://laravel.com/docs
- MySQL: https://dev.mysql.com/doc/
- Deployment: This guide

### Contact
- Email: combridgecentre@gmail.com
- Phone: +256 393 258 879, +256 414 674 018
- Location: Isingiro District, Uganda

### Emergency Contacts

**System Administrator**: [Your contact]  
**Database Administrator**: [Your contact]  
**Hosting Provider**: [Provider contact]

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
