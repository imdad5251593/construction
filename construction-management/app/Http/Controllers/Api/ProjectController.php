<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $projects = Project::with(['investments.investor', 'expenses', 'sale'])->get();
        
        return response()->json([
            'success' => true,
            'data' => $projects
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'location' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
        ]);

        $project = Project::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Project created successfully',
            'data' => $project
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $project = Project::with([
            'investments.investor', 
            'expenses.category', 
            'expenses.subcategory',
            'sale'
        ])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $project,
            'profit_distribution' => $project->getProfitDistribution(),
            'profit' => $project->calculateProfit()
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $project = Project::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'location' => 'sometimes|required|string|max:255',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'nullable|date|after:start_date',
            'is_completed' => 'sometimes|boolean',
            'is_sold' => 'sometimes|boolean',
            'sale_date' => 'nullable|date',
        ]);

        $project->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Project updated successfully',
            'data' => $project
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $project = Project::findOrFail($id);
        $project->delete();

        return response()->json([
            'success' => true,
            'message' => 'Project deleted successfully'
        ]);
    }

    /**
     * Get project statistics
     */
    public function statistics(): JsonResponse
    {
        $stats = [
            'total_projects' => Project::count(),
            'completed_projects' => Project::where('is_completed', true)->count(),
            'sold_projects' => Project::where('is_sold', true)->count(),
            'active_projects' => Project::where('is_completed', false)->count(),
            'total_investment' => Project::sum('total_investment'),
            'total_expenses' => Project::sum('total_expenses'),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats
        ]);
    }
}
