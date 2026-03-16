<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Clear old products to avoid slug conflicts on re-seed
        ProductImage::query()->delete();
        Product::query()->delete();

        $json = file_get_contents(database_path('data/scraped_products.json'));
        $items = json_decode($json, true);

        $categoryCache = [];

        foreach ($items as $index => $data) {
            $catName = $data['categoryName'];

            if (!isset($categoryCache[$catName])) {
                $categoryCache[$catName] = Category::where('name', $catName)->first();
            }

            $category = $categoryCache[$catName];
            if (!$category) {
                continue;
            }

            $sku = 'FV-' . str_pad($index + 1, 4, '0', STR_PAD_LEFT);

            $product = Product::updateOrCreate(
                ['sku' => $sku],
                [
                    'slug' => $data['slug'],
                    'title' => $data['name'],
                    'price' => max($data['price'], 0.01),
                    'sale_price' => null,
                    'category_id' => $category->id,
                    'brand' => null,
                    'quantity' => rand(50, 200),
                    'unit' => $data['unit'],
                    'description' => $data['description'],
                    'tags' => $data['tags'] ?? [],
                    'is_halal_certified' => true,
                    'halal_certification_body' => 'HMC',
                    'status' => $data['price'] > 0 ? 'published' : 'draft',
                    'sold' => rand(0, 50),
                    'sort_order' => $index,
                    'is_featured' => $data['is_featured'] ?? false,
                ]
            );

            $imagePath = $data['localImage'] ?? $data['remoteImage'] ?? null;
            if ($imagePath) {
                ProductImage::updateOrCreate(
                    ['product_id' => $product->id, 'is_primary' => true],
                    ['path' => $imagePath, 'sort_order' => 0]
                );
            }
        }
    }
}
