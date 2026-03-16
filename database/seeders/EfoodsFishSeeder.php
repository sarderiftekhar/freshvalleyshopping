<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class EfoodsFishSeeder extends Seeder
{
    public function run(): void
    {
        $json = file_get_contents(database_path('data/efoods_fish_products.json'));
        $items = json_decode($json, true);

        $categoryCache = [];
        $seenSlugs = [];
        $imported = 0;
        $skipped = 0;

        foreach ($items as $index => $data) {
            // Skip duplicate slugs
            if (in_array($data['slug'], $seenSlugs)) {
                $skipped++;
                continue;
            }
            $seenSlugs[] = $data['slug'];
            $catName = $data['categoryName'];

            if (!isset($categoryCache[$catName])) {
                $categoryCache[$catName] = Category::where('name', $catName)->first();
            }

            $category = $categoryCache[$catName];
            if (!$category) {
                $this->command->warn("Category not found: {$catName} — skipping {$data['name']}");
                $skipped++;
                continue;
            }

            $sku = 'EF-' . str_pad($index + 1, 4, '0', STR_PAD_LEFT);

            $price = max((float) $data['price'], 0.01);
            $salePrice = !empty($data['salePrice']) ? (float) $data['salePrice'] : null;

            $status = 'published';
            if (!empty($data['outOfStock'])) {
                $status = 'out_of_stock';
            } elseif ($price <= 0.01) {
                $status = 'draft';
            }

            $product = Product::updateOrCreate(
                ['sku' => $sku],
                [
                    'slug' => $data['slug'],
                    'title' => $data['name'],
                    'price' => $price,
                    'sale_price' => $salePrice,
                    'category_id' => $category->id,
                    'brand' => $data['brand'] ?: null,
                    'quantity' => rand(20, 150),
                    'unit' => $data['unit'] ?? 'KG',
                    'description' => $data['description'],
                    'tags' => $data['tags'] ?? [],
                    'is_halal_certified' => true,
                    'halal_certification_body' => 'HMC',
                    'status' => $status,
                    'sold' => rand(0, 30),
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

            $imported++;
        }

        $this->command->info("Imported {$imported} eFoods fish products ({$skipped} skipped).");
    }
}
