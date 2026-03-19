<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response|\Illuminate\Http\RedirectResponse
    {
        // Restore saved filters if returning with no query params (e.g. after edit/view)
        $filterKeys = ['search', 'category_id', 'brand_id', 'status', 'stock', 'featured', 'price_min', 'price_max', 'sort', 'direction'];
        if ($request->has('reset')) {
            $request->session()->forget('admin.products.filters');
        } elseif (empty($request->query()) && $request->session()->has('admin.products.filters')) {
            $savedFilters = array_filter($request->session()->get('admin.products.filters'));
            if (!empty($savedFilters)) {
                return redirect()->route('admin.products.index', $savedFilters);
            }
        }

        // Save current filters to session
        $request->session()->put('admin.products.filters', $request->only($filterKeys));

        $query = Product::with(['category', 'brand', 'primaryImage'])
            ->withCount('orderItems');

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%")
                    ->orWhere('barcode', 'like', "%{$search}%");
            });
        }

        if ($categoryId = $request->input('category_id')) {
            $query->where('category_id', $categoryId);
        }

        if ($brandId = $request->input('brand_id')) {
            $query->where('brand_id', $brandId);
        }

        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        if ($stock = $request->input('stock')) {
            match ($stock) {
                'in_stock' => $query->where('quantity', '>', 0),
                'out_of_stock' => $query->where('quantity', 0),
                'low_stock' => $query->lowStock(),
                default => null,
            };
        }

        if ($request->input('featured') === '1') {
            $query->where('is_featured', true);
        }

        if ($priceMin = $request->input('price_min')) {
            $query->where('price', '>=', $priceMin);
        }

        if ($priceMax = $request->input('price_max')) {
            $query->where('price', '<=', $priceMax);
        }

        $sortField = $request->input('sort', 'created_at');
        $sortDir = $request->input('direction', 'desc');
        $query->orderBy($sortField, $sortDir);

        return Inertia::render('Admin/Products/Index', [
            'products' => $query->paginate(20)->withQueryString(),
            'categories' => Category::active()->orderBy('name')->get(['id', 'name']),
            'brands' => Brand::active()->orderBy('name')->get(['id', 'name']),
            'filters' => $request->only($filterKeys),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Products/Create', [
            'categories' => Category::active()
                ->orderBy('name')
                ->get(['id', 'name', 'parent_id']),
            'brands' => Brand::active()
                ->orderBy('name')
                ->get(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'sku' => 'required|string|max:100|unique:products,sku',
            'barcode' => 'nullable|string|max:100',
            'barcode_image' => 'nullable|image|max:2048',
            'price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
            'cost_price' => 'nullable|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'brand_id' => 'nullable|exists:brands,id',
            'quantity' => 'required|integer|min:0',
            'low_stock_threshold' => 'integer|min:0',
            'track_stock' => 'boolean',
            'unit' => 'required|string|max:50',
            'weight' => 'nullable|numeric|min:0',
            'weight_unit' => 'nullable|string|in:g,kg,ml,l,oz,lb,pcs',
            'expiry_date' => 'nullable|date',
            'description' => 'required|string',
            'tags' => 'nullable|array',
            'is_halal_certified' => 'boolean',
            'halal_certification_body' => 'nullable|string|max:255',
            'status' => 'required|in:draft,published,out_of_stock',
            'is_featured' => 'boolean',
            'images' => 'nullable|array',
            'images.*' => 'image|max:2048',
        ]);

        // Handle barcode image upload
        if ($request->hasFile('barcode_image')) {
            $validated['barcode_image'] = $request->file('barcode_image')->store('barcodes', 'public');
        }

        $validated['slug'] = Str::slug($validated['title']);

        // Ensure unique slug
        $originalSlug = $validated['slug'];
        $counter = 1;
        while (Product::where('slug', $validated['slug'])->exists()) {
            $validated['slug'] = $originalSlug . '-' . $counter++;
        }

        $product = Product::create($validated);

        // Handle image uploads
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                $path = $image->store('products', 'public');
                ProductImage::create([
                    'product_id' => $product->id,
                    'path' => $path,
                    'is_primary' => $index === 0,
                    'sort_order' => $index,
                ]);
            }
        }

        ActivityLog::log('product.created', $product, ['title' => $product->title]);

        return redirect()->route('admin.products.index')
            ->with('success', 'Product created successfully.');
    }

    public function edit(Product $product): Response
    {
        return Inertia::render('Admin/Products/Edit', [
            'product' => $product->load(['images', 'variants']),
            'categories' => Category::active()
                ->orderBy('name')
                ->get(['id', 'name', 'parent_id']),
            'brands' => Brand::active()
                ->orderBy('name')
                ->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'sku' => 'required|string|max:100|unique:products,sku,' . $product->id,
            'barcode' => 'nullable|string|max:100',
            'barcode_image' => 'nullable|image|max:2048',
            'remove_barcode_image' => 'nullable|boolean',
            'price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
            'cost_price' => 'nullable|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'brand_id' => 'nullable|exists:brands,id',
            'quantity' => 'required|integer|min:0',
            'low_stock_threshold' => 'integer|min:0',
            'track_stock' => 'boolean',
            'unit' => 'required|string|max:50',
            'weight' => 'nullable|numeric|min:0',
            'weight_unit' => 'nullable|string|in:g,kg,ml,l,oz,lb,pcs',
            'expiry_date' => 'nullable|date',
            'description' => 'required|string',
            'tags' => 'nullable|array',
            'is_halal_certified' => 'boolean',
            'halal_certification_body' => 'nullable|string|max:255',
            'status' => 'required|in:draft,published,out_of_stock',
            'is_featured' => 'boolean',
            'images' => 'nullable|array',
            'images.*' => 'image|max:2048',
            'remove_images' => 'nullable|array',
            'remove_images.*' => 'integer',
        ]);

        // Handle barcode image
        if ($request->hasFile('barcode_image')) {
            if ($product->barcode_image) {
                Storage::disk('public')->delete($product->barcode_image);
            }
            $validated['barcode_image'] = $request->file('barcode_image')->store('barcodes', 'public');
        } elseif ($request->boolean('remove_barcode_image') && $product->barcode_image) {
            Storage::disk('public')->delete($product->barcode_image);
            $validated['barcode_image'] = null;
        }
        unset($validated['remove_barcode_image']);

        // Remove deleted images
        if (!empty($validated['remove_images'])) {
            $imagesToRemove = ProductImage::where('product_id', $product->id)
                ->whereIn('id', $validated['remove_images'])
                ->get();

            foreach ($imagesToRemove as $img) {
                Storage::disk('public')->delete($img->path);
                $img->delete();
            }
        }
        unset($validated['remove_images']);

        $product->update($validated);

        // Handle new image uploads
        if ($request->hasFile('images')) {
            $maxSort = $product->images()->max('sort_order') ?? -1;
            $hasPrimary = $product->images()->where('is_primary', true)->exists();

            foreach ($request->file('images') as $index => $image) {
                $path = $image->store('products', 'public');
                ProductImage::create([
                    'product_id' => $product->id,
                    'path' => $path,
                    'is_primary' => !$hasPrimary && $index === 0,
                    'sort_order' => $maxSort + $index + 1,
                ]);
            }
        }

        ActivityLog::log('product.updated', $product, ['title' => $product->title]);

        return redirect()->route('admin.products.index')
            ->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product)
    {
        // Delete associated images from storage
        foreach ($product->images as $image) {
            Storage::disk('public')->delete($image->path);
        }

        $title = $product->title;
        $product->delete();

        ActivityLog::log('product.deleted', null, ['title' => $title]);

        return redirect()->route('admin.products.index')
            ->with('success', 'Product deleted successfully.');
    }

    public function bulkAction(Request $request)
    {
        $validated = $request->validate([
            'action' => 'required|in:publish,draft,out_of_stock,delete',
            'product_ids' => 'required|array',
            'product_ids.*' => 'integer|exists:products,id',
        ]);

        $products = Product::whereIn('id', $validated['product_ids']);

        if ($validated['action'] === 'delete') {
            $products->each(function ($product) {
                foreach ($product->images as $image) {
                    Storage::disk('public')->delete($image->path);
                }
                $product->delete();
            });
            $message = count($validated['product_ids']) . ' products deleted.';
        } else {
            $statusMap = [
                'publish' => 'published',
                'draft' => 'draft',
                'out_of_stock' => 'out_of_stock',
            ];
            $products->update(['status' => $statusMap[$validated['action']]]);
            $message = count($validated['product_ids']) . ' products updated.';
        }

        ActivityLog::log('product.bulk_action', null, [
            'action' => $validated['action'],
            'count' => count($validated['product_ids']),
        ]);

        return back()->with('success', $message);
    }

    public function generateSku(Request $request)
    {
        $title = $request->input('title', '');
        $prefix = 'FV';

        // Take first 3 consonants/letters from title, uppercase
        $clean = preg_replace('/[^a-zA-Z]/', '', $title);
        $code = strtoupper(substr($clean, 0, 3));
        if (strlen($code) < 3) {
            $code = str_pad($code, 3, 'X');
        }

        // Generate unique SKU
        do {
            $sku = $prefix . '-' . $code . '-' . str_pad(random_int(0, 9999), 4, '0', STR_PAD_LEFT);
        } while (Product::where('sku', $sku)->exists());

        return response()->json(['sku' => $sku]);
    }

    public function export(Request $request)
    {
        $products = Product::with('category')
            ->orderBy('title')
            ->get();

        $csv = "SKU,Barcode,Title,Category,Price,Sale Price,Cost Price,Quantity,Unit,Status,Featured\n";
        foreach ($products as $p) {
            $csv .= implode(',', [
                $p->sku,
                $p->barcode ?? '',
                '"' . str_replace('"', '""', $p->title) . '"',
                '"' . ($p->category?->name ?? '') . '"',
                $p->price,
                $p->sale_price ?? '',
                $p->cost_price ?? '',
                $p->quantity,
                $p->unit,
                $p->status,
                $p->is_featured ? 'Yes' : 'No',
            ]) . "\n";
        }

        return response($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="products-' . date('Y-m-d') . '.csv"',
        ]);
    }
}
