<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class FixProductCategoriesSeeder extends Seeder
{
    public function run(): void
    {
        // Fix 1: Seasonal Fruits — all went to "Mangoes", redistribute properly
        $this->fixCategory('Mangoes', 'seasonal-fruits', [
            'Mangoes' => '/\bmango\b/i',
            'Tropical Fruits' => '/pineapple|papaya|passion|guava|lychee|jackfruit|dragon|custard apple|kiwi|nectarine|peach|kaki|sharon/i',
            'Citrus Fruits' => '/orange|lemon|lime|grapefruit|tangerine|clementine/i',
            'Berries' => '/berry|strawberry|blueberry|raspberry|cherry/i',
            'Apples & Pears' => '/apple|pear\b/i',
            'Bananas & Plantains' => '/banana|banna|plantain/i',
            'Grapes & Melons' => '/grape|melon|watermelon/i',
            'Pomegranate' => '/pomegranate/i',
        ], 'Tropical Fruits');

        // Fix 2: Whole Chicken — meats miscategorized
        $this->fixCategory('Whole Chicken', 'fresh-meat-chicken', [
            'Whole Chicken' => '/whole chicken|hala.*chicken|desi chicken|cobb chicken|hens.*chicken|baby.*chicken|spring.*chicken/i',
            'Chicken Breast' => '/chicken breast|breast fillet/i',
            'Chicken Thighs & Drumsticks' => '/thigh|drumstick|leg quarter|niblet/i',
            'Chicken Wings' => '/chicken.*wing|wing/i',
            'Mince & Keema' => '/mince|keema/i',
            'Chicken Liver & Gizzard' => '/liver|gizzard|giblet|heart/i',
            'Lamb Chops & Steaks' => '/lamb|chop|steak|rack\b/i',
            'Goat Curry Pieces' => '/goat|mutton|seena|shoulder|rib\b|back chop|neck|shank/i',
        ], 'Goat Curry Pieces');

        // Fix 3: Cooking Oil & Ghee — grocery catch-all, redistribute non-oil items
        $this->fixCategory('Cooking Oil & Ghee', 'grocery', [
            'Cooking Oil & Ghee' => '/cooking oil|vegetable oil|sunflower oil|mustard oil|olive oil|ghee|pure oil|coconut oil|ktc.*oil|pran.*oil|banoful.*oil|radhuni.*oil|danish.*oil|life.*oil|parachute/i',
            'Sauces & Condiments' => '/sauce|ketchup|mayo|vinegar|soy|chilli sauce|mustard\b(?!.*oil)|paste|tamarind|concentrate/i',
            'Pickles & Chutneys' => '/pickle|chutney|achar/i',
            'Noodles & Pasta' => '/noodle|pasta|macaroni|spaghetti|vermicelli|shemai|sevai/i',
            'Coconut & Coconut Products' => '/coconut(?!.*oil)/i',
            'Honey & Syrups' => '/honey|syrup|molasses|jaggery/i',
            'Salt & Sugar' => '/\bsalt\b|sugar/i',
            'Flour & Atta' => '/flour|atta|maida|suji|besan/i',
            'Vinegar & Cooking Essentials' => '/hair.*oil|body.*oil|beauty|shampoo|cream\b|lotion|soap|vatika|dabur|himani|kumarika|samaritan|jasmine.*oil|amla|navratna|care.*oil|henna|mehndi|onion|fried|spice|masala|powder|dal|mix\b|ready|food|snack|crisp|chip|candy|sweet|chocolate/i',
        ], 'Vinegar & Cooking Essentials');
    }

    private function fixCategory(string $sourceCatName, string $parentSlug, array $rules, string $defaultSubCat): void
    {
        $sourceCat = Category::where('name', $sourceCatName)->first();
        if (!$sourceCat) {
            $this->command->warn("Source category not found: {$sourceCatName}");
            return;
        }

        $parent = Category::where('slug', $parentSlug)->first();
        $products = Product::where('category_id', $sourceCat->id)->get();

        if ($products->isEmpty()) {
            return;
        }

        // Load subcategory IDs
        $subCatMap = [];
        foreach ($rules as $subCatName => $pattern) {
            $subCat = Category::where('name', $subCatName)
                ->where('parent_id', $parent->id)
                ->first();
            if ($subCat) {
                $subCatMap[] = ['id' => $subCat->id, 'name' => $subCatName, 'pattern' => $pattern];
            }
        }

        $default = Category::where('name', $defaultSubCat)->where('parent_id', $parent->id)->first();
        $moved = 0;
        $distribution = [];

        foreach ($products as $product) {
            $matchText = $product->title . ' ' . ($product->description ?? '');
            $targetId = null;
            $targetName = null;

            foreach ($subCatMap as $info) {
                if (preg_match($info['pattern'], $matchText)) {
                    $targetId = $info['id'];
                    $targetName = $info['name'];
                    break;
                }
            }

            if (!$targetId && $default) {
                $targetId = $default->id;
                $targetName = $defaultSubCat;
            }

            if ($targetId && $targetId !== $sourceCat->id) {
                $product->category_id = $targetId;
                $product->save();
                $moved++;
            }

            $distribution[$targetName ?? 'unchanged'] = ($distribution[$targetName ?? 'unchanged'] ?? 0) + 1;
        }

        $this->command->info("Fixed {$sourceCatName}: moved {$moved}/{$products->count()} products");
        foreach ($distribution as $name => $count) {
            $this->command->line("  {$name}: {$count}");
        }
    }
}
