# 🚀 Deploy to InfinityFree (Your Current Host)

Since you already have InfinityFree hosting, let's deploy there!

## ✅ What You Have:
- **Host**: sql111.infinityfree.com
- **Database**: if0_42854964_polytechnic
- **Domain**: combrige-polytechnic.66ghz.com

---

## 📦 Step 1: Download Your Project

### Option A: Download ZIP from GitHub
1. Go to: https://github.com/dmbpolly-a11y/combridge-polytechnic
2. Click green **"Code"** button
3. Click **"Download ZIP"**
4. Extract the ZIP file

### Option B: Use Git (if installed)
```bash
git clone https://github.com/dmbpolly-a11y/combridge-polytechnic.git
```

---

## 📤 Step 2: Upload to InfinityFree

### Using File Manager:
1. Login to: https://app.infinityfree.com
2. Go to **Control Panel**
3. Click **"Online File Manager"** or **"File Manager"**
4. Navigate to **`htdocs`** folder
5. Upload ALL files from your project

### Using FTP (Recommended for large files):
1. Get FTP details from InfinityFree control panel
2. Use FileZilla or WinSCP
3. Connect to your FTP
4. Upload all files to **`htdocs`** folder

---

## 🔧 Step 3: Configure .htaccess

After upload, create/edit `.htaccess` in `htdocs` folder:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>
```

This points to the `public` folder.

---

## 🔑 Step 4: Update .env File

In the `htdocs` folder, create `.env` file with:

```env
APP_NAME="Combridge School Management System"
APP_ENV=production
APP_KEY=base64:hE3BMwpHZmltFP2rkssDa8BVf8foyrd+5U7nJWwdQho=
APP_DEBUG=false
APP_URL=http://combrige-polytechnic.66ghz.com

LOG_CHANNEL=stack
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=sql111.infinityfree.com
DB_PORT=3306
DB_DATABASE=if0_42854964_polytechnic
DB_USERNAME=if0_42854964
DB_PASSWORD=GVhCdPtrQj0Erv

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="noreply@combridge.edu"
MAIL_FROM_NAME="${APP_NAME}"

SCHOOL_NAME="Combridge Centre for Polytechnic Studies"
SCHOOL_EMAIL="combridgecentre@gmail.com"
SCHOOL_PHONE="+256 393 258 879"
SCHOOL_WHATSAPP="+256 787 803 099"
SCHOOL_ADDRESS="Nyamityobora, Kaboba Mbarara City, 200 meters off Mbarara Masaka Highway"
SCHOOL_PO_BOX="P.O. Box 177267, Mbarara"
```

---

## 🗂️ Step 5: Set Folder Permissions

Set these folders to **0755** or **0777** permissions:

- `storage/` (and all subfolders)
- `bootstrap/cache/`

In File Manager:
- Right-click folder → **Change Permissions** → Set to **777**

---

## 🗄️ Step 6: Run Migrations (Optional)

If your database is empty, you need to run migrations.

### Option A: Using PHP CLI (if available)
```bash
php artisan migrate --force
```

### Option B: Import SQL manually
1. Export your local database
2. Go to InfinityFree → **phpMyAdmin**
3. Select database: `if0_42854964_polytechnic`
4. Import your SQL file

---

## 🌐 Step 7: Access Your Site

Visit: **http://combrige-polytechnic.66ghz.com**

---

## ⚠️ Common Issues

### Issue 1: 500 Internal Server Error
**Solution:**
- Check `.htaccess` file is correct
- Check folder permissions (storage and bootstrap/cache = 777)
- Check `.env` file exists and has correct values

### Issue 2: "No input file specified"
**Solution:**
Add this to `.htaccess` in root:
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ public/index.php/$1 [L]
</IfModule>
```

### Issue 3: Blank page
**Solution:**
- Enable `APP_DEBUG=true` temporarily in `.env`
- Check error logs in File Manager

### Issue 4: "Class not found"
**Solution:**
You need to run `composer install` - InfinityFree might not support this directly.
Upload the `vendor` folder from your local installation.

---

## 🎯 Quick Checklist

- [ ] All files uploaded to `htdocs`
- [ ] `.env` file created with correct values
- [ ] `.htaccess` file in root pointing to public
- [ ] `storage/` folder permissions set to 777
- [ ] `bootstrap/cache/` folder permissions set to 777
- [ ] Database migrations run (if needed)
- [ ] Visit your URL and test

---

## 🆘 Need Help?

Your app is configured to use your InfinityFree database that's already set up. Just upload the files and it should work!

**Your live URL will be:** http://combrige-polytechnic.66ghz.com
