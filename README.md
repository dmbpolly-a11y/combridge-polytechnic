# Combridge Polytechnic System

A comprehensive school management system built with Laravel.

## 🚀 Quick Deploy to Render.com (FREE)

Click the button below to deploy instantly:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/dmbpolly-a11y/combridge-polytechnic)

### Or use this link:
**https://render.com/deploy?repo=https://github.com/dmbpolly-a11y/combridge-polytechnic**

---

## 📋 Features

- Student Management
- Teacher Management
- Attendance Tracking (QR Code)
- Examination & Grading System
- Fee Management
- Library Management
- Timetable Management
- Communication System
- Reports & Analytics
- Department & Programme Management

---

## 🛠️ Tech Stack

- **Framework**: Laravel 10
- **PHP Version**: 8.2
- **Database**: MySQL
- **Authentication**: Laravel Sanctum
- **PDF Generation**: DomPDF
- **Excel Export**: Maatwebsite Excel
- **Permissions**: Spatie Laravel Permission

---

## 📦 Local Installation

### Requirements:
- PHP 8.1 or higher
- Composer
- MySQL
- Node.js & NPM

### Steps:

1. Clone the repository:
```bash
git clone https://github.com/dmbpolly-a11y/combridge-polytechnic.git
cd combridge-polytechnic
```

2. Install dependencies:
```bash
composer install
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Generate application key:
```bash
php artisan key:generate
```

5. Configure database in `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

6. Run migrations:
```bash
php artisan migrate
```

7. Seed database (optional):
```bash
php artisan db:seed
```

8. Start development server:
```bash
php artisan serve
```

Visit: `http://localhost:8000`

---

## 🌐 Deployment

### Deploy to Render.com (Recommended - FREE)
See [DEPLOY_BUTTON.md](DEPLOY_BUTTON.md) for one-click deployment

### Deploy to Railway
See [RAILWAY_DEPLOYMENT.md](RAILWAY_DEPLOYMENT.md) for Railway deployment

---

## 📄 License

Proprietary

---

## 👥 Contact

**Combridge Centre for Polytechnic Studies**
- Email: combridgecentre@gmail.com
- Phone: +256 393 258 879
- WhatsApp: +256 787 803 099
- Address: Nyamityobora, Kaboba Mbarara City, 200 meters off Mbarara Masaka Highway

---

## 🤝 Contributing

This is a proprietary project. For inquiries, contact the school administration.
