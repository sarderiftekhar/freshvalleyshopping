<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class RedistributeLiveFishSeeder extends Seeder
{
    public function run(): void
    {
        $liveFish = Category::where('slug', 'live-fish')->first();
        if (!$liveFish) {
            $this->command->warn('Live Fish category not found');
            return;
        }

        $subCats = [
            'small' => Category::where('slug', 'small-river-fish')->first(),
            'medium' => Category::where('slug', 'medium-river-fish')->first(),
            'large' => Category::where('slug', 'large-river-fish')->first(),
            'sea' => Category::where('slug', 'sea-fish')->first(),
            'catfish' => Category::where('slug', 'catfish')->first(),
            'carp' => Category::where('slug', 'carp-fish')->first(),
            'tilapia' => Category::where('slug', 'tilapia')->first(),
            'prawns' => Category::where('slug', 'live-prawns-shrimps')->first(),
        ];

        $products = Product::where('category_id', $liveFish->id)->get();
        $moved = 0;

        foreach ($products as $product) {
            $name = strtolower($product->title);
            $target = null;

            // Prawns & Shrimps
            if (preg_match('/prawn|shrimp|chingri|essa/i', $name)) {
                $target = $subCats['prawns'];
            }
            // Catfish varieties (Magur, Shing, Baim, Pangush/Pangasius)
            elseif (preg_match('/magur|shing|shingi|baim|long baim|star baim|pangush|pangasius/i', $name)) {
                $target = $subCats['catfish'];
            }
            // Tilapia
            elseif (preg_match('/tilapia/i', $name)) {
                $target = $subCats['tilapia'];
            }
            // Large river fish (Rohu, Katla, Boal, Ayer, Chitol, King Fish, Koral, Shoil, Mrigal, Hilsha, Carfu)
            elseif (preg_match('/rohu|katla|boal|ayer|ayre|chitol|king fish|koral|shoil|mrigal|hilsha|carfu/i', $name)) {
                $target = $subCats['large'];
            }
            // Sea fish (Pomfret, Rupchanda)
            elseif (preg_match('/pomfret|rupchanda/i', $name)) {
                $target = $subCats['sea'];
            }
            // Carp fish (Kalibaush, Shorputi/Sarputi, Koi, Bata, Puti)
            elseif (preg_match('/kalibaush|shorputi|sarputi|koi\b|bata\b|puti/i', $name)) {
                $target = $subCats['carp'];
            }
            // Small river fish (Pabda, Tengra, Mola, Keski, Chapila, Phona, Batashi, Kajoli, Gutum, Bashpata, Meni, Taki, Nola, Bailla, Kaika, Bacha, Lotia, Gulsha)
            elseif (preg_match('/pabda|tengra|mol[ai]|keski|chapila|phona|smelt|batashi|kajoli|gutum|bashpata|baspata|meni|taki|channa|nola|bail[la]|kaika|bacha|lotia|gulsha/i', $name)) {
                $target = $subCats['small'];
            }
            // Default: medium river fish
            else {
                $target = $subCats['medium'];
            }

            if ($target) {
                $product->category_id = $target->id;
                $product->save();
                $moved++;
                $this->command->line("  {$product->title} -> {$target->name}");
            }
        }

        $this->command->info("Moved {$moved}/{$products->count()} Live Fish products into subcategories.");

        // Show final counts
        $children = Category::where('parent_id', $liveFish->id)->orderBy('sort_order')->get();
        foreach ($children as $child) {
            $count = Product::where('category_id', $child->id)->count();
            $this->command->line("  {$child->name}: {$count}");
        }
    }
}
