<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Investment;
use App\Models\Project;
use App\Models\Investor;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class InvestmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $investments = Investment::with(['project', 'investor'])->get();
        
        return response()->json([
            'success' => true,
            'data' => $investments
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'investor_id' => 'required|exists:investors,id',
            'amount' => 'required|numeric|min:0',
            'investment_date' => 'required|date',
            'description' => 'nullable|string',
            'payment_method' => 'nullable|string|max:255',
            'reference_number' => 'nullable|string|max:255',
        ]);

        DB::transaction(function () use ($validated, &$investment) {
            $investment = Investment::create($validated);
            
            // Update project total investment
            $project = Project::find($validated['project_id']);
            $project->total_investment = $project->investments()->sum('amount');
            $project->save();
            
            // Update investor total investment
            $investor = Investor::find($validated['investor_id']);
            $investor->total_investment = $investor->investments()->sum('amount');
            $investor->save();
        });

        return response()->json([
            'success' => true,
            'message' => 'Investment created successfully',
            'data' => $investment->load(['project', 'investor'])
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $investment = Investment::with(['project', 'investor'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $investment
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $investment = Investment::findOrFail($id);

        $validated = $request->validate([
            'project_id' => 'sometimes|required|exists:projects,id',
            'investor_id' => 'sometimes|required|exists:investors,id',
            'amount' => 'sometimes|required|numeric|min:0',
            'investment_date' => 'sometimes|required|date',
            'description' => 'nullable|string',
            'payment_method' => 'nullable|string|max:255',
            'reference_number' => 'nullable|string|max:255',
        ]);

        DB::transaction(function () use ($investment, $validated) {
            $oldProjectId = $investment->project_id;
            $oldInvestorId = $investment->investor_id;
            
            $investment->update($validated);
            
            // Update totals for affected projects
            $projectIds = array_unique([$oldProjectId, $investment->project_id]);
            foreach ($projectIds as $projectId) {
                $project = Project::find($projectId);
                if ($project) {
                    $project->total_investment = $project->investments()->sum('amount');
                    $project->save();
                }
            }
            
            // Update totals for affected investors
            $investorIds = array_unique([$oldInvestorId, $investment->investor_id]);
            foreach ($investorIds as $investorId) {
                $investor = Investor::find($investorId);
                if ($investor) {
                    $investor->total_investment = $investor->investments()->sum('amount');
                    $investor->save();
                }
            }
        });

        return response()->json([
            'success' => true,
            'message' => 'Investment updated successfully',
            'data' => $investment->load(['project', 'investor'])
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $investment = Investment::findOrFail($id);
        
        DB::transaction(function () use ($investment) {
            $projectId = $investment->project_id;
            $investorId = $investment->investor_id;
            
            $investment->delete();
            
            // Update project total investment
            $project = Project::find($projectId);
            if ($project) {
                $project->total_investment = $project->investments()->sum('amount');
                $project->save();
            }
            
            // Update investor total investment
            $investor = Investor::find($investorId);
            if ($investor) {
                $investor->total_investment = $investor->investments()->sum('amount');
                $investor->save();
            }
        });

        return response()->json([
            'success' => true,
            'message' => 'Investment deleted successfully'
        ]);
    }

    /**
     * Get investments by project
     */
    public function byProject(string $projectId): JsonResponse
    {
        $investments = Investment::with('investor')
            ->where('project_id', $projectId)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $investments
        ]);
    }

    /**
     * Get investments by investor
     */
    public function byInvestor(string $investorId): JsonResponse
    {
        $investments = Investment::with('project')
            ->where('investor_id', $investorId)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $investments
        ]);
    }
}
