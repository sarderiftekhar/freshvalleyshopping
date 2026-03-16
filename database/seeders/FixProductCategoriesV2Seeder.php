<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class FixProductCategoriesV2Seeder extends Seeder
{
    public function run(): void
    {
        // ============================================================
        // Fix 1: Seasonal Fruits — 28 products stuck in "Mangoes"
        // Move non-mango fruits to correct Seasonal Fruits subcategories
        // ============================================================
        $seasonalParent = Category::where('slug', 'seasonal-fruits')->first();
        $mangoes = Category::where('name', 'Mangoes')->where('parent_id', $seasonalParent->id)->first();
        $lychees = Category::where('name', 'Lychees')->where('parent_id', $seasonalParent->id)->first();
        $guava = Category::where('name', 'Guava')->where('parent_id', $seasonalParent->id)->first();
        $pomegranate = Category::where('name', 'Pomegranate')->where('parent_id', $seasonalParent->id)->first();

        // Move non-mango fruits to Fresh Fruits parent's subcategories instead
        $freshFruitsParent = Category::where('slug', 'fresh-fruits')->first();
        $tropical = Category::where('name', 'Tropical Fruits')->where('parent_id', $freshFruitsParent->id)->first();
        $citrus = Category::where('name', 'Citrus Fruits')->where('parent_id', $freshFruitsParent->id)->first();
        $berries = Category::where('name', 'Berries')->where('parent_id', $freshFruitsParent->id)->first();
        $apples = Category::where('name', 'Apples & Pears')->where('parent_id', $freshFruitsParent->id)->first();
        $bananas = Category::where('name', 'Bananas & Plantains')->where('parent_id', $freshFruitsParent->id)->first();
        $grapes = Category::where('name', 'Grapes & Melons')->where('parent_id', $freshFruitsParent->id)->first();

        $fruitRules = [
            [$mangoes, '/\bmango\b|raw mango/i'],
            [$lychees, '/lychee|litchi/i'],
            [$guava, '/guava/i'],
            [$pomegranate, '/pomegranate/i'],
            [$tropical, '/pineapple|papaya|passion|jackfruit|dragon|custard|kiwi|nectarine|peach|kaki|sharon|avocado|mix fruit/i'],
            [$citrus, '/lemon|lime|orange|grapefruit|tangerine|clementine/i'],
            [$berries, '/berry|cherry/i'],
            [$apples, '/\bapple\b|pear\b/i'],
            [$bananas, '/banana|banna|plantain/i'],
            [$grapes, '/grape|melon|watermelon/i'],
        ];

        $this->applyRules($mangoes->id, $fruitRules, $tropical->id, 'Seasonal Fruits (from Mangoes)');

        // ============================================================
        // Fix 2: Fresh Meat & Chicken — beef/sheep/duck in "Goat Curry"
        // ============================================================
        $meatParent = Category::where('slug', 'fresh-meat-chicken')->first();
        $goat = Category::where('name', 'Goat Curry Pieces')->where('parent_id', $meatParent->id)->first();
        $wholeChicken = Category::where('name', 'Whole Chicken')->where('parent_id', $meatParent->id)->first();
        $lambChops = Category::where('name', 'Lamb Chops & Steaks')->where('parent_id', $meatParent->id)->first();

        // We need beef & other categories — use Fresh Meat parent's subcategories
        $freshMeatParent = Category::where('slug', 'fresh-meat')->first();
        $beef = Category::where('name', 'Halal Beef')->where('parent_id', $freshMeatParent->id)->first();
        $lamb = Category::where('name', 'Halal Lamb')->where('parent_id', $freshMeatParent->id)->first();
        $mutton = Category::where('name', 'Halal Mutton')->where('parent_id', $freshMeatParent->id)->first();
        $goatMeat = Category::where('name', 'Halal Goat')->where('parent_id', $freshMeatParent->id)->first();
        $organ = Category::where('name', 'Organ Meat & Offal')->where('parent_id', $freshMeatParent->id)->first();

        $meatRules = [
            [$beef, '/beef|boneless beef|bone less beef|cow/i'],
            [$mutton, '/mutton|sheep|half sheep|whole sheep/i'],
            [$organ, '/brain|feet|tripe|liver|gizzard|intestine|vuri|tilli|spleen|tongue/i'],
            [$goat, '/goat/i'],
            [$wholeChicken, '/chicken|duck|hala.*fresh/i'],
        ];

        $this->applyRules($goat->id, $meatRules, $goat->id, 'Fresh Meat (from Goat Curry)');

        // ============================================================
        // Fix 3: Grocery — 181 items in "Vinegar & Cooking Essentials"
        // These are misc grocery items needing proper subcategories
        // ============================================================
        $groceryParent = Category::where('slug', 'grocery')->first();
        $vincook = Category::where('name', 'Vinegar & Cooking Essentials')->where('parent_id', $groceryParent->id)->first();
        $oilGhee = Category::where('name', 'Cooking Oil & Ghee')->where('parent_id', $groceryParent->id)->first();
        $sauces = Category::where('name', 'Sauces & Condiments')->where('parent_id', $groceryParent->id)->first();
        $noodles = Category::where('name', 'Noodles & Pasta')->where('parent_id', $groceryParent->id)->first();
        $pickles = Category::where('name', 'Pickles & Chutneys')->where('parent_id', $groceryParent->id)->first();
        $coconut = Category::where('name', 'Coconut & Coconut Products')->where('parent_id', $groceryParent->id)->first();
        $honey = Category::where('name', 'Honey & Syrups')->where('parent_id', $groceryParent->id)->first();
        $flour = Category::where('name', 'Flour & Atta')->where('parent_id', $groceryParent->id)->first();
        $salt = Category::where('name', 'Salt & Sugar')->where('parent_id', $groceryParent->id)->first();
        $canned = Category::where('name', 'Canned & Tinned Foods')->where('parent_id', $groceryParent->id)->first();

        // For items that are really spices, use Spices parent
        $spicesParent = Category::where('slug', 'spices-herbs')->first();
        $groundSpices = Category::where('name', 'Ground Spices')->where('parent_id', $spicesParent->id)->first();
        $wholeSp = Category::where('name', 'Whole Spices')->where('parent_id', $spicesParent->id)->first();
        $spiceMix = Category::where('name', 'Spice Mixes & Masala')->where('parent_id', $spicesParent->id)->first();
        $curryPaste = Category::where('name', 'Curry Powder & Paste')->where('parent_id', $spicesParent->id)->first();

        // Snacks -> Snacks & Drinks parent
        $snacksParent = Category::where('slug', 'snacks-drinks')->first();
        $crisps = Category::where('name', 'Crisps & Chips')->where('parent_id', $snacksParent->id)->first();
        $chanachur = Category::where('name', 'Chanachur & Bombay Mix')->where('parent_id', $snacksParent->id)->first();
        $chocolate = Category::where('name', 'Chocolate & Sweets')->where('parent_id', $snacksParent->id)->first();

        // Dairy -> Dairy parent
        $dairyParent = Category::where('slug', 'dairy-eggs')->first();
        $milk = Category::where('name', 'Milk')->where('parent_id', $dairyParent->id)->first();
        $milkPowder = Category::where('name', 'Milk Powder')->where('parent_id', $dairyParent->id)->first();
        $condensed = Category::where('name', 'Condensed & Evaporated Milk')->where('parent_id', $dairyParent->id)->first();

        $groceryRules = [
            // Hair/beauty -> keep in Vinegar & Cooking Essentials (catch-all for now)
            [$oilGhee, '/hair oil|body oil|beauty|shampoo|lotion|soap|vatika|dabur|himani|kumarika|navratna|amla|henna|mehndi|hair/i'],
            // Spices
            [$groundSpices, '/powder(?!.*milk)(?!.*coffee)(?!.*wash)|ground |turmeric|cumin|coriander powder|chilli powder/i'],
            [$wholeSp, '/whole spice|bay leaf|cardamom|cinnamon|clove|star anise|fenugreek|fennel|ajwain/i'],
            [$spiceMix, '/masala|garam|tandoori|biryani mix|curry mix|chaat/i'],
            [$curryPaste, '/curry paste|curry powder|paste\b/i'],
            // Snacks
            [$crisps, '/crisp|chip|fries|puff\b|prawn cracker/i'],
            [$chanachur, '/chanachur|bombay mix|jhalmuri|nimki|dal moth|chevda|mixture/i'],
            [$chocolate, '/chocolate|candy|sweet|toffee|lollipop/i'],
            // Dairy
            [$milkPowder, '/milk powder|powdered milk|nido/i'],
            [$condensed, '/condensed|evaporated|carnation/i'],
            [$milk, '/\bmilk\b(?!.*powder)(?!.*coconut)/i'],
            // Sauces
            [$sauces, '/sauce|ketchup|mayo|chutney|vinegar|soy\b|tamarind|sriracha|hot sauce|bbq/i'],
            // Canned
            [$canned, '/can\b|canned|tinned|sardine|tuna|baked beans/i'],
            // Noodles
            [$noodles, '/noodle|pasta|vermicelli|shemai/i'],
            // Flour
            [$flour, '/flour|atta|semolina|cornflour|cornstarch/i'],
            // Salt/Sugar
            [$salt, '/\bsalt\b|sugar|jaggery/i'],
            // Pickles
            [$pickles, '/pickle|achar/i'],
            // Honey
            [$honey, '/honey/i'],
            // Coconut products
            [$coconut, '/coconut(?!.*oil)/i'],
            // Ready mix / cooking items
            [$vincook, '/ready mix|food colour|essence|baking|yeast|agar|gelatin/i'],
        ];

        $this->applyRules($vincook->id, $groceryRules, $vincook->id, 'Grocery (from Vinegar & Cooking Essentials)');

        // ============================================================
        // Fix 4: Desi Vegetables catch-all — redistribute properly
        // ============================================================
        $vegParent = Category::where('slug', 'fresh-vegetables')->first();
        $desi = Category::where('name', 'Desi Vegetables')->where('parent_id', $vegParent->id)->first();
        $root = Category::where('name', 'Root Vegetables')->where('parent_id', $vegParent->id)->first();
        $gourds = Category::where('name', 'Fresh Gourds')->where('parent_id', $vegParent->id)->first();
        $aubergine = Category::where('name', 'Fresh Aubergine & Okra')->where('parent_id', $vegParent->id)->first();
        $potatoes = Category::where('name', 'Potatoes & Sweet Potatoes')->where('parent_id', $vegParent->id)->first();
        $leafy = Category::where('name', 'Cooking Greens')->where('parent_id', $vegParent->id)->first();
        $salad = Category::where('name', 'Salad Vegetables')->where('parent_id', $vegParent->id)->first();
        $herbs = Category::where('name', 'Fresh Herbs & Leaves')->where('parent_id', $vegParent->id)->first();

        $vegRules = [
            [$root, '/onion|garlic|ginger|carrot|beetroot|turnip|radish|mooli/i'],
            [$gourds, '/gourd|squash|bottle|ridge|snake|pumpkin|lau\b|lauki|karela|bitter|pointed|chilli|pepper|green chilli/i'],
            [$aubergine, '/aubergine|eggplant|begun|brinjal|okra|bhindi|ladies finger|dheros/i'],
            [$potatoes, '/potato|sweet potato|edoe|taro|yam|cassava/i'],
            [$leafy, '/spinach|palak|shaak|shak|saag|methi|cabbage|cauliflower|broccoli/i'],
            [$salad, '/lettuce|cucumber|tomato|capsicum|bell pepper|celery|courgette|corn\b|sweetcorn/i'],
            [$herbs, '/coriander|dhania|mint|pudina|curry leaf|basil|parsley|thyme|rosemary/i'],
        ];

        $this->applyRules($desi->id, $vegRules, $desi->id, 'Fresh Vegetables (from Desi Vegetables)');

        // Final summary
        $this->command->newLine();
        $this->command->info('=== Final Category Summary ===');
        $parents = Category::whereNull('parent_id')->orderBy('sort_order')
            ->with(['children' => function ($q) {
                $q->withCount('products')->orderBy('sort_order');
            }])
            ->withCount('products')
            ->get();

        foreach ($parents as $parent) {
            $childTotal = $parent->children->sum('products_count');
            $total = $parent->products_count + $childTotal;
            if ($total > 0) {
                $this->command->line("{$parent->name}: {$total} total ({$parent->products_count} direct)");
                foreach ($parent->children as $child) {
                    if ($child->products_count > 0) {
                        $this->command->line("  {$child->name}: {$child->products_count}");
                    }
                }
            }
        }
    }

    private function applyRules(int $sourceId, array $rules, int $defaultId, string $label): void
    {
        $products = Product::where('category_id', $sourceId)->get();
        if ($products->isEmpty()) {
            return;
        }

        $moved = 0;
        $distribution = [];

        foreach ($products as $product) {
            $matchText = $product->title . ' ' . ($product->description ?? '');
            $targetId = null;

            foreach ($rules as [$category, $pattern]) {
                if ($category && preg_match($pattern, $matchText)) {
                    $targetId = $category->id;
                    $distribution[$category->name] = ($distribution[$category->name] ?? 0) + 1;
                    break;
                }
            }

            if (!$targetId) {
                $targetId = $defaultId;
                $distribution['(default)'] = ($distribution['(default)'] ?? 0) + 1;
            }

            if ($targetId !== $sourceId) {
                $product->category_id = $targetId;
                $product->save();
                $moved++;
            }
        }

        $this->command->info("{$label}: redistributed {$moved}/{$products->count()}");
        foreach ($distribution as $name => $count) {
            $this->command->line("  {$name}: {$count}");
        }
    }
}
