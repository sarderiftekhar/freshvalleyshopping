<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Grocery', 'sort_order' => 1],
            ['name' => 'Rice & Grains', 'sort_order' => 2],
            ['name' => 'Live Fish', 'sort_order' => 3],
            ['name' => 'Frozen Prepared Foods', 'sort_order' => 4],
            ['name' => 'Fresh Vegetables', 'sort_order' => 5],
            ['name' => 'Fresh Meat & Chicken', 'sort_order' => 6],
            ['name' => 'Biscuits', 'sort_order' => 7],
            ['name' => 'Seasonal Fruits', 'sort_order' => 8],
            ['name' => 'Chilled Foods', 'sort_order' => 9],
            ['name' => 'Frozen Fruit & Veg', 'sort_order' => 10],
            ['name' => 'Drinks', 'sort_order' => 11],
            ['name' => 'Dry Fruits & Nuts', 'sort_order' => 12],
            ['name' => 'Tea & Coffee', 'sort_order' => 13],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(
                ['slug' => Str::slug($category['name'])],
                [
                    'name' => $category['name'],
                    'image' => null,
                    'sort_order' => $category['sort_order'],
                    'is_active' => true,
                ]
            );
        }
    }
}
