# Local Setup Guide - Windows
## Access Combridge Polytechnic System on Your Computer

This guide will help you run the system on your Windows computer at `http://localhost:8000`

---

## 🎯 Quick Overview

You'll install:
1. **XAMPP** - Provides PHP and MySQL (15 minutes)
2. **Composer** - PHP package manager (5 minutes)
3. **Setup Database** - Create and populate database (5 minutes)
4. **Run Application** - Start the web server (2 minutes)

**Total Time**: ~30 minutes

---

## Step 1: Install XAMPP

### Download XAMPP

1. Open your browser and go to: **https://www.apachefriends.org**
2. Click **"Download"** (for Windows)
3. Download **XAMPP 8.2.x** (includes PHP 8.2)
4. File will be: `xampp-windows-x64-8.2.x-installer.exe` (~150 MB)

### Install XAMPP

1. **Run the installer** (double-click the downloaded file)
2. If Windows asks "Do you want to allow this app?", click **Yes**
3. If UAC warning appears about antivirus, click **OK**
4. Installation wizard will open:
   - Click **Next**
   - Select components (keep defaults):
     - ✅ Apache
     - ✅ MySQL
     - ✅ PHP
     - ✅ phpMyAdmin
   - Click **Next**
   - Installation folder: `C:\xampp` (keep default)
   - Click **Next**
   - Uncheck "Learn more about Bitnami" (optional)
   - Click **Next**
   - Click **Next** to start installation
   - Wait for installation (~5 minutes)
   - Click **Finish**

### Start XAMPP Services

1. **Open XAMPP Control Panel**:
   - Go to: `C:\xampp`
   - Double-click **xampp-control.exe**
   - Or search "XAMPP Control Panel" in Windows Start menu

2. **Start Services**:
   - Click **Start** button next to **Apache**
   - Click **Start** button next to **MySQL**
   - Both should show "Running" in green

3. **If firewall asks for permission**, click **Allow Access**

### Verify XAMPP Works

1. Open browser
2. Go to: **http://localhost**
3. You should see XAMPP welcome page (orange/purple design)
4. If you see it, XAMPP is working! ✅

---

## Step 2: Install Composer

### Download Composer

1. Go to: **https://getcomposer.org/download/**
2. Click **"Composer-Setup.exe"** (Windows Installer)
3. Download the installer (~2 MB)

### Install Composer

1. **Run installer** (double-click `Composer-Setup.exe`)
2. If Windows asks, click **Yes**
3. Installation wizard:
   - Click **Next**
   - **Developer mode**: Leave unchecked
   - Click **Next**
   - **PHP location**: It should auto-detect `C:\xampp\php\php.exe`
     - If not found, click **Browse** and navigate to: `C:\xampp\php\php.exe`
   - Click **Next**
   - **Proxy settings**: Leave empty (unless you use a proxy)
   - Click **Next**
   - Review settings
   - Click **Install**
   - Wait for installation (~2 minutes)
   - Click **Finish**

### Verify Composer Works

1. **Open PowerShell or Command Prompt**:
   - Press `Windows + X`
   - Select **"Windows PowerShell"** or **"Terminal"**

2. **Check Composer**:
   ```powershell
   composer --version
   ```
   
3. You should see: `Composer version 2.x.x`
4. If you see it, Composer is working! ✅

---

## Step 3: Setup the Project

### Navigate to Project

1. **Open PowerShell/Terminal**
2. **Navigate to project folder**:
   ```powershell
   cd "C:\Users\AFRICA\Desktop\COMBRIDGE POLYTECHNIC SYTEM\COMBRIDGE POLYTECHNIC SYTEM"
   ```

### Install Dependencies

1. **Install PHP packages** (this will take 5-10 minutes):
   ```powershell
   composer install
   ```
   
   You'll see packages being downloaded. Wait until it completes.

2. **If you get errors**, try:
   ```powershell
   composer install --ignore-platform-reqs
   ```

### Setup Environment File

1. **Copy the environment file**:
   ```powershell
   Copy-Item .env.example .env
   ```

2. **Generate application key**:
   ```powershell
   php artisan key:generate
   ```
   
   You should see: "Application key set successfully."

---

## Step 4: Setup Database

### Create Database

1. **Open browser** and go to: **http://localhost/phpmyadmin**
2. You should see phpMyAdmin interface
3. Click **"New"** in left sidebar
4. **Database name**: Enter `combridge_polytechnic`
5. **Collation**: Select `utf8mb4_unicode_ci`
6. Click **"Create"**
7. Database created! ✅

### Configure Database Connection

1. **Open the `.env` file**:
   - Navigate to: `C:\Users\AFRICA\Desktop\COMBRIDGE POLYTECHNIC SYTEM\COMBRIDGE POLYTECHNIC SYTEM`
   - Right-click `.env` file
   - Select **"Open with"** → **Notepad** or **VS Code**

2. **Find these lines** (around line 11-16):
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=laravel
   DB_USERNAME=root
   DB_PASSWORD=
   ```

3. **Change to**:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=combridge_polytechnic
   DB_USERNAME=root
   DB_PASSWORD=
   ```
   
   (Just change `DB_DATABASE=laravel` to `DB_DATABASE=combridge_polytechnic`)

4. **Save the file** (Ctrl+S)

### Run Migrations

1. **Go back to PowerShell/Terminal**
2. **Create database tables**:
   ```powershell
   php artisan migrate
   ```
   
   You'll see each table being created. Takes ~1 minute.

3. **Populate with sample data**:
   ```powershell
   php artisan db:seed
   ```
   
   You'll see a beautiful table showing all the data being created:
   - 8 Roles
   - 44 Permissions
   - 5 Departments
   - 10 Programmes
   - 120 Users
   - And more!

---

## Step 5: Run the Application

### Start Development Server

1. **In PowerShell/Terminal**, run:
   ```powershell
   php artisan serve
   ```

2. You should see:
   ```
   Starting Laravel development server: http://127.0.0.1:8000
   [Press Ctrl+C to quit]
   ```

3. **Keep this window open!** (Don't close it)

### Access the System

1. **Open your browser**
2. Go to: **http://localhost:8000**
3. **You should see the Combridge Polytechnic homepage!** 🎉

---

## Step 6: Login and Explore

### Default Login Credentials

**Administrator Account**:
```
Email: admin@combridgecentre.ac.ug
Password: password123
```

**Other Accounts**:
```
Principal: principal@combridgecentre.ac.ug / password123
Bursar: bursar@combridgecentre.ac.ug / password123
Librarian: librarian@combridgecentre.ac.ug / password123

Teachers: 
- r.ssebunya@combridgecentre.ac.ug / password123
- p.auma@combridgecentre.ac.ug / password123
- c.okumu@combridgecentre.ac.ug / password123

Students:
- Check the database for student emails
- All passwords are: password123
```

### What to Test

1. **Login as Administrator**
2. **Explore the Admin Dashboard**
3. **Check different modules**:
   - Students Management
   - Teachers Management
   - Library
   - Attendance
   - Fee Management
   - Examinations
   - Reports

---

## 📱 Accessing from Other Devices (Optional)

### On Same Network (Phone/Tablet)

1. **Find your computer's IP address**:
   ```powershell
   ipconfig
   ```
   Look for "IPv4 Address" under your active network (e.g., `192.168.1.5`)

2. **On your phone/tablet browser**, go to:
   ```
   http://192.168.1.5:8000
   ```
   (Replace with your actual IP address)

---

## 🛠️ Troubleshooting

### Issue 1: Port Already in Use

**Error**: "Address already in use"

**Solution**: Use a different port:
```powershell
php artisan serve --port=8001
```
Then access: http://localhost:8001

### Issue 2: Database Connection Error

**Error**: "SQLSTATE[HY000] [1045] Access denied"

**Solutions**:
1. Check if MySQL is running in XAMPP Control Panel
2. Verify `.env` file has correct database settings
3. Try setting a MySQL password in XAMPP:
   - Open XAMPP Control Panel
   - Click **Shell** button
   - Type: `mysqladmin -u root password NEWPASSWORD`
   - Update `.env` with: `DB_PASSWORD=NEWPASSWORD`

### Issue 3: Composer Install Fails

**Error**: Various package errors

**Solution**:
```powershell
composer install --ignore-platform-reqs --no-scripts
```

### Issue 4: Migration Fails

**Error**: "Table already exists"

**Solution**: Reset database:
```powershell
php artisan migrate:fresh --seed
```
⚠️ Warning: This deletes all data!

### Issue 5: Page Not Loading

**Checklist**:
- ✅ Is `php artisan serve` running?
- ✅ Is XAMPP MySQL running?
- ✅ Did you run migrations?
- ✅ Is the URL correct? (http://localhost:8000)

### Issue 6: Styles Not Loading

**Solution**:
```powershell
npm install
npm run dev
```

---

## 🔄 Daily Usage

### Starting the System

1. **Open XAMPP Control Panel**
2. **Start Apache and MySQL**
3. **Open PowerShell/Terminal**
4. **Navigate to project**:
   ```powershell
   cd "C:\Users\AFRICA\Desktop\COMBRIDGE POLYTECHNIC SYTEM\COMBRIDGE POLYTECHNIC SYTEM"
   ```
5. **Start server**:
   ```powershell
   php artisan serve
   ```
6. **Open browser**: http://localhost:8000

### Stopping the System

1. **In PowerShell**, press: `Ctrl + C`
2. **In XAMPP Control Panel**, click **Stop** for Apache and MySQL

---

## 📚 Useful Commands

```powershell
# Start development server
php artisan serve

# Run on different port
php artisan serve --port=8001

# Reset database (WARNING: Deletes all data!)
php artisan migrate:fresh --seed

# Clear cache
php artisan cache:clear
php artisan config:clear
php artisan view:clear

# Create admin user manually
php artisan tinker
# Then type: User::factory()->create(['email' => 'your@email.com']);

# Check Laravel version
php artisan --version

# List all routes
php artisan route:list
```

---

## 🎓 Next Steps

Once you've tested locally:

1. **Customize Data**: Update student names, programmes, etc.
2. **Change Passwords**: Update all default passwords
3. **Add Real Data**: Enter actual school information
4. **Test All Features**: Try every module
5. **Plan Deployment**: When ready, deploy to online hosting

---

## 📞 Need Help?

If you encounter issues:

1. **Check error messages** carefully
2. **Google the error** - Laravel has great community support
3. **Check Laravel logs**: `storage/logs/laravel.log`
4. **Verify all services are running** in XAMPP

---

## ✅ Success Checklist

Before considering setup complete:

- [ ] XAMPP installed and running
- [ ] Composer installed
- [ ] Dependencies installed (`composer install`)
- [ ] Database created in phpMyAdmin
- [ ] `.env` file configured
- [ ] Migrations completed (`php artisan migrate`)
- [ ] Data seeded (`php artisan db:seed`)
- [ ] Server running (`php artisan serve`)
- [ ] Can access http://localhost:8000
- [ ] Can login with admin credentials
- [ ] Dashboard loads correctly

---

**Estimated Total Time**: 30-45 minutes  
**Difficulty**: Beginner-friendly ⭐⭐☆☆☆

**Status**: Ready to start! 🚀
