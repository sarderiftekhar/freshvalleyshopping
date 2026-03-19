<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InventoryController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Product::with('category')
            ->where('track_stock', true)
            ->select('id', 'title', 'sku', 'barcode', 'quantity', 'low_stock_threshold', 'status', 'category_id');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        if ($request->input('low_stock_only')) {
            $query->lowStock();
        }

        $query->orderBy('quantity', 'asc');

        return Inertia::render('Admin/Inventory/Index', [
            'products' => $query->paginate(30)->withQueryString(),
            'filters' => $request->only(['search', 'low_stock_only']),
            'lowStockCount' => Product::lowStock()->count(),
        ]);
    }

    public function adjust(Request $request, Product $product)
    {
        $validated = $request->validate([
            'adjustment' => 'required|integer',
            'reason' => 'nullable|string|max:255',
        ]);

        $oldQuantity = $product->quantity;
        $newQuantity = max(0, $product->quantity + $validated['adjustment']);
        $product->update(['quantity' => $newQuantity]);

        ActivityLog::log('inventory.adjusted', $product, [
            'title' => $product->title,
            'old_quantity' => $oldQuantity,
            'new_quantity' => $newQuantity,
            'adjustment' => $validated['adjustment'],
            'reason' => $validated['reason'] ?? null,
        ]);

        return back()->with('success', "Stock updated: {$product->title} ({$oldQuantity} → {$newQuantity})");
    }
}
