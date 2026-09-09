# Deploying Combridge Polytechnic System to Railway

This guide will help you deploy the Combridge School Management System to Railway.

## Prerequisites

1. A Railway account (sign up at https://railway.app)
2. Your GitHub repository: https://github.com/dmbpolly-a11y/combridge-polytechnic

## Deployment Steps

### Step 1: Set Up Railway Project

1. Go to [Railway](https://railway.app) and sign in
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize Railway to access your GitHub account
5. Select the repository: `dmbpolly-a11y/combridge-polytechnic`

### Step 2: Add MySQL Database

1. In your Railway project, click **"+ New"**
2. Select **"Database"**
3. Choose **"Add MySQL"**
4. Railway will automatically provision a MySQL database

### Step 3: Configure Environment Variables

After adding MySQL, Railway will provide database credentials. Click on your Laravel service and add these environment variables:

#### Required Variables:

```env
APP_NAME="Combridge School Management System"
APP_ENV=production
APP_KEY=base64:hE3BMwpHZmltFP2rkssDa8BVf8foyrd+5U7nJWwdQho=
APP_DEBUG=false
APP_URL=https://your-app-url.railway.app

LOG_CHANNEL=stack
LOG_LEVEL=error

# Database - Use Railway MySQL variables
DB_CONNECTION=mysql
DB_HOST=${{MySQL.MYSQL_HOST}}
DB_PORT=${{MySQL.MYSQL_PORT}}
DB_DATABASE=${{MySQL.MYSQL_DATABASE}}
DB_USERNAME=${{MySQL.MYSQL_USER}}
DB_PASSWORD=${{MySQL.MYSQL_PASSWORD}}

SESSION_DRIVER=file
SESSION_LIFETIME=120
CACHE_DRIVER=file
QUEUE_CONNECTION=sync

# Mail Configuration (optional - configure with your SMTP)
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@combridge.edu"
MAIL_FROM_NAME="Combridge School Management System"

# School Information
SCHOOL_NAME="Combridge Centre for Polytechnic Studies"
SCHOOL_EMAIL="combridgecentre@gmail.com"
SCHOOL_PHONE="+256 393 258 879"
SCHOOL_WHATSAPP="+256 787 803 099"
SCHOOL_ADDRESS="Nyamityobora, Kaboba Mbarara City, 200 meters off Mbarara Masaka Highway"
SCHOOL_PO_BOX="P.O. Box 177267, Mbarara"
```

#### Important Notes:

- **APP_KEY**: If you need a new one, generate it locally with `php artisan key:generate --show`
- **APP_URL**: Update this after deployment with your actual Railway URL
- **Database Variables**: Railway automatically provides these through reference variables like `${{MySQL.MYSQL_HOST}}`

### Step 4: Deploy

1. Railway will automatically deploy your application
2. Monitor the deployment logs in the Railway dashboard
3. Once deployed, Railway will provide you with a public URL

### Step 5: Generate APP_KEY (if needed)

If you need to generate a new APP_KEY:

```bash
php artisan key:generate --show
```

Copy the generated key and add it to Railway environment variables with the `base64:` prefix.

### Step 6: Run Migrations

After successful deployment, you may need to run migrations. In Railway:

1. Click on your service
2. Go to **"Settings"** → **"Deploy"**
3. The migrations should run automatically via the Procfile, but if not, you can run:

```bash
php artisan migrate --force
```

### Step 7: Update APP_URL

1. Copy your Railway deployment URL (e.g., `https://your-app.railway.app`)
2. Update the `APP_URL` environment variable in Railway
3. Redeploy if necessary

## Troubleshooting

### If deployment fails:

1. Check the deployment logs in Railway dashboard
2. Verify all environment variables are set correctly
3. Ensure database connection variables are properly referenced
4. Check that composer dependencies install correctly

### Common Issues:

- **500 Error**: Check APP_KEY is set and APP_DEBUG is true temporarily to see errors
- **Database Connection Error**: Verify MySQL service is running and credentials are correct
- **Storage Permissions**: Railway handles this automatically, but ensure storage and bootstrap/cache are writable

## Alternative: Using Railway CLI

You can also deploy using Railway CLI:

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Link to existing project or create new
railway link

# Add environment variables
railway variables set APP_KEY=your-key-here

# Deploy
railway up
```

## Post-Deployment

1. Access your application at the Railway-provided URL
2. Create admin user if needed
3. Configure any additional settings
4. Test all features

## Support

For Railway-specific issues, check:
- [Railway Documentation](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)

For application issues:
- GitHub Repository: https://github.com/dmbpolly-a11y/combridge-polytechnic
