# Construction Management System

A Laravel + React (Vite) application for managing construction projects, investors, investments, expenses, and reports. The frontend is a React SPA mounted via `resources/views/app.blade.php` and styled with Tailwind CSS v4. The backend exposes RESTful APIs under `/api`.

## Features
- Projects CRUD with search, sorting, and server-side pagination
- Investors, Investments, Expenses, and Categories resources
- Project statistics (profit calculation and distribution)
- Responsive layout with sidebar navigation

## Tech Stack
- Backend: Laravel (PHP), Eloquent ORM, API controllers under `App\Http\Controllers\Api`
- Frontend: React 19, React Router, Tailwind CSS v4, Vite, Laravel Vite plugin

## Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+ and npm
- A MySQL-compatible database

## Setup
1. Clone the repository
   ```bash
   git clone <your-repo-url>
   cd construction
   ```
2. Install PHP dependencies
   ```bash
   composer install
   ```
3. Create environment file and app key
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
4. Configure your database credentials in `.env`, then run migrations
   ```bash
   php artisan migrate
   ```
5. Install Node dependencies
   ```bash
   npm ci
   ```

## Development
- Start Vite in one terminal
  ```bash
  npm run dev
  ```
- Start Laravel server in another terminal
  ```bash
  php artisan serve
  ```
- Visit the app at `http://127.0.0.1:8000` (the SPA router serves pages). The SPA entry is `resources/js/app.jsx` and layout is `resources/js/components/Layout.jsx`.

## Build for Production
```bash
npm run build
```
This generates assets under `public/build` consumed by `resources/views/app.blade.php`.

## API Overview
- Projects: `GET /api/projects` (supports `search`, `page`, `per_page`, `sort_by`, `sort_direction`), `POST /api/projects`, `GET /api/projects/{id}`, `PUT /api/projects/{id}`, `DELETE /api/projects/{id}`
- Investors: `apiResource('investors')`
- Investments: `apiResource('investments')`, plus per-project/per-investor endpoints
- Expenses: `apiResource('expenses')`
- Categories: `apiResource('categories')`

All API responses are JSON. Validation errors return HTTP 422 with an `errors` object (used to show per-field messages in forms).

## Styling & UI
- Tailwind CSS v4 is configured via `resources/css/app.css` and Vite (`vite.config.js`).
- The SPA layout is in `resources/js/components/Layout.jsx`.
- The Projects UI (`resources/js/components/Projects.jsx`) uses Tailwind inputs with field-level error messages.

## Project Structure (selected)
- `app/Models` — Eloquent models (Project, Investor, etc.)
- `app/Http/Controllers/Api` — REST API controllers
- `resources/views/app.blade.php` — SPA mount point
- `resources/js/app.jsx` — React entry (routing)
- `resources/js/components` — React components
- `routes/api.php` — API routes
- `routes/web.php` — SPA catch-all route

## Environment Notes
- CSRF token is provided via a meta tag in `app.blade.php` and axios is preconfigured in `resources/js/bootstrap.js`.
- If you use Laravel Sanctum or auth, ensure proper middleware and CORS settings.

## Running Tests
```bash
php artisan test
```

## Troubleshooting
- If Vite assets are not loading, run `npm run dev` or `npm run build`.
- If you get 422 validation errors, the UI displays per-field messages; check the input values or browser devtools network tab for details.
