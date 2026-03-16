<?php

namespace Database\Seeders;

use App\Models\SupplierCategory;
use App\Models\SupplierProduct;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class SupplierSeeder extends Seeder
{
    public function run(): void
    {
        // Create supplier user
        User::updateOrCreate(
            ['email' => 'supplier@freshvalleyshopping.com'],
            [
                'name' => 'Fresh Valley Supplier',
                'email_verified_at' => now(),
                'password' => Hash::make('Valley2026'),
                'role' => 'supplier',
            ]
        );

        // Also update admin role
        User::where('email', 'admin@freshvalley.co.uk')->update(['role' => 'admin']);

        $categories = [
            [
                'name' => 'Fresh Vegetables & Herbs',
                'emoji' => '🥬',
                'sort_order' => 1,
                'products' => [
                    ['name' => 'Coriander (bunch)', 'unit' => 'bunch', 'base_price' => 0.60, 'bulk_price' => 4.50, 'bulk_unit' => '10 bunches'],
                    ['name' => 'Fresh Mint (bunch)', 'unit' => 'bunch', 'base_price' => 0.60, 'bulk_price' => 4.50, 'bulk_unit' => '10 bunches'],
                    ['name' => 'Green Chilli', 'unit' => 'per 100g', 'base_price' => 0.50, 'bulk_price' => 3.50, 'bulk_unit' => 'per kg'],
                    ['name' => 'Red Chilli', 'unit' => 'per 100g', 'base_price' => 0.60, 'bulk_price' => 4.00, 'bulk_unit' => 'per kg'],
                    ['name' => 'Fresh Ginger', 'unit' => 'per 100g', 'base_price' => 0.45, 'bulk_price' => 3.80, 'bulk_unit' => 'per kg'],
                    ['name' => 'Garlic (whole)', 'unit' => 'per 100g', 'base_price' => 0.40, 'bulk_price' => 3.20, 'bulk_unit' => 'per kg'],
                    ['name' => 'Spring Onion', 'unit' => 'bunch', 'base_price' => 0.55, 'bulk_price' => 4.00, 'bulk_unit' => '10 bunches'],
                    ['name' => 'Brown Onion', 'unit' => 'per kg', 'base_price' => 0.85, 'bulk_price' => 7.50, 'bulk_unit' => '10kg sack'],
                    ['name' => 'Red Onion', 'unit' => 'per kg', 'base_price' => 1.00, 'bulk_price' => 8.50, 'bulk_unit' => '10kg sack'],
                    ['name' => 'Potato', 'unit' => 'per kg', 'base_price' => 0.70, 'bulk_price' => 5.50, 'bulk_unit' => '10kg sack'],
                    ['name' => 'Sweet Potato', 'unit' => 'per kg', 'base_price' => 1.50, 'bulk_price' => 12.00, 'bulk_unit' => '10kg box'],
                    ['name' => 'Tomato', 'unit' => 'per kg', 'base_price' => 1.20, 'bulk_price' => 9.50, 'bulk_unit' => '10kg box'],
                    ['name' => 'Cucumber', 'unit' => 'each', 'base_price' => 0.55, 'bulk_price' => 4.50, 'bulk_unit' => '10 pack'],
                    ['name' => 'Aubergine (Brinjal)', 'unit' => 'per kg', 'base_price' => 1.80, 'bulk_price' => 14.00, 'bulk_unit' => '10kg box'],
                    ['name' => 'Okra (Bhindi)', 'unit' => 'per 500g', 'base_price' => 1.50, 'bulk_price' => 5.50, 'bulk_unit' => 'per 2kg'],
                    ['name' => 'Bitter Gourd (Karela)', 'unit' => 'per 500g', 'base_price' => 1.80, 'bulk_price' => 6.50, 'bulk_unit' => 'per 2kg'],
                    ['name' => 'Bottle Gourd (Lauki)', 'unit' => 'each', 'base_price' => 1.50, 'bulk_price' => 12.00, 'bulk_unit' => '10 pack'],
                    ['name' => 'Ridge Gourd (Turai)', 'unit' => 'per 500g', 'base_price' => 1.60, 'bulk_price' => 5.80, 'bulk_unit' => 'per 2kg'],
                    ['name' => 'Tinda (Apple Gourd)', 'unit' => 'per 500g', 'base_price' => 1.70, 'bulk_price' => 6.00, 'bulk_unit' => 'per 2kg'],
                    ['name' => 'Pointed Gourd (Parwal)', 'unit' => 'per 500g', 'base_price' => 2.00, 'bulk_price' => 7.00, 'bulk_unit' => 'per 2kg'],
                    ['name' => 'Green Papaya', 'unit' => 'each', 'base_price' => 1.80, 'bulk_price' => 15.00, 'bulk_unit' => '10 pack'],
                    ['name' => 'Raw Banana (Kachha Kela)', 'unit' => 'per kg', 'base_price' => 1.60, 'bulk_price' => 13.00, 'bulk_unit' => '10kg box'],
                    ['name' => 'Plantain', 'unit' => 'each', 'base_price' => 0.60, 'bulk_price' => 5.00, 'bulk_unit' => '10 pack'],
                    ['name' => 'Spinach (Palak)', 'unit' => 'bunch', 'base_price' => 0.80, 'bulk_price' => 6.00, 'bulk_unit' => '10 bunches'],
                    ['name' => 'Amaranth Leaves (Lal Shak)', 'unit' => 'bunch', 'base_price' => 0.90, 'bulk_price' => 7.00, 'bulk_unit' => '10 bunches'],
                    ['name' => 'Fenugreek Leaves (Methi)', 'unit' => 'bunch', 'base_price' => 0.80, 'bulk_price' => 6.00, 'bulk_unit' => '10 bunches'],
                    ['name' => 'Curry Leaves', 'unit' => 'pack', 'base_price' => 0.50, 'bulk_price' => 3.50, 'bulk_unit' => '10 packs'],
                    ['name' => 'Lime', 'unit' => 'per pack (4)', 'base_price' => 0.60, 'bulk_price' => 4.50, 'bulk_unit' => '10 packs'],
                    ['name' => 'Lemon', 'unit' => 'per pack (4)', 'base_price' => 0.50, 'bulk_price' => 3.80, 'bulk_unit' => '10 packs'],
                    ['name' => 'Coconut (whole)', 'unit' => 'each', 'base_price' => 1.20, 'bulk_price' => 10.00, 'bulk_unit' => '10 pack'],
                ],
            ],
            [
                'name' => 'Fresh Fruit',
                'emoji' => '🍌',
                'sort_order' => 2,
                'products' => [
                    ['name' => 'Banana', 'unit' => 'per bunch', 'base_price' => 0.80, 'bulk_price' => 6.50, 'bulk_unit' => '10 bunches'],
                    ['name' => 'Mango (seasonal)', 'unit' => 'each', 'base_price' => 1.50, 'bulk_price' => 12.00, 'bulk_unit' => 'box of 10'],
                    ['name' => 'Apple', 'unit' => 'per kg', 'base_price' => 1.80, 'bulk_price' => 14.00, 'bulk_unit' => '10kg box'],
                    ['name' => 'Orange', 'unit' => 'per kg', 'base_price' => 1.50, 'bulk_price' => 12.00, 'bulk_unit' => '10kg box'],
                    ['name' => 'Grapes', 'unit' => 'per 500g', 'base_price' => 1.80, 'bulk_price' => 6.50, 'bulk_unit' => 'per 2kg'],
                    ['name' => 'Pomegranate', 'unit' => 'each', 'base_price' => 1.20, 'bulk_price' => 10.00, 'bulk_unit' => '10 pack'],
                    ['name' => 'Guava (seasonal)', 'unit' => 'per kg', 'base_price' => 2.50, 'bulk_price' => 20.00, 'bulk_unit' => '10kg box'],
                    ['name' => 'Papaya', 'unit' => 'each', 'base_price' => 1.80, 'bulk_price' => 15.00, 'bulk_unit' => '10 pack'],
                    ['name' => 'Pineapple', 'unit' => 'each', 'base_price' => 1.50, 'bulk_price' => 12.00, 'bulk_unit' => '10 pack'],
                    ['name' => 'Watermelon (seasonal)', 'unit' => 'each', 'base_price' => 3.50, 'bulk_price' => 28.00, 'bulk_unit' => '10 pack'],
                ],
            ],
            [
                'name' => 'Halal Meat',
                'emoji' => '🥩',
                'sort_order' => 3,
                'products' => [
                    ['name' => 'Chicken Whole', 'unit' => 'per kg', 'base_price' => 3.50, 'bulk_price' => 30.00, 'bulk_unit' => '10kg box'],
                    ['name' => 'Chicken Breast', 'unit' => 'per kg', 'base_price' => 5.50, 'bulk_price' => 48.00, 'bulk_unit' => '10kg box'],
                    ['name' => 'Chicken Thighs', 'unit' => 'per kg', 'base_price' => 4.00, 'bulk_price' => 35.00, 'bulk_unit' => '10kg box'],
                    ['name' => 'Chicken Wings', 'unit' => 'per kg', 'base_price' => 3.00, 'bulk_price' => 25.00, 'bulk_unit' => '10kg box'],
                    ['name' => 'Chicken Drumsticks', 'unit' => 'per kg', 'base_price' => 3.50, 'bulk_price' => 30.00, 'bulk_unit' => '10kg box'],
                    ['name' => 'Minced Chicken', 'unit' => 'per 500g', 'base_price' => 3.00, 'bulk_price' => 50.00, 'bulk_unit' => '10kg box'],
                    ['name' => 'Lamb Shoulder', 'unit' => 'per kg', 'base_price' => 9.50, 'bulk_price' => 85.00, 'bulk_unit' => '10kg box'],
                    ['name' => 'Lamb Leg', 'unit' => 'per kg', 'base_price' => 10.50, 'bulk_price' => 95.00, 'bulk_unit' => '10kg box'],
                    ['name' => 'Lamb Chops', 'unit' => 'per kg', 'base_price' => 11.00, 'bulk_price' => 100.00, 'bulk_unit' => '10kg box'],
                    ['name' => 'Minced Lamb', 'unit' => 'per 500g', 'base_price' => 5.00, 'bulk_price' => 90.00, 'bulk_unit' => '10kg box'],
                    ['name' => 'Goat Curry Cut', 'unit' => 'per kg', 'base_price' => 10.00, 'bulk_price' => 90.00, 'bulk_unit' => '10kg box'],
                    ['name' => 'Goat Ribs', 'unit' => 'per kg', 'base_price' => 9.00, 'bulk_price' => 80.00, 'bulk_unit' => '10kg box'],
                    ['name' => 'Beef Mince', 'unit' => 'per 500g', 'base_price' => 3.50, 'bulk_price' => 60.00, 'bulk_unit' => '10kg box'],
                    ['name' => 'Beef Curry Cut', 'unit' => 'per kg', 'base_price' => 7.50, 'bulk_price' => 65.00, 'bulk_unit' => '10kg box'],
                    ['name' => 'Beef Liver', 'unit' => 'per kg', 'base_price' => 4.00, 'bulk_price' => 35.00, 'bulk_unit' => '10kg box'],
                    ['name' => 'Chicken Liver', 'unit' => 'per kg', 'base_price' => 3.00, 'bulk_price' => 25.00, 'bulk_unit' => '10kg box'],
                    ['name' => 'Soup Bones', 'unit' => 'per kg', 'base_price' => 2.50, 'bulk_price' => 20.00, 'bulk_unit' => '10kg box'],
                    ['name' => 'Mixed Meat Bundle', 'unit' => 'per 5kg', 'base_price' => 35.00, 'bulk_price' => null, 'bulk_unit' => null, 'notes' => 'Chicken, lamb & beef mix'],
                ],
            ],
            [
                'name' => 'Fish & Seafood',
                'emoji' => '🐟',
                'sort_order' => 4,
                'products' => [
                    ['name' => 'Rohu Fish', 'unit' => 'per kg', 'base_price' => 6.00, 'bulk_price' => 50.00, 'bulk_unit' => '10kg box'],
                    ['name' => 'Hilsa (seasonal)', 'unit' => 'per kg', 'base_price' => 14.00, 'bulk_price' => 120.00, 'bulk_unit' => '10kg box', 'notes' => 'Seasonal availability'],
                    ['name' => 'Tilapia', 'unit' => 'per kg', 'base_price' => 4.50, 'bulk_price' => 38.00, 'bulk_unit' => '10kg box'],
                    ['name' => 'Sea Bass (whole)', 'unit' => 'per kg', 'base_price' => 7.50, 'bulk_price' => 65.00, 'bulk_unit' => '10kg box'],
                    ['name' => 'Sea Bream', 'unit' => 'per kg', 'base_price' => 7.00, 'bulk_price' => 60.00, 'bulk_unit' => '10kg box'],
                    ['name' => 'Mackerel', 'unit' => 'per kg', 'base_price' => 4.00, 'bulk_price' => 35.00, 'bulk_unit' => '10kg box'],
                    ['name' => 'Sardines', 'unit' => 'per kg', 'base_price' => 3.50, 'bulk_price' => 28.00, 'bulk_unit' => '10kg box'],
                    ['name' => 'Salmon Fillet', 'unit' => 'per kg', 'base_price' => 12.00, 'bulk_price' => 100.00, 'bulk_unit' => '10kg box'],
                    ['name' => 'Cod Fillet', 'unit' => 'per kg', 'base_price' => 10.00, 'bulk_price' => 85.00, 'bulk_unit' => '10kg box'],
                    ['name' => 'Haddock Fillet', 'unit' => 'per kg', 'base_price' => 9.50, 'bulk_price' => 80.00, 'bulk_unit' => '10kg box'],
                    ['name' => 'King Prawns', 'unit' => 'per 500g', 'base_price' => 5.50, 'bulk_price' => 95.00, 'bulk_unit' => '10kg box'],
                    ['name' => 'Tiger Prawns', 'unit' => 'per 500g', 'base_price' => 6.00, 'bulk_price' => 105.00, 'bulk_unit' => '10kg box'],
                    ['name' => 'Small Prawns', 'unit' => 'per 500g', 'base_price' => 3.50, 'bulk_price' => 55.00, 'bulk_unit' => '10kg box'],
                    ['name' => 'Squid', 'unit' => 'per kg', 'base_price' => 5.00, 'bulk_price' => 42.00, 'bulk_unit' => '10kg box'],
                    ['name' => 'Mussels', 'unit' => 'per kg', 'base_price' => 4.00, 'bulk_price' => 32.00, 'bulk_unit' => '10kg box'],
                    ['name' => 'Crab (seasonal)', 'unit' => 'each', 'base_price' => 5.00, 'bulk_price' => 40.00, 'bulk_unit' => '10 pack', 'notes' => 'Seasonal availability'],
                ],
            ],
            [
                'name' => 'Frozen Foods',
                'emoji' => '🧊',
                'sort_order' => 5,
                'products' => [
                    ['name' => 'Frozen Paratha (Plain)', 'unit' => 'pack of 5', 'base_price' => 1.80, 'bulk_price' => 15.00, 'bulk_unit' => '10 packs'],
                    ['name' => 'Frozen Paratha (Lachha)', 'unit' => 'pack of 5', 'base_price' => 2.00, 'bulk_price' => 16.00, 'bulk_unit' => '10 packs'],
                    ['name' => 'Frozen Roti', 'unit' => 'pack of 10', 'base_price' => 1.50, 'bulk_price' => 12.00, 'bulk_unit' => '10 packs'],
                    ['name' => 'Frozen Naan', 'unit' => 'pack of 5', 'base_price' => 1.80, 'bulk_price' => 15.00, 'bulk_unit' => '10 packs'],
                    ['name' => 'Frozen Samosa (Vegetable)', 'unit' => 'pack of 20', 'base_price' => 3.00, 'bulk_price' => 25.00, 'bulk_unit' => '10 packs'],
                    ['name' => 'Frozen Spring Rolls', 'unit' => 'pack of 20', 'base_price' => 2.80, 'bulk_price' => 23.00, 'bulk_unit' => '10 packs'],
                    ['name' => 'Frozen Mixed Vegetables', 'unit' => 'per kg', 'base_price' => 1.50, 'bulk_price' => 12.00, 'bulk_unit' => '10kg box'],
                    ['name' => 'Frozen Peas', 'unit' => 'per kg', 'base_price' => 1.20, 'bulk_price' => 10.00, 'bulk_unit' => '10kg box'],
                    ['name' => 'Frozen Okra', 'unit' => 'per 500g', 'base_price' => 1.50, 'bulk_price' => 24.00, 'bulk_unit' => '10kg box'],
                    ['name' => 'Frozen Spinach', 'unit' => 'per 500g', 'base_price' => 1.20, 'bulk_price' => 20.00, 'bulk_unit' => '10kg box'],
                    ['name' => 'Frozen Methi', 'unit' => 'per 400g', 'base_price' => 1.50, 'bulk_price' => 12.00, 'bulk_unit' => '10 packs'],
                    ['name' => 'Frozen Grated Coconut', 'unit' => 'per 400g', 'base_price' => 1.80, 'bulk_price' => 15.00, 'bulk_unit' => '10 packs'],
                    ['name' => 'Frozen Prawns', 'unit' => 'per 500g', 'base_price' => 4.00, 'bulk_price' => 70.00, 'bulk_unit' => '10kg box'],
                    ['name' => 'Chicken Kebab', 'unit' => 'pack of 10', 'base_price' => 3.50, 'bulk_price' => 30.00, 'bulk_unit' => '10 packs'],
                    ['name' => 'Seekh Kebab', 'unit' => 'pack of 10', 'base_price' => 3.50, 'bulk_price' => 30.00, 'bulk_unit' => '10 packs'],
                    ['name' => 'Shami Kebab', 'unit' => 'pack of 10', 'base_price' => 3.00, 'bulk_price' => 25.00, 'bulk_unit' => '10 packs'],
                    ['name' => 'Falafel', 'unit' => 'pack of 12', 'base_price' => 2.50, 'bulk_price' => 20.00, 'bulk_unit' => '10 packs'],
                    ['name' => 'Frozen Chips', 'unit' => 'per kg', 'base_price' => 1.50, 'bulk_price' => 12.00, 'bulk_unit' => '10kg box'],
                    ['name' => 'Fish Fingers', 'unit' => 'pack of 10', 'base_price' => 2.00, 'bulk_price' => 16.00, 'bulk_unit' => '10 packs'],
                    ['name' => 'Chicken Nuggets', 'unit' => 'pack of 20', 'base_price' => 2.50, 'bulk_price' => 20.00, 'bulk_unit' => '10 packs'],
                ],
            ],
            [
                'name' => 'Rice, Flour & Grains',
                'emoji' => '🌾',
                'sort_order' => 6,
                'products' => [
                    ['name' => 'Basmati Rice 5kg', 'unit' => '5kg bag', 'base_price' => 8.00, 'bulk_price' => 70.00, 'bulk_unit' => '10 bags'],
                    ['name' => 'Basmati Rice 10kg', 'unit' => '10kg bag', 'base_price' => 14.00, 'bulk_price' => 120.00, 'bulk_unit' => '10 bags'],
                    ['name' => 'Sona Masoori Rice', 'unit' => '5kg bag', 'base_price' => 6.50, 'bulk_price' => 55.00, 'bulk_unit' => '10 bags'],
                    ['name' => 'Jasmine Rice', 'unit' => '5kg bag', 'base_price' => 7.50, 'bulk_price' => 65.00, 'bulk_unit' => '10 bags'],
                    ['name' => 'Brown Basmati Rice', 'unit' => '5kg bag', 'base_price' => 9.00, 'bulk_price' => 80.00, 'bulk_unit' => '10 bags'],
                    ['name' => 'Atta Flour 5kg', 'unit' => '5kg bag', 'base_price' => 4.50, 'bulk_price' => 38.00, 'bulk_unit' => '10 bags'],
                    ['name' => 'Atta Flour 10kg', 'unit' => '10kg bag', 'base_price' => 7.50, 'bulk_price' => 65.00, 'bulk_unit' => '10 bags'],
                    ['name' => 'Maida (Plain Flour)', 'unit' => 'per 1.5kg', 'base_price' => 1.20, 'bulk_price' => 10.00, 'bulk_unit' => '10 packs'],
                    ['name' => 'Semolina (Suji)', 'unit' => 'per 500g', 'base_price' => 1.00, 'bulk_price' => 8.00, 'bulk_unit' => '10 packs'],
                    ['name' => 'Rice Flour', 'unit' => 'per 500g', 'base_price' => 1.00, 'bulk_price' => 8.00, 'bulk_unit' => '10 packs'],
                    ['name' => 'Gram Flour (Besan)', 'unit' => 'per 1kg', 'base_price' => 1.80, 'bulk_price' => 15.00, 'bulk_unit' => '10 packs'],
                    ['name' => 'Corn Flour', 'unit' => 'per 500g', 'base_price' => 0.80, 'bulk_price' => 6.00, 'bulk_unit' => '10 packs'],
                    ['name' => 'Sago (Sabudana)', 'unit' => 'per 500g', 'base_price' => 1.20, 'bulk_price' => 10.00, 'bulk_unit' => '10 packs'],
                    ['name' => 'Poha (Flattened Rice)', 'unit' => 'per 500g', 'base_price' => 1.00, 'bulk_price' => 8.00, 'bulk_unit' => '10 packs'],
                    ['name' => 'Puffed Rice (Muri)', 'unit' => 'per 500g', 'base_price' => 1.00, 'bulk_price' => 8.00, 'bulk_unit' => '10 packs'],
                    ['name' => 'Vermicelli (Seviyan)', 'unit' => 'per 400g', 'base_price' => 0.80, 'bulk_price' => 6.00, 'bulk_unit' => '10 packs'],
                ],
            ],
            [
                'name' => 'Lentils & Beans',
                'emoji' => '🫘',
                'sort_order' => 7,
                'products' => [
                    ['name' => 'Masoor Dal (Red Lentils)', 'unit' => 'per kg', 'base_price' => 1.80, 'bulk_price' => 15.00, 'bulk_unit' => '10kg sack'],
                    ['name' => 'Toor Dal (Pigeon Pea)', 'unit' => 'per kg', 'base_price' => 2.50, 'bulk_price' => 22.00, 'bulk_unit' => '10kg sack'],
                    ['name' => 'Chana Dal', 'unit' => 'per kg', 'base_price' => 2.00, 'bulk_price' => 17.00, 'bulk_unit' => '10kg sack'],
                    ['name' => 'Moong Dal', 'unit' => 'per kg', 'base_price' => 2.80, 'bulk_price' => 25.00, 'bulk_unit' => '10kg sack'],
                    ['name' => 'Urad Dal', 'unit' => 'per kg', 'base_price' => 3.00, 'bulk_price' => 27.00, 'bulk_unit' => '10kg sack'],
                    ['name' => 'Black Eye Beans', 'unit' => 'per 500g', 'base_price' => 1.50, 'bulk_price' => 25.00, 'bulk_unit' => '10kg sack'],
                    ['name' => 'Rajma (Kidney Beans)', 'unit' => 'per 500g', 'base_price' => 1.50, 'bulk_price' => 25.00, 'bulk_unit' => '10kg sack'],
                    ['name' => 'Chickpeas (Kabuli Chana)', 'unit' => 'per 500g', 'base_price' => 1.20, 'bulk_price' => 20.00, 'bulk_unit' => '10kg sack'],
                    ['name' => 'Kala Chana (Black Chickpeas)', 'unit' => 'per 500g', 'base_price' => 1.50, 'bulk_price' => 25.00, 'bulk_unit' => '10kg sack'],
                    ['name' => 'Whole Urad (Black Lentils)', 'unit' => 'per 500g', 'base_price' => 1.80, 'bulk_price' => 30.00, 'bulk_unit' => '10kg sack'],
                    ['name' => 'Whole Moong (Green Gram)', 'unit' => 'per 500g', 'base_price' => 1.80, 'bulk_price' => 30.00, 'bulk_unit' => '10kg sack'],
                    ['name' => 'Moth Beans', 'unit' => 'per 500g', 'base_price' => 2.00, 'bulk_price' => 32.00, 'bulk_unit' => '10kg sack'],
                    ['name' => 'Soy Chunks', 'unit' => 'per 200g', 'base_price' => 1.00, 'bulk_price' => 8.00, 'bulk_unit' => '10 packs'],
                    ['name' => 'Canned Chickpeas', 'unit' => 'per 400g tin', 'base_price' => 0.65, 'bulk_price' => 5.50, 'bulk_unit' => '10 tins'],
                    ['name' => 'Canned Kidney Beans', 'unit' => 'per 400g tin', 'base_price' => 0.65, 'bulk_price' => 5.50, 'bulk_unit' => '10 tins'],
                    ['name' => 'Mixed Dal Pack', 'unit' => 'per 1kg', 'base_price' => 3.00, 'bulk_price' => 25.00, 'bulk_unit' => '10 packs'],
                ],
            ],
            [
                'name' => 'Spices & Masalas',
                'emoji' => '🌶️',
                'sort_order' => 8,
                'products' => [
                    ['name' => 'Turmeric Powder (Haldi)', 'unit' => 'per 100g', 'base_price' => 0.80, 'bulk_price' => 6.50, 'bulk_unit' => 'per kg'],
                    ['name' => 'Chilli Powder', 'unit' => 'per 100g', 'base_price' => 0.70, 'bulk_price' => 5.50, 'bulk_unit' => 'per kg'],
                    ['name' => 'Cumin Powder (Jeera)', 'unit' => 'per 100g', 'base_price' => 0.90, 'bulk_price' => 7.50, 'bulk_unit' => 'per kg'],
                    ['name' => 'Coriander Powder (Dhania)', 'unit' => 'per 100g', 'base_price' => 0.70, 'bulk_price' => 5.50, 'bulk_unit' => 'per kg'],
                    ['name' => 'Garam Masala', 'unit' => 'per 100g', 'base_price' => 1.20, 'bulk_price' => 10.00, 'bulk_unit' => 'per kg'],
                    ['name' => 'Curry Powder', 'unit' => 'per 100g', 'base_price' => 0.80, 'bulk_price' => 6.50, 'bulk_unit' => 'per kg'],
                    ['name' => 'Biryani Masala', 'unit' => 'per 100g', 'base_price' => 1.50, 'bulk_price' => 12.00, 'bulk_unit' => 'per kg'],
                    ['name' => 'Tandoori Masala', 'unit' => 'per 100g', 'base_price' => 1.20, 'bulk_price' => 10.00, 'bulk_unit' => 'per kg'],
                    ['name' => 'Chaat Masala', 'unit' => 'per 100g', 'base_price' => 1.00, 'bulk_price' => 8.00, 'bulk_unit' => 'per kg'],
                    ['name' => 'Chole Masala', 'unit' => 'per 100g', 'base_price' => 1.00, 'bulk_price' => 8.00, 'bulk_unit' => 'per kg'],
                    ['name' => 'Fish Masala', 'unit' => 'per 100g', 'base_price' => 1.00, 'bulk_price' => 8.00, 'bulk_unit' => 'per kg'],
                    ['name' => 'Meat Masala', 'unit' => 'per 100g', 'base_price' => 1.20, 'bulk_price' => 10.00, 'bulk_unit' => 'per kg'],
                    ['name' => 'Cumin Seeds', 'unit' => 'per 100g', 'base_price' => 0.80, 'bulk_price' => 6.50, 'bulk_unit' => 'per kg'],
                    ['name' => 'Mustard Seeds', 'unit' => 'per 100g', 'base_price' => 0.60, 'bulk_price' => 4.50, 'bulk_unit' => 'per kg'],
                    ['name' => 'Fennel Seeds (Saunf)', 'unit' => 'per 100g', 'base_price' => 0.80, 'bulk_price' => 6.50, 'bulk_unit' => 'per kg'],
                    ['name' => 'Nigella Seeds (Kalonji)', 'unit' => 'per 100g', 'base_price' => 0.80, 'bulk_price' => 6.50, 'bulk_unit' => 'per kg'],
                    ['name' => 'Fenugreek Seeds (Methi)', 'unit' => 'per 100g', 'base_price' => 0.60, 'bulk_price' => 4.50, 'bulk_unit' => 'per kg'],
                    ['name' => 'Ajwain (Carom Seeds)', 'unit' => 'per 100g', 'base_price' => 0.80, 'bulk_price' => 6.50, 'bulk_unit' => 'per kg'],
                    ['name' => 'Green Cardamom', 'unit' => 'per 50g', 'base_price' => 2.50, 'bulk_price' => 45.00, 'bulk_unit' => 'per kg'],
                    ['name' => 'Cloves', 'unit' => 'per 50g', 'base_price' => 1.50, 'bulk_price' => 28.00, 'bulk_unit' => 'per kg'],
                    ['name' => 'Cinnamon Sticks', 'unit' => 'per 50g', 'base_price' => 1.00, 'bulk_price' => 18.00, 'bulk_unit' => 'per kg'],
                    ['name' => 'Bay Leaves', 'unit' => 'per 50g', 'base_price' => 0.80, 'bulk_price' => 14.00, 'bulk_unit' => 'per kg'],
                    ['name' => 'Black Pepper (Whole)', 'unit' => 'per 100g', 'base_price' => 1.50, 'bulk_price' => 13.00, 'bulk_unit' => 'per kg'],
                    ['name' => 'Star Anise', 'unit' => 'per 50g', 'base_price' => 1.00, 'bulk_price' => 18.00, 'bulk_unit' => 'per kg'],
                    ['name' => 'Dried Red Chillies', 'unit' => 'per 100g', 'base_price' => 0.80, 'bulk_price' => 6.50, 'bulk_unit' => 'per kg'],
                    ['name' => 'Kasuri Methi (Dried Fenugreek)', 'unit' => 'per 100g', 'base_price' => 1.20, 'bulk_price' => 10.00, 'bulk_unit' => 'per kg'],
                    ['name' => 'Hing (Asafoetida)', 'unit' => 'per 50g', 'base_price' => 1.50, 'bulk_price' => 25.00, 'bulk_unit' => 'per kg'],
                    ['name' => 'Ginger-Garlic Paste', 'unit' => 'per 300g jar', 'base_price' => 1.50, 'bulk_price' => 12.00, 'bulk_unit' => '10 jars'],
                    ['name' => 'Biryani Spices Pack', 'unit' => 'per pack', 'base_price' => 2.00, 'bulk_price' => 16.00, 'bulk_unit' => '10 packs'],
                ],
            ],
            [
                'name' => 'Oils, Ghee & Sauces',
                'emoji' => '🫙',
                'sort_order' => 9,
                'products' => [
                    ['name' => 'Sunflower Oil', 'unit' => 'per 1L', 'base_price' => 1.80, 'bulk_price' => 14.00, 'bulk_unit' => '10L'],
                    ['name' => 'Vegetable Oil', 'unit' => 'per 1L', 'base_price' => 1.50, 'bulk_price' => 12.00, 'bulk_unit' => '10L'],
                    ['name' => 'Mustard Oil', 'unit' => 'per 1L', 'base_price' => 3.00, 'bulk_price' => 25.00, 'bulk_unit' => '10L'],
                    ['name' => 'Pure Ghee', 'unit' => 'per 500g', 'base_price' => 4.50, 'bulk_price' => 38.00, 'bulk_unit' => '10 jars'],
                    ['name' => 'Coconut Oil', 'unit' => 'per 500ml', 'base_price' => 3.00, 'bulk_price' => 25.00, 'bulk_unit' => '10 bottles'],
                    ['name' => 'Soy Sauce', 'unit' => 'per 250ml', 'base_price' => 1.00, 'bulk_price' => 8.00, 'bulk_unit' => '10 bottles'],
                    ['name' => 'Chilli Sauce', 'unit' => 'per 500ml', 'base_price' => 1.50, 'bulk_price' => 12.00, 'bulk_unit' => '10 bottles'],
                    ['name' => 'Tomato Ketchup', 'unit' => 'per 500ml', 'base_price' => 1.20, 'bulk_price' => 10.00, 'bulk_unit' => '10 bottles'],
                    ['name' => 'Tamarind Paste', 'unit' => 'per 200g', 'base_price' => 1.00, 'bulk_price' => 8.00, 'bulk_unit' => '10 jars'],
                    ['name' => 'Mint Sauce', 'unit' => 'per 250ml', 'base_price' => 1.00, 'bulk_price' => 8.00, 'bulk_unit' => '10 bottles'],
                    ['name' => 'Mango Chutney', 'unit' => 'per 300g', 'base_price' => 1.50, 'bulk_price' => 12.00, 'bulk_unit' => '10 jars'],
                    ['name' => 'Mixed Pickle', 'unit' => 'per 400g', 'base_price' => 1.80, 'bulk_price' => 15.00, 'bulk_unit' => '10 jars'],
                    ['name' => 'Lime Pickle', 'unit' => 'per 400g', 'base_price' => 1.80, 'bulk_price' => 15.00, 'bulk_unit' => '10 jars'],
                    ['name' => 'Ready Curry Paste (Tikka)', 'unit' => 'per 300g', 'base_price' => 1.50, 'bulk_price' => 12.00, 'bulk_unit' => '10 jars'],
                ],
            ],
            [
                'name' => 'Dairy & Chilled',
                'emoji' => '🥛',
                'sort_order' => 10,
                'products' => [
                    ['name' => 'Fresh Milk (Semi-Skimmed)', 'unit' => 'per 2L', 'base_price' => 1.50, 'bulk_price' => 12.00, 'bulk_unit' => '10 cartons'],
                    ['name' => 'Plain Yoghurt', 'unit' => 'per 500g', 'base_price' => 0.80, 'bulk_price' => 6.50, 'bulk_unit' => '10 tubs'],
                    ['name' => 'Greek Yoghurt', 'unit' => 'per 500g', 'base_price' => 1.50, 'bulk_price' => 12.00, 'bulk_unit' => '10 tubs'],
                    ['name' => 'Paneer', 'unit' => 'per 250g', 'base_price' => 2.00, 'bulk_price' => 16.00, 'bulk_unit' => '10 blocks'],
                    ['name' => 'Butter (Unsalted)', 'unit' => 'per 250g', 'base_price' => 1.80, 'bulk_price' => 15.00, 'bulk_unit' => '10 packs'],
                    ['name' => 'Double Cream', 'unit' => 'per 300ml', 'base_price' => 1.20, 'bulk_price' => 10.00, 'bulk_unit' => '10 pots'],
                    ['name' => 'Free Range Eggs', 'unit' => 'box of 12', 'base_price' => 2.50, 'bulk_price' => 20.00, 'bulk_unit' => '10 boxes'],
                    ['name' => 'Mango Lassi', 'unit' => 'per 250ml', 'base_price' => 1.20, 'bulk_price' => 10.00, 'bulk_unit' => '10 bottles'],
                    ['name' => 'Buttermilk (Chaas)', 'unit' => 'per 500ml', 'base_price' => 1.00, 'bulk_price' => 8.00, 'bulk_unit' => '10 bottles'],
                    ['name' => 'Cheese Slices', 'unit' => 'pack of 10', 'base_price' => 1.50, 'bulk_price' => 12.00, 'bulk_unit' => '10 packs'],
                ],
            ],
            [
                'name' => 'Ready Meals & Snacks',
                'emoji' => '🍱',
                'sort_order' => 11,
                'products' => [
                    ['name' => 'Pani Puri Kit', 'unit' => 'per pack', 'base_price' => 2.50, 'bulk_price' => 20.00, 'bulk_unit' => '10 packs'],
                    ['name' => 'Papdi Chaat Kit', 'unit' => 'per pack', 'base_price' => 2.50, 'bulk_price' => 20.00, 'bulk_unit' => '10 packs'],
                    ['name' => 'Instant Noodles', 'unit' => 'pack of 5', 'base_price' => 1.50, 'bulk_price' => 12.00, 'bulk_unit' => '10 multi-packs'],
                    ['name' => 'Nimko Mix', 'unit' => 'per 200g', 'base_price' => 1.20, 'bulk_price' => 10.00, 'bulk_unit' => '10 packs'],
                    ['name' => 'Bhujia', 'unit' => 'per 200g', 'base_price' => 1.20, 'bulk_price' => 10.00, 'bulk_unit' => '10 packs'],
                    ['name' => 'Roasted Chana', 'unit' => 'per 200g', 'base_price' => 1.00, 'bulk_price' => 8.00, 'bulk_unit' => '10 packs'],
                    ['name' => 'Masala Peanuts', 'unit' => 'per 200g', 'base_price' => 1.00, 'bulk_price' => 8.00, 'bulk_unit' => '10 packs'],
                    ['name' => 'Banana Chips', 'unit' => 'per 200g', 'base_price' => 1.20, 'bulk_price' => 10.00, 'bulk_unit' => '10 packs'],
                    ['name' => 'Kulfi (Mango/Pistachio)', 'unit' => 'per pack (6)', 'base_price' => 3.00, 'bulk_price' => 25.00, 'bulk_unit' => '10 packs'],
                    ['name' => 'Strong Tea Bags (PG Tips)', 'unit' => 'box of 160', 'base_price' => 3.50, 'bulk_price' => 30.00, 'bulk_unit' => '10 boxes'],
                    ['name' => 'Loose Tea Leaves', 'unit' => 'per 500g', 'base_price' => 3.00, 'bulk_price' => 25.00, 'bulk_unit' => '10 packs'],
                    ['name' => 'Instant Coffee', 'unit' => 'per 200g jar', 'base_price' => 3.50, 'bulk_price' => 30.00, 'bulk_unit' => '10 jars'],
                    ['name' => 'Jaggery (Gur)', 'unit' => 'per 500g', 'base_price' => 1.50, 'bulk_price' => 12.00, 'bulk_unit' => '10 packs'],
                    ['name' => 'Sugar', 'unit' => 'per 1kg', 'base_price' => 0.80, 'bulk_price' => 6.50, 'bulk_unit' => '10 packs'],
                    ['name' => 'Salt', 'unit' => 'per 1kg', 'base_price' => 0.50, 'bulk_price' => 4.00, 'bulk_unit' => '10 packs'],
                    ['name' => 'Biscuit Packs (Parle-G)', 'unit' => 'per pack', 'base_price' => 0.60, 'bulk_price' => 5.00, 'bulk_unit' => '10 packs'],
                    ['name' => 'Family Snack Box', 'unit' => 'per box', 'base_price' => 8.00, 'bulk_price' => 70.00, 'bulk_unit' => '10 boxes', 'notes' => 'Assorted snacks selection'],
                    ['name' => 'Weekly Veg Box', 'unit' => 'per box', 'base_price' => 12.00, 'bulk_price' => 100.00, 'bulk_unit' => '10 boxes', 'notes' => 'Seasonal vegetable selection'],
                ],
            ],
        ];

        foreach ($categories as $catData) {
            $products = $catData['products'];
            unset($catData['products']);
            $catData['slug'] = Str::slug($catData['name']);

            $category = SupplierCategory::updateOrCreate(
                ['slug' => $catData['slug']],
                $catData
            );

            foreach ($products as $index => $product) {
                SupplierProduct::updateOrCreate(
                    [
                        'supplier_category_id' => $category->id,
                        'name' => $product['name'],
                    ],
                    array_merge($product, ['sort_order' => $index + 1])
                );
            }
        }
    }
}
