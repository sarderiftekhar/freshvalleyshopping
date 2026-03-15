<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShopController extends Controller
{
    public function index(Request $request)
    {
        $categories = Category::active()
            ->topLevel()
            ->orderBy('sort_order')
            ->withCount(['products' => fn($q) => $q->where('status', 'published')])
            ->get();

        $products = Product::published()
            ->with(['category', 'primaryImage'])
            ->when($request->category, function ($query, $slug) {
                $query->whereHas('category', fn($q) => $q->where('slug', $slug));
            })
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->when($request->sort, function ($query, $sort) {
                match ($sort) {
                    'price_asc' => $query->orderByRaw('COALESCE(sale_price, price) ASC'),
                    'price_desc' => $query->orderByRaw('COALESCE(sale_price, price) DESC'),
                    'newest' => $query->latest(),
                    'name' => $query->orderBy('title'),
                    default => $query->orderBy('sort_order'),
                };
            }, fn($query) => $query->orderBy('sort_order'))
            ->paginate(12)
            ->withQueryString();

        $products->getCollection()->each->append(['discount_percent', 'effective_price']);

        return Inertia::render('Shop', [
            'categories' => $categories,
            'products' => $products,
            'filters' => $request->only(['category', 'search', 'sort']),
        ]);
    }

    public function show(string $slug)
    {
        $product = Product::where('slug', $slug)
            ->published()
            ->with(['category', 'images'])
            ->firstOrFail()
            ->append(['discount_percent', 'effective_price']);

        $relatedProducts = Product::published()
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->with(['category', 'primaryImage'])
            ->take(6)
            ->get()
            ->append(['discount_percent', 'effective_price']);

        return Inertia::render('ProductDetail', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
        ]);
    }
}
