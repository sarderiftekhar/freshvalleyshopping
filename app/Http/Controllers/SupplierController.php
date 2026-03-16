<?php

namespace App\Http\Controllers;

use App\Models\SupplierCategory;
use App\Models\SupplierProduct;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class SupplierController extends Controller
{
    public function dashboard()
    {
        $categories = SupplierCategory::active()
            ->withCount(['products', 'products as active_products_count' => function ($q) {
                $q->where('is_active', true);
            }])
            ->orderBy('sort_order')
            ->get();

        $totalProducts = SupplierProduct::count();
        $activeProducts = SupplierProduct::active()->count();

        return Inertia::render('Supplier/Dashboard', [
            'categories' => $categories,
            'totalProducts' => $totalProducts,
            'activeProducts' => $activeProducts,
        ]);
    }

    public function products(Request $request)
    {
        $query = SupplierProduct::with('category');

        if ($request->filled('category')) {
            $query->where('supplier_category_id', $request->category);
        }

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $products = $query->orderBy('supplier_category_id')
            ->orderBy('sort_order')
            ->paginate(50)
            ->withQueryString();

        $categories = SupplierCategory::active()
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('Supplier/Products/Index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $request->only(['category', 'search']),
        ]);
    }

    public function createProduct()
    {
        $categories = SupplierCategory::active()->orderBy('sort_order')->get();

        return Inertia::render('Supplier/Products/Create', [
            'categories' => $categories,
        ]);
    }

    public function storeProduct(Request $request)
    {
        $validated = $request->validate([
            'supplier_category_id' => 'required|exists:supplier_categories,id',
            'name' => 'required|string|max:255',
            'unit' => 'required|string|max:50',
            'base_price' => 'required|numeric|min:0.01',
            'bulk_price' => 'nullable|numeric|min:0',
            'bulk_unit' => 'nullable|string|max:100',
            'notes' => 'nullable|string|max:500',
            'is_active' => 'boolean',
        ]);

        $validated['is_active'] = $request->boolean('is_active', true);

        SupplierProduct::create($validated);

        return redirect()->route('supplier.products')->with('success', 'Product created successfully.');
    }

    public function editProduct(SupplierProduct $supplierProduct)
    {
        $categories = SupplierCategory::active()->orderBy('sort_order')->get();

        return Inertia::render('Supplier/Products/Edit', [
            'product' => $supplierProduct->load('category'),
            'categories' => $categories,
        ]);
    }

    public function updateProduct(Request $request, SupplierProduct $supplierProduct)
    {
        $validated = $request->validate([
            'supplier_category_id' => 'required|exists:supplier_categories,id',
            'name' => 'required|string|max:255',
            'unit' => 'required|string|max:50',
            'base_price' => 'required|numeric|min:0.01',
            'bulk_price' => 'nullable|numeric|min:0',
            'bulk_unit' => 'nullable|string|max:100',
            'notes' => 'nullable|string|max:500',
            'is_active' => 'boolean',
        ]);

        $validated['is_active'] = $request->boolean('is_active', true);

        $supplierProduct->update($validated);

        return redirect()->route('supplier.products')->with('success', 'Product updated successfully.');
    }

    public function destroyProduct(SupplierProduct $supplierProduct)
    {
        $supplierProduct->delete();

        return redirect()->route('supplier.products')->with('success', 'Product deleted successfully.');
    }

    // Category CRUD
    public function categories()
    {
        $categories = SupplierCategory::withCount('products')
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('Supplier/Categories/Index', [
            'categories' => $categories,
        ]);
    }

    public function storeCategory(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'emoji' => 'nullable|string|max:10',
            'sort_order' => 'integer|min:0',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        SupplierCategory::create($validated);

        return redirect()->route('supplier.categories')->with('success', 'Category created.');
    }

    public function updateCategory(Request $request, SupplierCategory $supplierCategory)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'emoji' => 'nullable|string|max:10',
            'sort_order' => 'integer|min:0',
            'is_active' => 'boolean',
        ]);

        $validated['slug'] = Str::slug($validated['name']);
        $validated['is_active'] = $request->boolean('is_active', true);

        $supplierCategory->update($validated);

        return redirect()->route('supplier.categories')->with('success', 'Category updated.');
    }

    public function destroyCategory(SupplierCategory $supplierCategory)
    {
        $supplierCategory->delete();

        return redirect()->route('supplier.categories')->with('success', 'Category deleted.');
    }

    // Inline update for quick price changes
    public function quickUpdate(Request $request, SupplierProduct $supplierProduct)
    {
        $validated = $request->validate([
            'base_price' => 'sometimes|numeric|min:0.01',
            'bulk_price' => 'sometimes|nullable|numeric|min:0',
            'is_active' => 'sometimes|boolean',
        ]);

        $supplierProduct->update($validated);

        return back()->with('success', 'Updated successfully.');
    }
}
