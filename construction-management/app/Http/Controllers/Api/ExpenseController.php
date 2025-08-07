<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class ExpenseController extends Controller
{
    public function index(): JsonResponse
    {
        $expenses = Expense::with(['project', 'category', 'subcategory'])->get();
        
        return response()->json([
            'success' => true,
            'data' => $expenses
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'category_id' => 'required|exists:categories,id',
            'subcategory_id' => 'required|exists:subcategories,id',
            'amount' => 'required|numeric|min:0',
            'description' => 'required|string',
            'vendor_name' => 'nullable|string|max:255',
            'invoice_number' => 'nullable|string|max:255',
            'expense_date' => 'required|date',
            'payment_method' => 'nullable|string|max:255',
            'receipt_path' => 'nullable|string|max:255',
        ]);

        DB::transaction(function () use ($validated, &$expense) {
            $expense = Expense::create($validated);
            
            // Update project total expenses
            $project = Project::find($validated['project_id']);
            $project->total_expenses = $project->expenses()->sum('amount');
            $project->save();
        });

        return response()->json([
            'success' => true,
            'message' => 'Expense created successfully',
            'data' => $expense->load(['project', 'category', 'subcategory'])
        ], 201);
    }

    public function show(string $id): JsonResponse
    {
        $expense = Expense::with(['project', 'category', 'subcategory'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $expense
        ]);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $expense = Expense::findOrFail($id);

        $validated = $request->validate([
            'project_id' => 'sometimes|required|exists:projects,id',
            'category_id' => 'sometimes|required|exists:categories,id',
            'subcategory_id' => 'sometimes|required|exists:subcategories,id',
            'amount' => 'sometimes|required|numeric|min:0',
            'description' => 'sometimes|required|string',
            'vendor_name' => 'nullable|string|max:255',
            'invoice_number' => 'nullable|string|max:255',
            'expense_date' => 'sometimes|required|date',
            'payment_method' => 'nullable|string|max:255',
            'receipt_path' => 'nullable|string|max:255',
        ]);

        DB::transaction(function () use ($expense, $validated) {
            $oldProjectId = $expense->project_id;
            
            $expense->update($validated);
            
            // Update totals for affected projects
            $projectIds = array_unique([$oldProjectId, $expense->project_id]);
            foreach ($projectIds as $projectId) {
                $project = Project::find($projectId);
                if ($project) {
                    $project->total_expenses = $project->expenses()->sum('amount');
                    $project->save();
                }
            }
        });

        return response()->json([
            'success' => true,
            'message' => 'Expense updated successfully',
            'data' => $expense->load(['project', 'category', 'subcategory'])
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $expense = Expense::findOrFail($id);
        
        DB::transaction(function () use ($expense) {
            $projectId = $expense->project_id;
            
            $expense->delete();
            
            // Update project total expenses
            $project = Project::find($projectId);
            if ($project) {
                $project->total_expenses = $project->expenses()->sum('amount');
                $project->save();
            }
        });

        return response()->json([
            'success' => true,
            'message' => 'Expense deleted successfully'
        ]);
    }

    public function byProject(string $projectId): JsonResponse
    {
        $expenses = Expense::with(['category', 'subcategory'])
            ->where('project_id', $projectId)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $expenses
        ]);
    }

    public function byCategory(string $categoryId): JsonResponse
    {
        $expenses = Expense::with(['project', 'subcategory'])
            ->where('category_id', $categoryId)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $expenses
        ]);
    }
}
