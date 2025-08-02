# Quick Setup Guide

## Immediate Setup (5 minutes)

### 1. Install Dependencies
```bash
composer install
npm install
```

### 2. Database Setup
```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Create database and run migrations
touch database/database.sqlite
php artisan migrate

# Seed default categories
php artisan db:seed --class=CategorySeeder
```

### 3. Start Application
```bash
# Build frontend assets
npm run build

# Start Laravel server
php artisan serve
```

Visit `http://localhost:8000` to access the application.

## Production Ready Features

✅ **Complete Backend API**
- Projects, Investors, Investments, Expenses management
- Automated profit calculations
- Category-based expense tracking

✅ **React Frontend**
- Responsive design with Tailwind CSS
- Modern React with hooks and routing
- Professional dashboard interface

✅ **Database**
- SQLite for immediate use (no setup required)
- Easily configurable to MySQL
- Migrations with proper relationships

✅ **System Requirements**
- PHP 8.4+ ✅ (Installed)
- Node.js 22.x ✅ (Installed) 
- Composer ✅ (Installed)
- SQLite ✅ (Built-in)

## Next Steps
1. Access the application at `http://localhost:8000`
2. Explore the API endpoints at `/api/*`
3. Create your first project and investors
4. Start tracking investments and expenses
5. View profit calculations in real-time

## Key Features Working
- ✅ Project creation and management
- ✅ Investor management
- ✅ Investment tracking with automatic totals
- ✅ Expense management with categories
- ✅ Profit calculation excluding credit amounts
- ✅ Professional React dashboard
- ✅ Responsive mobile design
- ✅ RESTful API endpoints

The system is ready for production use!