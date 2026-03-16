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
            [
                'name' => 'Fresh Meat',
                'sort_order' => 1,
                'children' => [
                    'Halal Beef',
                    'Halal Lamb',
                    'Halal Mutton',
                    'Halal Goat',
                    'Organ Meat & Offal',
                    'Marinated Meat',
                ],
            ],
            [
                'name' => 'Grocery',
                'sort_order' => 2,
                'children' => [
                    'Cooking Oil & Ghee',
                    'Flour & Atta',
                    'Salt & Sugar',
                    'Canned & Tinned Foods',
                    'Sauces & Condiments',
                    'Noodles & Pasta',
                    'Pickles & Chutneys',
                    'Vinegar & Cooking Essentials',
                    'Coconut & Coconut Products',
                    'Honey & Syrups',
                ],
            ],
            [
                'name' => 'Fresh Fish',
                'sort_order' => 3,
                'children' => [
                    'Dried Fish',
                    'Frozen Whole Fish',
                    'Frozen Large Fish Block',
                    'Frozen Small Fish Block',
                    'Frozen Seafood',
                    'King Prawns & Shrimps',
                    'Fish Fillets',
                    'Smoked Fish',
                ],
            ],
            [
                'name' => 'Rice & Grains',
                'sort_order' => 4,
                'children' => [
                    'Basmati Rice',
                    'Non-Basmati Rice',
                    'Lentils & Dal',
                    'Beans & Pulses',
                    'Wheat & Semolina',
                    'Puffed & Flattened Rice',
                    'Chickpeas & Gram',
                    'Couscous & Quinoa',
                ],
            ],
            [
                'name' => 'Live Fish',
                'sort_order' => 5,
                'children' => [
                    'Small River Fish',
                    'Medium River Fish',
                    'Large River Fish',
                    'Sea Fish',
                    'Catfish',
                    'Carp Fish',
                    'Tilapia',
                    'Live Prawns & Shrimps',
                ],
            ],
            [
                'name' => 'Vegetables',
                'sort_order' => 6,
                'children' => [
                    'Leafy Greens',
                    'Root Vegetables',
                    'Gourds & Squash',
                    'Beans & Pods',
                    'Peppers & Chillies',
                    'Onions & Garlic',
                    'Tomatoes & Cucumbers',
                    'Asian Vegetables',
                ],
            ],
            [
                'name' => 'Fresh Fruits',
                'sort_order' => 7,
                'children' => [
                    'Tropical Fruits',
                    'Citrus Fruits',
                    'Berries',
                    'Stone Fruits',
                    'Apples & Pears',
                    'Bananas & Plantains',
                    'Grapes & Melons',
                    'Exotic Fruits',
                ],
            ],
            [
                'name' => 'Frozen Prepared Foods',
                'sort_order' => 8,
                'children' => [
                    'Samosa & Spring Rolls',
                    'Parathas & Chapati',
                    'Kebabs & Tikka',
                    'Ready Meals',
                    'Frozen Snacks',
                    'Frozen Sweets & Desserts',
                    'Frozen Pitha & Bengali Sweets',
                    'Dim & Dumplings',
                ],
            ],
            [
                'name' => 'Fresh Vegetables',
                'sort_order' => 9,
                'children' => [
                    'Desi Vegetables',
                    'Salad Vegetables',
                    'Cooking Greens',
                    'Fresh Herbs & Leaves',
                    'Mushrooms',
                    'Fresh Gourds',
                    'Fresh Aubergine & Okra',
                    'Potatoes & Sweet Potatoes',
                ],
            ],
            [
                'name' => 'Spices & Herbs',
                'sort_order' => 10,
                'children' => [
                    'Whole Spices',
                    'Ground Spices',
                    'Spice Mixes & Masala',
                    'Dried Herbs',
                    'Curry Powder & Paste',
                    'Chilli Powder & Flakes',
                    'Turmeric & Cumin',
                    'Bay Leaves & Cardamom',
                ],
            ],
            [
                'name' => 'Fresh Meat & Chicken',
                'sort_order' => 11,
                'children' => [
                    'Whole Chicken',
                    'Chicken Breast',
                    'Chicken Thighs & Drumsticks',
                    'Chicken Wings',
                    'Mince & Keema',
                    'Chicken Liver & Gizzard',
                    'Lamb Chops & Steaks',
                    'Goat Curry Pieces',
                ],
            ],
            [
                'name' => 'Dairy & Eggs',
                'sort_order' => 12,
                'children' => [
                    'Milk',
                    'Eggs',
                    'Butter & Margarine',
                    'Cheese',
                    'Cream & Yogurt',
                    'Paneer',
                    'Condensed & Evaporated Milk',
                    'Milk Powder',
                ],
            ],
            [
                'name' => 'Biscuits',
                'sort_order' => 13,
                'children' => [
                    'Sweet Biscuits',
                    'Savoury Biscuits',
                    'Cream Biscuits',
                    'Cookies',
                    'Rusks & Toast',
                    'Wafers',
                    'Digestive Biscuits',
                    'Desi Biscuits',
                ],
            ],
            [
                'name' => 'Frozen Foods',
                'sort_order' => 14,
                'children' => [
                    'Frozen Vegetables',
                    'Frozen Fish',
                    'Frozen Meat',
                    'Frozen Parathas',
                    'Frozen Naan & Roti',
                    'Ice Cream & Kulfi',
                    'Frozen Fries & Wedges',
                    'Frozen Pizza & Burgers',
                ],
            ],
            [
                'name' => 'Seasonal Fruits',
                'sort_order' => 15,
                'children' => [
                    'Mangoes',
                    'Lychees',
                    'Jackfruit',
                    'Green Coconut',
                    'Guava',
                    'Pomegranate',
                    'Dates (Fresh)',
                    'Starfruit & Tamarind',
                ],
            ],
            [
                'name' => 'Snacks & Drinks',
                'sort_order' => 16,
                'children' => [
                    'Crisps & Chips',
                    'Chanachur & Bombay Mix',
                    'Popcorn & Puffs',
                    'Sweet Snacks',
                    'Savoury Snacks',
                    'Muri & Jhalmuri Mix',
                    'Chocolate & Sweets',
                    'Soft Drinks',
                ],
            ],
            [
                'name' => 'Chilled Foods',
                'sort_order' => 17,
                'children' => [
                    'Fresh Paneer & Tofu',
                    'Yogurt & Lassi',
                    'Fresh Juices',
                    'Dips & Spreads',
                    'Chilled Desserts',
                    'Cooked Meats',
                    'Fresh Salads',
                    'Hummus & Raita',
                ],
            ],
            [
                'name' => 'Bakery',
                'sort_order' => 18,
                'children' => [
                    'Bread & Rolls',
                    'Naan & Flatbreads',
                    'Cakes & Pastries',
                    'Pitha & Bengali Sweets',
                    'Croissants & Danish',
                    'Bagels & Wraps',
                    'Buns & Brioche',
                    'Gluten-Free Bakery',
                ],
            ],
            [
                'name' => 'Frozen Fruit & Veg',
                'sort_order' => 19,
                'children' => [
                    'Frozen Mixed Vegetables',
                    'Frozen Peas & Sweetcorn',
                    'Frozen Spinach & Greens',
                    'Frozen Berries',
                    'Frozen Tropical Fruits',
                    'Frozen Herbs',
                    'Frozen Onions & Peppers',
                    'Frozen Stir-Fry Mix',
                ],
            ],
            [
                'name' => 'Drinks',
                'sort_order' => 20,
                'children' => [
                    'Soft Drinks & Fizzy',
                    'Juices & Nectar',
                    'Water',
                    'Energy & Health Drinks',
                    'Mango & Tropical Drinks',
                    'Lassi & Yogurt Drinks',
                    'Coconut Water',
                    'Squash & Cordials',
                ],
            ],
            [
                'name' => 'Dry Fruits & Nuts',
                'sort_order' => 21,
                'children' => [
                    'Almonds',
                    'Cashews',
                    'Pistachios',
                    'Walnuts',
                    'Dates (Dried)',
                    'Raisins & Sultanas',
                    'Mixed Nuts',
                    'Seeds',
                ],
            ],
            [
                'name' => 'Tea & Coffee',
                'sort_order' => 22,
                'children' => [
                    'Loose Leaf Tea',
                    'Tea Bags',
                    'Green Tea',
                    'Herbal & Speciality Tea',
                    'Instant Coffee',
                    'Ground Coffee',
                    'Masala Chai',
                    'Coffee Whitener & Creamer',
                ],
            ],
        ];

        foreach ($categories as $categoryData) {
            $parent = Category::updateOrCreate(
                ['slug' => Str::slug($categoryData['name'])],
                [
                    'name' => $categoryData['name'],
                    'image' => null,
                    'parent_id' => null,
                    'sort_order' => $categoryData['sort_order'],
                    'is_active' => true,
                ]
            );

            if (!empty($categoryData['children'])) {
                foreach ($categoryData['children'] as $index => $childName) {
                    Category::updateOrCreate(
                        ['slug' => Str::slug($childName)],
                        [
                            'name' => $childName,
                            'image' => null,
                            'parent_id' => $parent->id,
                            'sort_order' => $index + 1,
                            'is_active' => true,
                        ]
                    );
                }
            }
        }
    }
}
