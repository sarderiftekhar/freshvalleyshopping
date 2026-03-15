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
            ['name' => 'Fresh Meat', 'image' => '/assets/img/catagory/category-6.jpg', 'sort_order' => 1],
            ['name' => 'Fresh Fish', 'image' => '/assets/img/catagory/category-8.jpg', 'sort_order' => 2],
            ['name' => 'Vegetables', 'image' => '/assets/img/catagory/category-1.jpg', 'sort_order' => 3],
            ['name' => 'Fresh Fruits', 'image' => '/assets/img/catagory/category-2.jpg', 'sort_order' => 4],
            ['name' => 'Rice & Grains', 'image' => '/assets/img/catagory/category-5.jpg', 'sort_order' => 5],
            ['name' => 'Spices & Herbs', 'image' => '/assets/img/catagory/category-9.jpg', 'sort_order' => 6],
            ['name' => 'Dairy & Eggs', 'image' => '/assets/img/catagory/category-7.jpg', 'sort_order' => 7],
            ['name' => 'Frozen Foods', 'image' => '/assets/img/catagory/category-3.jpg', 'sort_order' => 8],
            ['name' => 'Snacks & Drinks', 'image' => '/assets/img/catagory/category-4.jpg', 'sort_order' => 9],
            ['name' => 'Bakery', 'image' => '/assets/img/catagory/category-10.jpg', 'sort_order' => 10],
        ];

        foreach ($categories as $category) {
            Category::create([
                'name' => $category['name'],
                'slug' => Str::slug($category['name']),
                'image' => $category['image'],
                'sort_order' => $category['sort_order'],
                'is_active' => true,
            ]);
        }
    }
}
