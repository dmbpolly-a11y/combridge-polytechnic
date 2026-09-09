# 🆓 Deploy to Render.com - 100% FREE

Your Laravel app is ready to deploy! Follow these simple steps to get your live URL.

## ✅ What's Ready:
- ✅ GitHub repository configured
- ✅ Render configuration files created
- ✅ Database setup included
- ✅ Everything pushed to GitHub

---

## 🚀 Deploy Now (5 Minutes):

### Step 1: Sign Up / Login to Render
1. Go to: **https://render.com**
2. Click **"Get Started"** or **"Sign In"**
3. Choose **"Sign in with GitHub"** (easiest)
4. Authorize Render to access your repositories

### Step 2: Deploy from GitHub
1. After login, click **"New +"** → **"Blueprint"**
2. Or use this direct link: **https://dashboard.render.com/select-repo?type=blueprint**
3. Click **"Connect account"** if GitHub isn't connected yet
4. Find and select: **`dmbpolly-a11y/combridge-polytechnic`**
5. Click **"Connect"**
6. Render will detect `render.yaml` automatically
7. Click **"Apply"** to start deployment

### Step 3: Wait for Deployment
- Render will:
  - ✅ Create MySQL database (FREE)
  - ✅ Build your Laravel app
  - ✅ Install dependencies
  - ✅ Run migrations
  - ✅ Generate a public URL

This takes **5-10 minutes** for first deployment.

### Step 4: Get Your Live URL
Once deployment completes:
1. Click on your **"combridge-polytechnic"** service
2. You'll see your URL at the top (like: `https://combridge-polytechnic.onrender.com`)
3. Copy this URL!

### Step 5: Update APP_URL
1. In Render dashboard, go to your service
2. Click **"Environment"** tab
3. Find `APP_URL` variable
4. Update it with your Render URL: `https://your-app.onrender.com`
5. Click **"Save Changes"**
6. Service will automatically redeploy (takes 2-3 minutes)

---

## 🎉 You're Live!

Visit your URL: `https://combridge-polytechnic.onrender.com` (or whatever Render assigned)

**Default Admin Access** (if seeded):
- Check your database seeders for default credentials
- Or create admin via: `php artisan tinker` in Render shell

---

## 🔧 Alternative: Manual Setup (if Blueprint doesn't work)

### Option A: Deploy Web Service Only

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub: **`dmbpolly-a11y/combridge-polytechnic`**
3. Configure:
   - **Name**: `combridge-polytechnic`
   - **Region**: Oregon (US West)
   - **Branch**: `main`
   - **Runtime**: Docker
   - **Instance Type**: Free
   - **Build Command**: `bash render-build.sh`
   - **Start Command**: `php artisan serve --host=0.0.0.0 --port=$PORT`

4. Add Environment Variables (click "Add Environment Variable"):
   ```
   APP_NAME=Combridge School Management System
   APP_ENV=production
   APP_KEY=base64:hE3BMwpHZmltFP2rkssDa8BVf8foyrd+5U7nJWwdQho=
   APP_DEBUG=false
   DB_CONNECTION=mysql
   SESSION_DRIVER=file
   CACHE_DRIVER=file
   QUEUE_CONNECTION=sync
   ```

5. Click **"Create Web Service"**

### Option B: Add MySQL Database Separately

1. Click **"New +"** → **"MySQL"** (under Databases)
2. Configure:
   - **Name**: `combridge-db`
   - **Database**: `combridge_db`
   - **User**: `combridge_user`
   - **Region**: Same as web service
   - **Instance Type**: Free

3. After database is created, go back to your web service
4. Add these environment variables (using database credentials):
   ```
   DB_HOST=[from database Internal Database URL]
   DB_PORT=3306
   DB_DATABASE=combridge_db
   DB_USERNAME=combridge_user
   DB_PASSWORD=[from database credentials]
   ```

---

## 📊 Monitor Your App

In Render Dashboard:
- **Logs**: Click "Logs" tab to see real-time output
- **Shell**: Click "Shell" to access terminal
- **Metrics**: View CPU, memory, requests
- **Events**: See deployment history

---

## ⚠️ Important Notes:

### Free Tier Limitations:
- ✅ 750 hours/month (enough for 24/7 uptime)
- ✅ Shared CPU and RAM
- ⚠️ App sleeps after 15 minutes of inactivity
- ⚠️ First request after sleep takes 30-60 seconds (cold start)
- ✅ Custom domain support (free)

### Keep Your App Awake:
Use a free uptime monitoring service to ping your app every 10 minutes:
- **UptimeRobot** (https://uptimerobot.com) - FREE
- **Cron-job.org** (https://cron-job.org) - FREE

---

## 🔍 Troubleshooting

### Build Failed:
- Check **Logs** tab in Render
- Common issues:
  - Composer dependencies not installing → Check `composer.json`
  - PHP version mismatch → Dockerfile uses PHP 8.2

### Database Connection Error:
- Verify database environment variables are set correctly
- Check database is in "Available" state
- Use Internal Database URL, not External

### 500 Error:
- Check `APP_KEY` is set correctly
- Enable `APP_DEBUG=true` temporarily to see errors
- Check logs: Click service → Logs tab
- Run migrations: Service → Shell → `php artisan migrate --force`

### App Not Loading:
- Check deployment status (should be "Live")
- Wait for initial build (5-10 minutes)
- Check if service is sleeping (first request will wake it)

---

## 🎯 Quick Deploy Button

Click this badge to deploy instantly:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/dmbpolly-a11y/combridge-polytechnic)

---

## 📞 Resources

- **Render Docs**: https://render.com/docs
- **Your GitHub**: https://github.com/dmbpolly-a11y/combridge-polytechnic
- **Render Dashboard**: https://dashboard.render.com
- **Render Support**: https://render.com/docs/support

---

## 🚀 Next Steps After Deployment:

1. ✅ Test all features
2. ✅ Set up uptime monitoring
3. ✅ Configure custom domain (optional)
4. ✅ Set up scheduled tasks (if needed)
5. ✅ Enable logging/monitoring

**Your app will be live at a URL like:**
`https://combridge-polytechnic.onrender.com`

**100% FREE. No credit card required!** 🎉
