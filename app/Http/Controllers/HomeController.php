<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $categories = Category::active()
            ->topLevel()
            ->orderBy('sort_order')
            ->withCount(['products' => fn($q) => $q->where('status', 'published')])
            ->get();

        $featuredProducts = Product::published()
            ->featured()
            ->with(['category', 'primaryImage'])
            ->orderBy('sort_order')
            ->take(10)
            ->get()
            ->append(['discount_percent', 'effective_price']);

        $latestProducts = Product::published()
            ->with(['category', 'primaryImage'])
            ->latest()
            ->take(12)
            ->get()
            ->append(['discount_percent', 'effective_price']);

        return Inertia::render('Home', [
            'categories' => $categories,
            'featuredProducts' => $featuredProducts,
            'latestProducts' => $latestProducts,
        ]);
    }
}
