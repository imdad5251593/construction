# Construction Management & Profit Distribution System

A comprehensive Laravel + React application for managing construction projects, tracking investments, monitoring expenses, and calculating profit distribution among investors.

## 🏗️ Features

### Core Functionality
- **Project Management**: Create and track construction projects with timelines
- **Investor Management**: Manage multiple investors and their contact information
- **Investment Tracking**: Record investments by date with payment method details
- **Expense Management**: Categorized expense tracking with receipt management
- **Profit Distribution**: Automatic profit calculation excluding credit amounts
- **Category System**: Hierarchical expense categories (Electrical, Plumbing, Ceiling, Red Structure, etc.)

### Key Business Logic
- **Investment Ratio Calculation**: Profit distribution based on investment ratios
- **Credit Exclusion**: Profit calculated only on cash received, excluding credit amounts
- **Real-time Totals**: Automatic calculation of project totals and investor summaries
- **Comprehensive Reporting**: Detailed financial reports and dashboards

## 🛠️ Tech Stack

### Backend
- **Laravel 12** (PHP 8.4)
- **SQLite Database** (easily configurable to MySQL)
- **RESTful API** with comprehensive endpoints

### Frontend
- **React 18** with modern hooks
- **React Router** for SPA navigation
- **Tailwind CSS** for responsive design
- **Heroicons** for consistent iconography
- **Axios** for API communication

### Development Tools
- **Vite** for fast frontend building
- **Composer** for PHP dependency management
- **npm** for JavaScript dependencies

## 📋 System Requirements

### Minimum Requirements
- **PHP**: 8.4+
- **Node.js**: 22.x (LTS)
- **npm**: 10.x+
- **Composer**: 2.8+

### Recommended Requirements
- **PHP**: 8.4 with extensions: sqlite3, curl, gd, mbstring, xml, zip, intl
- **Node.js**: 22.18.0 (LTS)
- **MySQL**: 8.0+ (optional, if switching from SQLite)

## 🚀 Installation & Setup

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd construction-management

# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install
```

### 2. Environment Configuration

```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Database configuration (already set for SQLite)
# DB_CONNECTION=sqlite
# For MySQL, update these values:
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=construction_management
# DB_USERNAME=your_username
# DB_PASSWORD=your_password
```

### 3. Database Setup

```bash
# Create SQLite database file
touch database/database.sqlite

# Run migrations
php artisan migrate

# Seed default categories
php artisan db:seed --class=CategorySeeder
```

### 4. Frontend Build

```bash
# Development build with hot reload
npm run dev

# Production build
npm run build
```

### 5. Start Development Server

```bash
# Terminal 1: Laravel server
php artisan serve

# Terminal 2: Vite dev server (if using npm run dev)
npm run dev
```

Visit `http://localhost:8000` to access the application.

## 📁 Project Structure

```
construction-management/
├── app/
│   ├── Http/Controllers/Api/     # API Controllers
│   │   ├── ProjectController.php
│   │   ├── InvestorController.php
│   │   ├── InvestmentController.php
│   │   ├── CategoryController.php
│   │   ├── ExpenseController.php
│   │   └── ReportController.php
│   └── Models/                   # Eloquent Models
│       ├── Project.php
│       ├── Investor.php
│       ├── Investment.php
│       ├── Category.php
│       ├── Subcategory.php
│       ├── Expense.php
│       └── ProjectSale.php
├── database/
│   ├── migrations/               # Database schema
│   └── seeders/
│       └── CategorySeeder.php    # Default categories
├── resources/
│   ├── js/
│   │   ├── components/           # React components
│   │   │   ├── Layout.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── Investors.jsx
│   │   │   ├── Investments.jsx
│   │   │   ├── Expenses.jsx
│   │   │   ├── Categories.jsx
│   │   │   └── Reports.jsx
│   │   └── app.jsx              # Main React app
│   ├── css/
│   │   └── app.css              # Tailwind CSS
│   └── views/
│       └── app.blade.php        # Main HTML template
├── routes/
│   ├── api.php                  # API routes
│   └── web.php                  # Web routes (SPA)
└── public/                      # Compiled assets
```

## 🔗 API Endpoints

### Projects
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/{id}` - Get project details
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project
- `GET /api/projects/{id}/statistics` - Project statistics

### Investors
- `GET /api/investors` - List all investors
- `POST /api/investors` - Create new investor
- `GET /api/investors/{id}` - Get investor details
- `PUT /api/investors/{id}` - Update investor
- `DELETE /api/investors/{id}` - Delete investor

### Investments
- `GET /api/investments` - List all investments
- `POST /api/investments` - Record new investment
- `GET /api/investments/{id}` - Get investment details
- `PUT /api/investments/{id}` - Update investment
- `DELETE /api/investments/{id}` - Delete investment
- `GET /api/investments/project/{id}` - Get investments by project
- `GET /api/investments/investor/{id}` - Get investments by investor

### Expenses
- `GET /api/expenses` - List all expenses
- `POST /api/expenses` - Record new expense
- `GET /api/expenses/{id}` - Get expense details
- `PUT /api/expenses/{id}` - Update expense
- `DELETE /api/expenses/{id}` - Delete expense
- `GET /api/expenses/project/{id}` - Get expenses by project
- `GET /api/expenses/category/{id}` - Get expenses by category

### Categories
- `GET /api/categories` - List all categories with subcategories
- `POST /api/categories` - Create new category
- `GET /api/categories/{id}` - Get category details
- `PUT /api/categories/{id}` - Update category
- `DELETE /api/categories/{id}` - Delete category
- `POST /api/categories/{id}/subcategories` - Create subcategory

### Reports
- `GET /api/reports/profit/{project}` - Project profit report
- `GET /api/reports/investment-summary` - Investment summary
- `GET /api/reports/expense-summary` - Expense summary
- `GET /api/reports/dashboard` - Dashboard data

## 💼 Business Logic

### Profit Calculation
The system calculates profit using this formula:
```
Profit = Cash Received - (Total Investments + Total Expenses)
```

**Important**: Credit amounts are excluded from profit calculations as they represent unpaid amounts.

### Profit Distribution
Profit is distributed among investors based on their investment ratios:
```
Investor Profit Share = Total Profit × (Investor Investment / Total Investments)
```

### Category System
Expenses are organized in a two-level hierarchy:
- **Main Categories**: Electrical, Plumbing, Ceiling, Red Structure, Masonry, Finishing
- **Subcategories**: Specific items under each main category

## 🎨 Frontend Features

### Responsive Design
- Mobile-first responsive design
- Sidebar navigation with mobile drawer
- Modern card-based layouts
- Tailwind CSS utility classes

### User Interface
- Clean, professional interface
- Consistent color scheme and iconography
- Real-time data updates
- Form validation and error handling

### Navigation
- Dashboard overview with key metrics
- Dedicated pages for each major function
- Breadcrumb navigation
- Quick access to frequently used features

## 🔧 Configuration Options

### Database Switch (SQLite to MySQL)
To switch from SQLite to MySQL:

1. Update `.env` file:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=construction_management
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

2. Create MySQL database:
```sql
CREATE DATABASE construction_management;
```

3. Run migrations:
```bash
php artisan migrate:fresh --seed
```

### Production Deployment
For production deployment:

1. Set environment variables:
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com
```

2. Build assets:
```bash
npm run build
```

3. Optimize Laravel:
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## 🧪 Testing

### API Testing
Use tools like Postman or Insomnia to test API endpoints:

1. Set base URL: `http://localhost:8000/api`
2. Set headers: `Accept: application/json`
3. For POST/PUT requests: `Content-Type: application/json`

### Sample API Calls

Create a project:
```bash
curl -X POST http://localhost:8000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Residential Building A",
    "description": "3-story residential building",
    "location": "Downtown Area",
    "start_date": "2024-01-01"
  }'
```

Create an investor:
```bash
curl -X POST http://localhost:8000/api/investors \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "email": "john@example.com",
    "phone": "+1234567890"
  }'
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🐛 Known Issues

- None currently reported

## 🔮 Future Enhancements

- Document management system
- Advanced reporting with charts
- Mobile app companion
- Multi-currency support
- User authentication and roles
- Email notifications
- Backup and restore functionality
- Integration with accounting software

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the setup instructions

---

**Built with ❤️ using Laravel 12 and React 18**
