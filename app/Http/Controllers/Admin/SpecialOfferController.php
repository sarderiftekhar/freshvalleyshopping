<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Product;
use App\Models\SpecialOffer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class SpecialOfferController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Offers/Index', [
            'offers' => SpecialOffer::withCount('products')
                ->latest()
                ->paginate(20),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Offers/Create', [
            'products' => Product::published()
                ->orderBy('title')
                ->get(['id', 'title', 'sku', 'price']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:percentage,fixed,buy_x_get_y,bundle',
            'discount_value' => 'nullable|numeric|min:0',
            'buy_quantity' => 'nullable|integer|min:1',
            'get_quantity' => 'nullable|integer|min:1',
            'minimum_order' => 'nullable|numeric|min:0',
            'starts_at' => 'required|date',
            'ends_at' => 'nullable|date|after:starts_at',
            'is_active' => 'boolean',
            'banner_image' => 'nullable|image|max:2048',
            'product_ids' => 'nullable|array',
            'product_ids.*' => 'integer|exists:products,id',
        ]);

        $validated['slug'] = Str::slug($validated['title']);

        if ($request->hasFile('banner_image')) {
            $validated['banner_image'] = $request->file('banner_image')->store('offers', 'public');
        }

        $offer = SpecialOffer::create($validated);

        if (!empty($validated['product_ids'])) {
            $offer->products()->attach($validated['product_ids']);
        }

        ActivityLog::log('offer.created', $offer, ['title' => $offer->title]);

        return redirect()->route('admin.offers.index')
            ->with('success', 'Special offer created successfully.');
    }

    public function edit(SpecialOffer $offer): Response
    {
        return Inertia::render('Admin/Offers/Edit', [
            'offer' => $offer->load('products:id,title,sku,price'),
            'products' => Product::published()
                ->orderBy('title')
                ->get(['id', 'title', 'sku', 'price']),
        ]);
    }

    public function update(Request $request, SpecialOffer $offer)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:percentage,fixed,buy_x_get_y,bundle',
            'discount_value' => 'nullable|numeric|min:0',
            'buy_quantity' => 'nullable|integer|min:1',
            'get_quantity' => 'nullable|integer|min:1',
            'minimum_order' => 'nullable|numeric|min:0',
            'starts_at' => 'required|date',
            'ends_at' => 'nullable|date|after:starts_at',
            'is_active' => 'boolean',
            'banner_image' => 'nullable|image|max:2048',
            'product_ids' => 'nullable|array',
            'product_ids.*' => 'integer|exists:products,id',
        ]);

        if ($request->hasFile('banner_image')) {
            if ($offer->banner_image) {
                Storage::disk('public')->delete($offer->banner_image);
            }
            $validated['banner_image'] = $request->file('banner_image')->store('offers', 'public');
        }

        $offer->update($validated);
        $offer->products()->sync($validated['product_ids'] ?? []);

        ActivityLog::log('offer.updated', $offer, ['title' => $offer->title]);

        return redirect()->route('admin.offers.index')
            ->with('success', 'Special offer updated successfully.');
    }

    public function destroy(SpecialOffer $offer)
    {
        if ($offer->banner_image) {
            Storage::disk('public')->delete($offer->banner_image);
        }

        $title = $offer->title;
        $offer->delete();

        ActivityLog::log('offer.deleted', null, ['title' => $title]);

        return redirect()->route('admin.offers.index')
            ->with('success', 'Special offer deleted successfully.');
    }
}
