<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Investor;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class InvestorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $investors = Investor::with('investments.project')->get();
        
        return response()->json([
            'success' => true,
            'data' => $investors
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:investors,email',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
        ]);

        $investor = Investor::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Investor created successfully',
            'data' => $investor
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $investor = Investor::with(['investments.project'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $investor,
            'total_investment' => $investor->getTotalInvestmentAmount(),
            'investments_by_project' => $investor->getInvestmentsByProject()
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $investor = Investor::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:investors,email,' . $id,
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'is_active' => 'sometimes|boolean',
        ]);

        $investor->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Investor updated successfully',
            'data' => $investor
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $investor = Investor::findOrFail($id);
        $investor->delete();

        return response()->json([
            'success' => true,
            'message' => 'Investor deleted successfully'
        ]);
    }
}
