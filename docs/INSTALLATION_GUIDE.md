# Combridge School Management System - Installation Guide

## Prerequisites

Before installing the Combridge School Management System, ensure you have the following installed on your system:

### Required Software
1. **PHP >= 8.1** with the following extensions:
   - OpenSSL
   - PDO
   - Mbstring
   - Tokenizer
   - XML
   - Ctype
   - JSON
   - BCMath

2. **Composer** - PHP dependency manager
   - Download from: https://getcomposer.org/

3. **MySQL >= 5.7** or **MariaDB >= 10.3**
   - Or any other Laravel-supported database

4. **Node.js >= 16.x** and **NPM**
   - Download from: https://nodejs.org/

5. **Git** (optional, for version control)

## Installation Steps

### Step 1: Install Composer Dependencies

Open your terminal/command prompt in the project directory and run:

```bash
composer install
```

This will install all PHP dependencies including Laravel framework.

### Step 2: Configure Environment

1. Copy the example environment file:
```bash
cp .env.example .env
```

On Windows PowerShell:
```powershell
Copy-Item .env.example .env
```

2. Open the `.env` file and configure your database settings:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=combridge_sms
DB_USERNAME=root
DB_PASSWORD=your_password_here
```

3. Update other settings as needed (mail, app URL, etc.)

### Step 3: Generate Application Key

```bash
php artisan key:generate
```

This creates a unique encryption key for your application.

### Step 4: Create Database

Create a new MySQL database named `combridge_sms` (or whatever you specified in .env):

```sql
CREATE DATABASE combridge_sms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Step 5: Run Migrations

Execute the database migrations to create all tables:

```bash
php artisan migrate
```

### Step 6: Seed Database

Populate the database with initial data (roles, permissions, default users, grading system):

```bash
php artisan db:seed
```

### Step 7: Create Storage Link

Create a symbolic link for file storage:

```bash
php artisan storage:link
```

### Step 8: Install Node Dependencies

Install JavaScript dependencies:

```bash
npm install
```

### Step 9: Build Assets

Compile CSS and JavaScript assets:

For development:
```bash
npm run dev
```

For production:
```bash
npm run build
```

### Step 10: Start Development Server

Start the Laravel development server:

```bash
php artisan serve
```

The application will be available at: **http://localhost:8000**

## Default Login Credentials

After seeding, you can log in with these accounts:

| Role | Email | Password |
|------|-------|----------|
| Administrator | admin@combridge.edu | admin123 |
| Director | director@combridge.edu | director123 |
| Dean | dean@combridge.edu | dean123 |
| Bursar | bursar@combridge.edu | bursar123 |
| Librarian | librarian@combridge.edu | librarian123 |

**⚠️ Important: Change these passwords immediately after first login!**

## File Permissions

Ensure the following directories are writable:

```bash
chmod -R 775 storage
chmod -R 775 bootstrap/cache
```

On Windows, you may need to adjust folder permissions through File Explorer.

## Production Deployment

For production deployment:

1. Set `APP_ENV=production` in `.env`
2. Set `APP_DEBUG=false` in `.env`
3. Run `php artisan config:cache`
4. Run `php artisan route:cache`
5. Run `php artisan view:cache`
6. Use a production web server (Apache/Nginx)
7. Enable HTTPS/SSL
8. Set up proper backups
9. Configure queue workers if using queues
10. Set up task scheduler for automated jobs

## Troubleshooting

### Common Issues

**Issue: "Class not found" errors**
- Solution: Run `composer dump-autoload`

**Issue: Permission denied errors**
- Solution: Check file permissions on storage and bootstrap/cache

**Issue: 500 Internal Server Error**
- Solution: Check `storage/logs/laravel.log` for details
- Ensure `.env` file exists and is configured correctly
- Run `php artisan config:clear`

**Issue: Database connection errors**
- Solution: Verify database credentials in `.env`
- Ensure MySQL service is running
- Test connection: `php artisan tinker` then `DB::connection()->getPdo();`

**Issue: Assets not loading**
- Solution: Run `npm run build` again
- Clear browser cache
- Check public directory permissions

## Optional Features

### Email Configuration

To enable email notifications, configure these in `.env`:

```
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@combridge.edu
MAIL_FROM_NAME="${APP_NAME}"
```

### Queue Configuration

For better performance, configure queues:

```
QUEUE_CONNECTION=database
```

Then run:
```bash
php artisan queue:table
php artisan migrate
php artisan queue:work
```

## Support

For technical support or issues:
- Email: combridgecentre@gmail.com
- Phone: +256 393 258 879
- WhatsApp: +256 787 803 099

## Security

- Change all default passwords immediately
- Keep Laravel and dependencies updated
- Use HTTPS in production
- Regular database backups
- Enable Laravel's built-in security features
- Implement rate limiting on login attempts
- Use strong passwords and 2FA where possible

---

**Combridge Centre for Polytechnic Studies**
*Enriching The Future and Potentials*
