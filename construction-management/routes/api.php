<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\InvestorController;
use App\Http\Controllers\Api\InvestmentController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ExpenseController;
use App\Http\Controllers\Api\ReportController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Projects routes
Route::apiResource('projects', ProjectController::class);
Route::get('projects/{project}/statistics', [ProjectController::class, 'statistics']);

// Investors routes
Route::apiResource('investors', InvestorController::class);

// Investments routes
Route::apiResource('investments', InvestmentController::class);
Route::get('investments/project/{project}', [InvestmentController::class, 'byProject']);
Route::get('investments/investor/{investor}', [InvestmentController::class, 'byInvestor']);

// Categories routes
Route::apiResource('categories', CategoryController::class);
Route::post('categories/{category}/subcategories', [CategoryController::class, 'storeSubcategory']);

// Expenses routes
Route::apiResource('expenses', ExpenseController::class);
Route::get('expenses/project/{project}', [ExpenseController::class, 'byProject']);
Route::get('expenses/category/{category}', [ExpenseController::class, 'byCategory']);

// Reports routes
Route::prefix('reports')->group(function () {
    Route::get('profit/{project}', [ReportController::class, 'projectProfitReport']);
    Route::get('investment-summary', [ReportController::class, 'investmentSummary']);
    Route::get('expense-summary', [ReportController::class, 'expenseSummary']);
    Route::get('dashboard', [ReportController::class, 'dashboardData']);
});