<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class RedistributeAllProductsSeeder extends Seeder
{
    public function run(): void
    {
        $this->redistribute('grocery', [
            'Cooking Oil & Ghee' => '/oil|ghee|coconut oil|olive oil|mustard oil|sunflower/i',
            'Flour & Atta' => '/flour|atta|maida|suji|semolina|besan/i',
            'Salt & Sugar' => '/\bsalt\b|sugar|jaggery|gur\b|molasses/i',
            'Canned & Tinned Foods' => '/canned|tinned|sardine|tuna can/i',
            'Sauces & Condiments' => '/sauce|ketchup|mayo|vinegar|soy sauce|chilli sauce|mustard sauce/i',
            'Noodles & Pasta' => '/noodle|pasta|macaroni|spaghetti|vermicelli|shemai|sevai/i',
            'Pickles & Chutneys' => '/pickle|chutney|achar/i',
            'Coconut & Coconut Products' => '/coconut|narikel/i',
            'Honey & Syrups' => '/honey|syrup|molasses/i',
            'Vinegar & Cooking Essentials' => '/vinegar|baking|yeast|food colour|essence|paan/i',
        ]);

        $this->redistribute('rice-grains', [
            'Basmati Rice' => '/basmati/i',
            'Non-Basmati Rice' => '/\brice\b(?!.*basmati)/i',
            'Lentils & Dal' => '/lentil|dal\b|dhal|masoor|mung|moong|urad|chana dal/i',
            'Beans & Pulses' => '/bean|pulse|chick ?pea|rajma|kidney|lobia/i',
            'Wheat & Semolina' => '/wheat|semolina|suji|atta|flour/i',
            'Puffed & Flattened Rice' => '/puffed|flattened|muri\b|chira|poha|chuda/i',
            'Chickpeas & Gram' => '/chickpea|gram|chola|boot|chole|chana\b/i',
        ]);

        $this->redistribute('frozen-prepared-foods', [
            'Samosa & Spring Rolls' => '/samosa|singara|spring roll|roll\b/i',
            'Parathas & Chapati' => '/paratha|parotta|chapati|roti\b|puri\b/i',
            'Kebabs & Tikka' => '/kebab|tikka|sheek|shami|kopta|kofta/i',
            'Ready Meals' => '/ready|meal|curry\b|biryani/i',
            'Frozen Snacks' => '/snack|puff|pastry|croquette|cutlet|chop\b|fry\b/i',
            'Frozen Sweets & Desserts' => '/sweet|dessert|halwa|gulab|jalebi|rasmalai|laddu/i',
            'Frozen Pitha & Bengali Sweets' => '/pitha|bhapa|chitoi/i',
            'Dim & Dumplings' => '/dim\b|dumpling|momo|wonton/i',
        ]);

        $this->redistribute('fresh-vegetables', [
            'Desi Vegetables' => '/desi|drum ?stick|dheros|tinda|karela|parwal|jhinga/i',
            'Salad Vegetables' => '/lettuce|cucumber|capsicum|bell pepper|celery|radish|salad/i',
            'Cooking Greens' => '/spinach|palak|shaak|shak|saag|methi|amaranth/i',
            'Fresh Herbs & Leaves' => '/herb|coriander|dhania|mint|pudina|curry leaf|bay leaf|basil/i',
            'Mushrooms' => '/mushroom/i',
            'Fresh Gourds' => '/gourd|squash|bottle|ridge|snake|ash|bitter|lauki|lau\b|pumpkin/i',
            'Fresh Aubergine & Okra' => '/aubergine|eggplant|begun|brinjal|okra|bhindi|ladies finger|dheros/i',
            'Potatoes & Sweet Potatoes' => '/potato|sweet potato|edoe|taro|yam|cassava/i',
            'Root Vegetables' => '/onion|garlic|ginger|turmeric|carrot|beetroot|turnip/i',
        ]);

        $this->redistribute('fresh-meat-chicken', [
            'Whole Chicken' => '/whole chicken/i',
            'Chicken Breast' => '/chicken breast|breast fillet/i',
            'Chicken Thighs & Drumsticks' => '/thigh|drumstick|leg quarter/i',
            'Chicken Wings' => '/wing/i',
            'Mince & Keema' => '/mince|keema/i',
            'Chicken Liver & Gizzard' => '/liver|gizzard|giblet|heart/i',
            'Lamb Chops & Steaks' => '/lamb|chop|steak|rack/i',
            'Goat Curry Pieces' => '/goat|mutton|seena|shoulder|rib|back|neck|shank/i',
        ]);

        $this->redistribute('biscuits', [
            'Sweet Biscuits' => '/sweet|sugar|cream|pineapple|chocolate|choco|cookie|kheer/i',
            'Savoury Biscuits' => '/salted|savoury|cheese|cracker/i',
            'Cream Biscuits' => '/cream\b/i',
            'Cookies' => '/cookie/i',
            'Rusks & Toast' => '/rusk|toast|dry cake/i',
            'Wafers' => '/wafer/i',
            'Digestive Biscuits' => '/digestive|whole ?wheat|fiber|health/i',
            'Desi Biscuits' => '/energy|malted|milk|tea biscuit|choice/i',
        ]);

        $this->redistribute('seasonal-fruits', [
            'Mangoes' => '/mango|aam\b/i',
            'Tropical Fruits' => '/pineapple|papaya|passion|guava|lychee|jackfruit|dragon/i',
            'Citrus Fruits' => '/orange|lemon|lime|grapefruit|tangerine|clementine/i',
            'Berries' => '/berry|strawberry|blueberry|raspberry|cherry/i',
            'Apples & Pears' => '/apple|pear\b/i',
            'Bananas & Plantains' => '/banana|banna|plantain/i',
            'Grapes & Melons' => '/grape|melon|watermelon/i',
        ]);

        $this->redistribute('chilled-foods', [
            'Fresh Paneer & Tofu' => '/paneer|tofu/i',
            'Yogurt & Lassi' => '/yogurt|lassi|dahi|raita/i',
            'Dips & Spreads' => '/dip|spread|hummus|puck|kiri|cream cheese/i',
            'Chilled Desserts' => '/dessert|pudding|custard|jelly/i',
            'Cooked Meats' => '/salami|turkey|mortadella|frankfurter|rashers|sausage|sliced/i',
        ]);

        $this->redistribute('frozen-fruit-veg', [
            'Frozen Mixed Vegetables' => '/mixed vegetable/i',
            'Frozen Peas & Sweetcorn' => '/pea|sweetcorn|corn/i',
            'Frozen Spinach & Greens' => '/spinach|methi|saag|leaf|leaves|shatkora/i',
            'Frozen Berries' => '/berry|strawberry/i',
            'Frozen Tropical Fruits' => '/mango|jackfruit|pineapple/i',
            'Frozen Herbs' => '/herb|garlic clove|peeled garlic/i',
            'Frozen Onions & Peppers' => '/onion|pepper|chilli/i',
            'Frozen Stir-Fry Mix' => '/stir|okra|cut|kochur|mukhi/i',
        ]);

        $this->redistribute('drinks', [
            'Soft Drinks & Fizzy' => '/cola|tango|fanta|sprite|pepsi|sparkling|fizzy|can\b/i',
            'Juices & Nectar' => '/juice|nectar|rubicon/i',
            'Water' => '/water\b(?!.*melon)/i',
            'Energy & Health Drinks' => '/energy|prime|hydration|health|lucozade|boost/i',
            'Mango & Tropical Drinks' => '/mango|tropical|lychee|passion|guava/i',
            'Lassi & Yogurt Drinks' => '/lassi|yogurt drink|ayran/i',
            'Coconut Water' => '/coconut water/i',
            'Squash & Cordials' => '/squash|cordial|concentrate|syrup/i',
        ]);

        $this->redistribute('dry-fruits-nuts', [
            'Almonds' => '/almond/i',
            'Cashews' => '/cashew/i',
            'Pistachios' => '/pistachio/i',
            'Walnuts' => '/walnut/i',
            'Dates (Dried)' => '/date\b|khejur/i',
            'Raisins & Sultanas' => '/raisin|sultana|currant/i',
            'Mixed Nuts' => '/mixed|assorted/i',
            'Seeds' => '/seed|daria|pumpkin seed|sunflower seed|chia|flax/i',
        ]);

        $this->redistribute('tea-coffee', [
            'Loose Leaf Tea' => '/\btea\b(?!.*bag)(?!.*green)(?!.*herbal)(?!.*camomile)/i',
            'Tea Bags' => '/tea bag/i',
            'Green Tea' => '/green tea/i',
            'Herbal & Speciality Tea' => '/herbal|camomile|lemongrass|speciality/i',
            'Instant Coffee' => '/instant|nescafe|kenco/i',
            'Ground Coffee' => '/ground coffee|beans/i',
            'Masala Chai' => '/masala|chai\b/i',
            'Coffee Whitener & Creamer' => '/coffee.?mate|creamer|whitener/i',
        ]);
    }

    private function redistribute(string $parentSlug, array $rules): void
    {
        $parent = Category::where('slug', $parentSlug)->first();
        if (!$parent) {
            $this->command->warn("Parent category not found: {$parentSlug}");
            return;
        }

        $products = Product::where('category_id', $parent->id)->get();
        if ($products->isEmpty()) {
            return;
        }

        // Load subcategory IDs by name
        $subCatMap = [];
        foreach ($rules as $subCatName => $pattern) {
            $subCat = Category::where('name', $subCatName)
                ->where('parent_id', $parent->id)
                ->first();
            if ($subCat) {
                $subCatMap[$subCatName] = ['id' => $subCat->id, 'pattern' => $pattern];
            }
        }

        // Get first child as fallback
        $firstChild = Category::where('parent_id', $parent->id)->orderBy('sort_order')->first();
        $moved = 0;

        foreach ($products as $product) {
            $title = $product->title;
            $desc = $product->description ?? '';
            $matchText = $title . ' ' . $desc;
            $targetId = null;

            foreach ($subCatMap as $name => $info) {
                if (preg_match($info['pattern'], $matchText)) {
                    $targetId = $info['id'];
                    break;
                }
            }

            // Fallback to first subcategory
            if (!$targetId && $firstChild) {
                $targetId = $firstChild->id;
            }

            if ($targetId) {
                $product->category_id = $targetId;
                $product->save();
                $moved++;
            }
        }

        $this->command->info("{$parent->name}: moved {$moved}/{$products->count()} products");

        // Show distribution
        $children = Category::where('parent_id', $parent->id)->orderBy('sort_order')->get();
        foreach ($children as $child) {
            $count = Product::where('category_id', $child->id)->count();
            if ($count > 0) {
                $this->command->line("  {$child->name}: {$count}");
            }
        }
    }
}
