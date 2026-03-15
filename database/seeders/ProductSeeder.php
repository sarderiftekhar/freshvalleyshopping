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
        $products = [
            // Beef
            ['title' => 'Beef Steak', 'price' => 14.99, 'sale_price' => 12.99, 'category' => 'Beef', 'unit' => 'per kg', 'quantity' => 30, 'brand' => 'Fresh Valley', 'description' => 'Premium halal beef steak, tender and juicy. Perfect for grilling or pan-frying.', 'is_featured' => true, 'image' => '/assets/img/product/meat/beef-steak.jpg'],
            ['title' => 'Beef Mince', 'price' => 7.99, 'sale_price' => 6.49, 'category' => 'Beef', 'unit' => 'per kg', 'quantity' => 50, 'brand' => 'Fresh Valley', 'description' => 'Lean halal beef mince, perfect for kebabs, kofta and bolognese.', 'is_featured' => true, 'image' => '/assets/img/product/meat/beef-mince.jpg'],
            ['title' => 'Beef Brisket', 'price' => 11.99, 'sale_price' => null, 'category' => 'Beef', 'unit' => 'per kg', 'quantity' => 25, 'brand' => 'Fresh Valley', 'description' => 'Halal beef brisket, ideal for slow cooking, smoking or braising.', 'image' => '/assets/img/product/meat/beef-brisket.jpg'],
            ['title' => 'Beef Curry Cut', 'price' => 9.99, 'sale_price' => 8.49, 'category' => 'Beef', 'unit' => 'per kg', 'quantity' => 40, 'brand' => 'Fresh Valley', 'description' => 'Halal beef diced into cubes, ready for curries, stews and casseroles.', 'image' => '/assets/img/product/meat/beef-curry-cut.jpg'],
            ['title' => 'Oxtail', 'price' => 10.99, 'sale_price' => null, 'category' => 'Beef', 'unit' => 'per kg', 'quantity' => 15, 'brand' => 'Fresh Valley', 'description' => 'Halal oxtail pieces, perfect for rich stews, soups and traditional recipes.', 'image' => '/assets/img/product/meat/oxtail.jpg'],

            // Lamb
            ['title' => 'Lamb Leg Bone-In', 'price' => 12.99, 'sale_price' => null, 'category' => 'Lamb', 'unit' => 'per kg', 'quantity' => 30, 'brand' => 'Fresh Valley', 'description' => 'Premium halal lamb leg, bone-in. Ideal for slow roasting or traditional dishes.', 'is_featured' => true, 'image' => '/assets/img/product/meat/lamb-leg.jpg'],
            ['title' => 'Lamb Chops', 'price' => 15.99, 'sale_price' => 13.99, 'category' => 'Lamb', 'unit' => 'per kg', 'quantity' => 25, 'brand' => 'Fresh Valley', 'description' => 'Tender halal lamb chops, perfect for grilling, barbecue or pan-frying.', 'is_featured' => true, 'image' => '/assets/img/product/meat/lamb-chops.jpg'],
            ['title' => 'Lamb Shoulder', 'price' => 10.99, 'sale_price' => null, 'category' => 'Lamb', 'unit' => 'per kg', 'quantity' => 20, 'brand' => 'Fresh Valley', 'description' => 'Halal lamb shoulder, great for slow roasting or pulling.', 'image' => '/assets/img/product/meat/lamb-shoulder.jpg'],
            ['title' => 'Lamb Mince', 'price' => 9.99, 'sale_price' => 8.49, 'category' => 'Lamb', 'unit' => 'per kg', 'quantity' => 35, 'brand' => 'Fresh Valley', 'description' => 'Lean halal lamb mince, ideal for kofta, keema and shepherd\'s pie.', 'image' => '/assets/img/product/meat/lamb-mince.jpg'],
            ['title' => 'Lamb Ribs', 'price' => 11.49, 'sale_price' => null, 'category' => 'Lamb', 'unit' => 'per kg', 'quantity' => 20, 'brand' => 'Fresh Valley', 'description' => 'Halal lamb ribs, succulent and flavourful. Great for barbecue or oven roasting.', 'image' => '/assets/img/product/meat/lamb-ribs.jpg'],

            // Goat
            ['title' => 'Goat Curry Cut', 'price' => 12.99, 'sale_price' => 10.99, 'category' => 'Goat', 'unit' => 'per kg', 'quantity' => 25, 'brand' => 'Fresh Valley', 'description' => 'Halal goat meat diced for curries. Rich flavour, perfect for traditional recipes.', 'is_featured' => true, 'image' => '/assets/img/product/meat/goat-curry-cut.jpg'],
            ['title' => 'Goat Leg', 'price' => 14.99, 'sale_price' => null, 'category' => 'Goat', 'unit' => 'per kg', 'quantity' => 15, 'brand' => 'Fresh Valley', 'description' => 'Halal whole goat leg, ideal for slow roasting or festive occasions.', 'image' => '/assets/img/product/meat/goat-leg.jpg'],
            ['title' => 'Goat Ribs', 'price' => 11.99, 'sale_price' => null, 'category' => 'Goat', 'unit' => 'per kg', 'quantity' => 15, 'brand' => 'Fresh Valley', 'description' => 'Halal goat ribs, tender and flavourful. Perfect for grilling or slow cooking.', 'image' => '/assets/img/product/meat/goat-ribs.jpg'],
            ['title' => 'Goat Mince', 'price' => 10.99, 'sale_price' => 9.49, 'category' => 'Goat', 'unit' => 'per kg', 'quantity' => 20, 'brand' => 'Fresh Valley', 'description' => 'Lean halal goat mince for kebabs, keema naan and samosa filling.', 'image' => '/assets/img/product/meat/goat-mince.jpg'],

            // Chicken
            ['title' => 'Halal Chicken Whole', 'price' => 5.99, 'sale_price' => 4.99, 'category' => 'Chicken', 'unit' => 'per kg', 'quantity' => 50, 'brand' => 'Fresh Valley', 'description' => 'Certified halal whole chicken, freshly sourced from trusted farms. Perfect for roasting or curries.', 'is_featured' => true, 'image' => '/assets/img/product/meat/chicken-whole.jpg'],
            ['title' => 'Chicken Breast Fillets', 'price' => 8.49, 'sale_price' => null, 'category' => 'Chicken', 'unit' => 'per kg', 'quantity' => 45, 'brand' => 'Fresh Valley', 'description' => 'Boneless, skinless halal chicken breast fillets. Versatile and lean.', 'image' => '/assets/img/product/meat/chicken-breast.jpg'],
            ['title' => 'Chicken Thighs', 'price' => 6.49, 'sale_price' => 5.49, 'category' => 'Chicken', 'unit' => 'per kg', 'quantity' => 40, 'brand' => 'Fresh Valley', 'description' => 'Halal chicken thighs, bone-in and skin-on. Juicy and full of flavour.', 'image' => '/assets/img/product/meat/chicken-thighs.jpg'],
            ['title' => 'Chicken Wings', 'price' => 4.99, 'sale_price' => null, 'category' => 'Chicken', 'unit' => 'per kg', 'quantity' => 50, 'brand' => 'Fresh Valley', 'description' => 'Halal chicken wings, perfect for grilling, frying or baking with your favourite marinade.', 'image' => '/assets/img/product/meat/chicken-wings.jpg'],
            ['title' => 'Chicken Drumsticks', 'price' => 5.49, 'sale_price' => 4.49, 'category' => 'Chicken', 'unit' => 'per kg', 'quantity' => 45, 'brand' => 'Fresh Valley', 'description' => 'Halal chicken drumsticks, great for barbecues, curries and kids\' meals.', 'image' => '/assets/img/product/meat/chicken-drumsticks.jpg'],

            // Fresh Fish
            ['title' => 'Whole Sea Bass', 'price' => 9.99, 'sale_price' => null, 'category' => 'Fresh Fish', 'unit' => 'per kg', 'quantity' => 20, 'brand' => 'Fresh Valley', 'description' => 'Fresh whole sea bass, cleaned and gutted. Great for grilling or steaming.', 'image' => '/assets/img/product/new/product-img-6.jpg'],
            ['title' => 'King Prawns', 'price' => 14.99, 'sale_price' => 12.99, 'category' => 'Fresh Fish', 'unit' => 'per kg', 'quantity' => 15, 'brand' => 'Fresh Valley', 'description' => 'Large king prawns, deveined and ready to cook. Perfect for curries and stir-fries.', 'is_featured' => true, 'image' => '/assets/img/product/new/product-img-7.jpg'],
            ['title' => 'Salmon Fillets', 'price' => 11.99, 'sale_price' => null, 'category' => 'Fresh Fish', 'unit' => 'per kg', 'quantity' => 20, 'brand' => 'Fresh Valley', 'description' => 'Fresh Atlantic salmon fillets, rich in omega-3. Great for grilling or baking.', 'image' => '/assets/img/product/new/product-img-8.jpg'],
            ['title' => 'Hilsa Fish', 'price' => 16.99, 'sale_price' => null, 'category' => 'Fresh Fish', 'unit' => 'per kg', 'quantity' => 10, 'brand' => 'Fresh Valley', 'description' => 'Premium Hilsa fish, a delicacy in Bengali cuisine. Rich flavour and tender meat.', 'image' => '/assets/img/product/new/product-img-9.jpg'],

            // Vegetables
            ['title' => 'Fresh Coriander Bunch', 'price' => 0.79, 'sale_price' => null, 'category' => 'Vegetables', 'unit' => 'per bunch', 'quantity' => 100, 'brand' => null, 'description' => 'Freshly picked coriander, essential for Asian cooking.', 'image' => '/assets/img/product/new/product-img-10.jpg'],
            ['title' => 'Green Chillies', 'price' => 1.29, 'sale_price' => 0.99, 'category' => 'Vegetables', 'unit' => 'per 200g', 'quantity' => 80, 'brand' => null, 'description' => 'Fresh green chillies, perfect heat for your curries and salads.', 'image' => '/assets/img/product/new/product-img-11.jpg'],
            ['title' => 'Onions', 'price' => 1.49, 'sale_price' => null, 'category' => 'Vegetables', 'unit' => 'per kg', 'quantity' => 200, 'brand' => null, 'description' => 'Fresh brown onions, a kitchen staple for all your cooking needs.', 'image' => '/assets/img/product/new/product-img-12.jpg'],
            ['title' => 'Garlic', 'price' => 2.49, 'sale_price' => null, 'category' => 'Vegetables', 'unit' => 'per 500g', 'quantity' => 100, 'brand' => null, 'description' => 'Fresh garlic bulbs, aromatic and flavourful.', 'image' => '/assets/img/product/new/product-img-13.jpg'],
            ['title' => 'Fresh Ginger', 'price' => 3.99, 'sale_price' => 2.99, 'category' => 'Vegetables', 'unit' => 'per 500g', 'quantity' => 80, 'brand' => null, 'description' => 'Fresh root ginger, essential for Asian and South Asian recipes.', 'image' => '/assets/img/product/new/product-img-14.jpg'],

            // Rice & Grains
            ['title' => 'Tilda Basmati Rice', 'price' => 15.99, 'sale_price' => 13.99, 'category' => 'Rice & Grains', 'unit' => '5kg', 'quantity' => 60, 'brand' => 'Tilda', 'description' => 'Premium aged basmati rice. Long grain, fluffy and aromatic.', 'is_featured' => true, 'image' => '/assets/img/product/new/product-img-15.jpg'],
            ['title' => 'Red Lentils (Masoor Dal)', 'price' => 3.49, 'sale_price' => null, 'category' => 'Rice & Grains', 'unit' => 'per kg', 'quantity' => 70, 'brand' => null, 'description' => 'Split red lentils, perfect for dal and soups.', 'image' => '/assets/img/product/new/product-img-16.jpg'],
            ['title' => 'Chickpeas (Chana)', 'price' => 2.99, 'sale_price' => null, 'category' => 'Rice & Grains', 'unit' => 'per kg', 'quantity' => 60, 'brand' => null, 'description' => 'Dried chickpeas, great for chana masala and hummus.', 'image' => '/assets/img/product/new/product-img-17.jpg'],

            // Spices & Herbs
            ['title' => 'Turmeric Powder', 'price' => 2.49, 'sale_price' => null, 'category' => 'Spices & Herbs', 'unit' => '200g', 'quantity' => 100, 'brand' => 'Shan', 'description' => 'Pure ground turmeric powder. Essential spice for curries.', 'image' => '/assets/img/product/new/product-img-18.jpg'],
            ['title' => 'Cumin Seeds', 'price' => 2.99, 'sale_price' => null, 'category' => 'Spices & Herbs', 'unit' => '200g', 'quantity' => 90, 'brand' => 'Shan', 'description' => 'Whole cumin seeds, aromatic and flavourful for tempering.', 'image' => '/assets/img/product/new/product-img-19.jpg'],
            ['title' => 'Garam Masala', 'price' => 3.49, 'sale_price' => 2.99, 'category' => 'Spices & Herbs', 'unit' => '200g', 'quantity' => 80, 'brand' => 'Shan', 'description' => 'Authentic blend of ground spices. The finishing touch for any curry.', 'image' => '/assets/img/product/new/product-img-20.jpg'],

            // Dairy & Eggs
            ['title' => 'Free Range Eggs', 'price' => 3.29, 'sale_price' => null, 'category' => 'Dairy & Eggs', 'unit' => '12 pack', 'quantity' => 50, 'brand' => null, 'description' => 'Large free-range eggs, perfect for breakfast and baking.', 'image' => '/assets/img/product/new/product-img-21.jpg'],
            ['title' => 'Paneer', 'price' => 3.99, 'sale_price' => null, 'category' => 'Dairy & Eggs', 'unit' => '250g', 'quantity' => 40, 'brand' => null, 'description' => 'Fresh Indian cottage cheese, ideal for paneer tikka and curries.', 'image' => '/assets/img/product/new/product-img-22.jpg'],

            // Frozen Foods
            ['title' => 'Frozen Parathas', 'price' => 3.99, 'sale_price' => 3.49, 'category' => 'Frozen Foods', 'unit' => '5 pack', 'quantity' => 60, 'brand' => 'Kawan', 'description' => 'Flaky frozen parathas, ready to cook. Perfect with any curry.', 'image' => '/assets/img/product/new/product-img-23.jpg'],
            ['title' => 'Frozen Samosas', 'price' => 4.99, 'sale_price' => null, 'category' => 'Frozen Foods', 'unit' => '12 pack', 'quantity' => 45, 'brand' => null, 'description' => 'Crispy vegetable samosas, ready to fry or bake.', 'image' => '/assets/img/product/products1-min.jpg'],

            // Snacks & Drinks
            ['title' => 'Mango Juice', 'price' => 2.49, 'sale_price' => 1.99, 'category' => 'Snacks & Drinks', 'unit' => '1L', 'quantity' => 70, 'brand' => 'Rubicon', 'description' => 'Refreshing mango juice drink. A tropical favourite.', 'image' => '/assets/img/product/products2-min.jpg'],
            ['title' => 'Bombay Mix', 'price' => 1.99, 'sale_price' => null, 'category' => 'Snacks & Drinks', 'unit' => '300g', 'quantity' => 80, 'brand' => null, 'description' => 'Classic spiced snack mix. Perfect for tea time.', 'image' => '/assets/img/product/products3-min.jpg'],
        ];

        foreach ($products as $index => $data) {
            $category = Category::where('name', $data['category'])->first();

            $product = Product::create([
                'sku' => 'FV-' . str_pad($index + 1, 4, '0', STR_PAD_LEFT),
                'title' => $data['title'],
                'slug' => Str::slug($data['title']),
                'price' => $data['price'],
                'sale_price' => $data['sale_price'] ?? null,
                'category_id' => $category->id,
                'brand' => $data['brand'] ?? null,
                'quantity' => $data['quantity'],
                'unit' => $data['unit'],
                'description' => $data['description'],
                'tags' => ['halal', strtolower($category->name)],
                'is_halal_certified' => true,
                'halal_certification_body' => 'HMC',
                'status' => 'published',
                'sold' => rand(0, 30),
                'sort_order' => $index,
                'is_featured' => $data['is_featured'] ?? false,
            ]);

            ProductImage::create([
                'product_id' => $product->id,
                'path' => $data['image'],
                'is_primary' => true,
                'sort_order' => 0,
            ]);
        }
    }
}
