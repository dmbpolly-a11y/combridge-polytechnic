# 🚀 Deploy to Railway NOW - Simple Steps

You're logged into Railway CLI! Here's the **easiest way** to deploy:

## Option 1: Deploy via Railway Dashboard (RECOMMENDED - 5 minutes)

### Step 1: Go to Railway Dashboard
Click this button or visit: https://railway.app/new

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/dmbpolly-a11y/combridge-polytechnic)

### Step 2: Follow the wizard
1. **Sign in** (you're already authenticated)
2. **Click "Deploy from GitHub repo"**
3. **Select**: `dmbpolly-a11y/combridge-polytechnic`
4. **Click "Deploy Now"**

### Step 3: Add MySQL Database
1. In your project, click **"+ New"**
2. Select **"Database"**
3. Choose **"MySQL"**
4. Done! Railway auto-connects it

### Step 4: Set Environment Variables
Click on your Laravel service → **Variables** → **RAW Editor** → Paste this:

```env
APP_NAME=Combridge School Management System
APP_ENV=production
APP_KEY=base64:hE3BMwpHZmltFP2rkssDa8BVf8foyrd+5U7nJWwdQho=
APP_DEBUG=false
DB_CONNECTION=mysql
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_DATABASE=${{MySQL.MYSQLDATABASE}}
DB_USERNAME=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
SESSION_DRIVER=file
CACHE_DRIVER=file
QUEUE_CONNECTION=sync
SCHOOL_NAME=Combridge Centre for Polytechnic Studies
SCHOOL_EMAIL=combridgecentre@gmail.com
SCHOOL_PHONE=+256 393 258 879
SCHOOL_WHATSAPP=+256 787 803 099
```

### Step 5: Generate Public Domain
1. Click on your service
2. Go to **Settings** → **Networking**
3. Click **"Generate Domain"**
4. Copy your URL (e.g., `combridge-polytechnic.up.railway.app`)

### Step 6: Update APP_URL
Go back to **Variables** and update:
```
APP_URL=https://your-generated-domain.railway.app
```

### Step 7: Done! ✅
Visit your domain - your app is live!

---

## Option 2: Deploy via CLI (Alternative)

If you prefer the terminal:

```powershell
# 1. Initialize project
railway init

# 2. Add MySQL
railway add

# 3. Set variables
railway variables set APP_KEY="base64:hE3BMwpHZmltFP2rkssDa8BVf8foyrd+5U7nJWwdQho="
railway variables set APP_ENV=production
railway variables set APP_DEBUG=false

# 4. Deploy
railway up

# 5. Generate domain
railway domain

# 6. Open dashboard to configure database variables
railway open
```

---

## 📊 Monitor Your Deployment

```powershell
railway status          # Check deployment status
railway logs            # View live logs
railway open            # Open dashboard
railway shell           # SSH into your app
```

---

## 🔍 Troubleshooting

**Problem: 500 Error after deployment**
- Solution: Check that APP_KEY is set correctly
- Run: `railway logs` to see error details

**Problem: Database connection failed**
- Solution: Verify database reference variables are correct:
  - `${{MySQL.MYSQLHOST}}` not `${{MySQL.MYSQL_HOST}}`
  - Check Railway docs for exact variable names

**Problem: Migrations not running**
- Solution: Run manually via Railway dashboard:
  - Go to service → Settings → Deploy
  - Or use: `railway run php artisan migrate --force`

---

## 📞 Need Help?

- Railway Docs: https://docs.railway.app
- Your GitHub: https://github.com/dmbpolly-a11y/combridge-polytechnic
- Railway Discord: https://discord.gg/railway

**You're all set! Your code is on GitHub and Railway CLI is authenticated. Just follow the steps above to go live!** 🎉
