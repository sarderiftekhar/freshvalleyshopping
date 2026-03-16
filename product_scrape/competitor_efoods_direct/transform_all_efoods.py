"""
Transform 607 eFoods Direct products into Fresh Valley Shopping import format.
Skips 128 fish products already imported via EfoodsFishSeeder.
"""
import json
import re
import os
import pathlib
import urllib.request

PROJECT_ROOT = pathlib.Path(__file__).resolve().parent.parent.parent

# Load already-imported fish SKUs to skip
fish_skus = set()
fish_json = PROJECT_ROOT / 'database' / 'data' / 'efoods_fish_products.json'
if fish_json.exists():
    with open(fish_json, 'r', encoding='utf-8') as f:
        for fp in json.load(f):
            fish_skus.add(fp.get('sku_source', ''))

# Load all 607 products
with open('all_products_607.json', 'r', encoding='utf-8') as f:
    all_products = json.load(f)

# Specific eFoods detailCategories -> our subcategory name (checked FIRST)
SPECIFIC_CATEGORY_MAP = {
    # Spices & Herbs
    'Whole Spices': 'Whole Spices',
    'Ground Spices': 'Ground Spices',
    'Ready Spices': 'Spice Mixes & Masala',
    'Spice Mixes': 'Spice Mixes & Masala',
    'Spice Mixes & Pastes': 'Spice Mixes & Masala',
    'Curry Pastes': 'Curry Powder & Paste',
    'Dry Herbs': 'Dried Herbs',
    'Herbs': 'Dried Herbs',
    'Chilli': 'Chilli Powder & Flakes',
    'Chilli Powder & Flakes': 'Chilli Powder & Flakes',
    'Seasonings & Coatings': 'Spice Mixes & Masala',
    'Seasonings': 'Spice Mixes & Masala',

    # Meat & Poultry
    'Chicken': 'Whole Chicken',
    'Chicken Breast': 'Chicken Breast',
    'Chicken Wings': 'Chicken Wings',
    'Beef': 'Halal Beef',
    'Lamb': 'Halal Lamb',
    'Mutton/Sheep': 'Halal Mutton',
    'Goat': 'Halal Goat',
    'Marinated': 'Marinated Meat',
    'Marinated Meats': 'Marinated Meat',
    'Online Meat Shop': 'Halal Beef',

    # Frozen specific
    'Frozen Burgers, Nuggets & Sausages': 'Frozen Pizza & Burgers',
    'Frozen Snack Foods': 'Frozen Snacks',
    'Frozen Chips, Onion Rings & Potatoes': 'Frozen Fries & Wedges',
    'Frozen Vegetables': 'Frozen Mixed Vegetables',
    'Frozen Samosa & Rolls': 'Samosa & Spring Rolls',
    'Frozen Ready Meals & Paratha': 'Ready Meals',
    'Parathas & Chapatti': 'Parathas & Chapati',
    'Parathas & Naan': 'Frozen Naan & Roti',
    'Samosa & Spring Rolls': 'Samosa & Spring Rolls',
    'Ice Cream': 'Ice Cream & Kulfi',

    # Grocery
    'Oils & Condiments': 'Cooking Oil & Ghee',
    'Ghee & Oils': 'Cooking Oil & Ghee',
    'Oils': 'Cooking Oil & Ghee',
    'Oils & Ghee': 'Cooking Oil & Ghee',
    'Cooking Ingredients': 'Vinegar & Cooking Essentials',
    'Canned & Tinned': 'Canned & Tinned Foods',
    'Canned & Packet Goods': 'Canned & Tinned Foods',
    'Tin, Cans & Packets': 'Canned & Tinned Foods',
    'Tinned Fruits': 'Canned & Tinned Foods',
    'Sauces': 'Sauces & Condiments',
    'Sauces, Pastes & Puree': 'Sauces & Condiments',
    'Cooking Sauces': 'Sauces & Condiments',
    'Cooking Sauce & Marinade Sauces': 'Sauces & Condiments',
    'Table Sauces': 'Sauces & Condiments',
    'Pickles & Chutneys': 'Pickles & Chutneys',
    'Pickles & Condiments': 'Pickles & Chutneys',
    'Pickles & Dried Products': 'Pickles & Chutneys',
    'Noodles': 'Noodles & Pasta',
    'Noodles & Pasta': 'Noodles & Pasta',
    'Dried Pasta & Noodles': 'Noodles & Pasta',
    'Coconut Milk & Cream': 'Coconut & Coconut Products',
    'Honey': 'Honey & Syrups',
    'Vinegar & Dressings': 'Vinegar & Cooking Essentials',
    'Salt': 'Salt & Sugar',
    'Sugar': 'Salt & Sugar',

    # Rice, Flour & Lentils
    'Rice': 'Basmati Rice',
    'Basmati Rice': 'Basmati Rice',
    'Basmati': 'Basmati Rice',
    'Other Rice Type': 'Non-Basmati Rice',
    'Long Grain': 'Non-Basmati Rice',
    'Ground Rice': 'Non-Basmati Rice',
    'Rice Flour': 'Flour & Atta',
    'Flour': 'Flour & Atta',
    'Flour & Bread': 'Flour & Atta',
    'Chapatti Flour': 'Flour & Atta',
    'Semolina & Coconut Flour': 'Wheat & Semolina',
    'Lentils': 'Lentils & Dal',
    'Lentils & Pulses': 'Lentils & Dal',
    'Red Lentils': 'Lentils & Dal',
    'Chana Daal': 'Lentils & Dal',
    'Pulses & Beans': 'Beans & Pulses',
    'Chickpeas & Kala Chana': 'Chickpeas & Gram',

    # Biscuits & Bakery
    'Biscuits': 'Sweet Biscuits',
    'Biscuits & Cakes': 'Sweet Biscuits',
    'Savoury': 'Savoury Biscuits',
    'Bakery': 'Bread & Rolls',
    'Cakes & Pastry': 'Cakes & Pastries',

    # Snacks & Confectionery
    'Snacks': 'Crisps & Chips',
    'Crisps & Snacks': 'Crisps & Chips',
    'Snack Foods': 'Crisps & Chips',
    'Confectionery & Snacks': 'Chocolate & Sweets',
    'Confectionery': 'Chocolate & Sweets',
    'Sweets & Chocolate': 'Chocolate & Sweets',

    # Desserts
    'Desserts & Home Baking': 'Frozen Sweets & Desserts',
    'Desserts': 'Frozen Sweets & Desserts',

    # Dairy & Chilled
    'Cheese & Paneer': 'Paneer',
    'Dairy': 'Cream & Yogurt',
    'Dairy & Eggs': 'Cream & Yogurt',
    'Chilled Foods': 'Cooked Meats',
    'Jams, Sweet & Savoury Spread': 'Honey & Syrups',

    # Fresh Food
    'Fresh Vegetables': 'Desi Vegetables',
    'Asian Vegetables': 'Desi Vegetables',
    'Fresh Fruits': 'Tropical Fruits',
    'Fresh Herbs': 'Fresh Herbs & Leaves',

    # Dry Fruits & Nuts
    'Dried Fruits, Nuts & Seeds': 'Mixed Nuts',
    'Dried Fruit, Nuts & Seeds': 'Mixed Nuts',
    'Dry Fruits & Nuts': 'Mixed Nuts',

    # Drinks
    'Soft Drinks': 'Soft Drinks & Fizzy',
    'Juices': 'Juices & Nectar',
    'Juices & Smoothies': 'Juices & Nectar',
    'Water': 'Water',
    'Tea': 'Loose Leaf Tea',
    'Hot Drinks': 'Loose Leaf Tea',
    'Coffee': 'Instant Coffee',

    # Household & Other
    'Household': 'Vinegar & Cooking Essentials',
    'Homeware': 'Vinegar & Cooking Essentials',
    'Household & Homeware': 'Vinegar & Cooking Essentials',
    'Popup': 'Vinegar & Cooking Essentials',
}

# General/parent eFoods categories -> our subcategory (checked SECOND, as fallback)
GENERAL_CATEGORY_MAP = {
    'Spices': 'Ground Spices',
    'Spice Bazaar': 'Ground Spices',
    'Meat & Poultry': 'Halal Beef',
    'Chilled & Frozen': 'Frozen Snacks',
    'Frozen Foods': 'Frozen Snacks',
    'Food Cupboard': 'Vinegar & Cooking Essentials',
    'Rice, Flour & Lentils': 'Basmati Rice',
    'Fresh Food': 'Desi Vegetables',
    'Drinks': 'Soft Drinks & Fizzy',
    'Pantry': 'Canned & Tinned Foods',
    'Herbal & Medical': 'Loose Leaf Tea',
}

# Name-based classification for Miscellaneous/Special Offers products
NAME_RULES = [
    (r'chicken|fillet|nugget|wing|breast', 'Frozen Pizza & Burgers'),
    (r'paratha|chapati|naan', 'Parathas & Chapati'),
    (r'samosa|roll|spring roll', 'Samosa & Spring Rolls'),
    (r'biscuit|cookie|nimky|nunta', 'Sweet Biscuits'),
    (r'toast|rusk', 'Rusks & Toast'),
    (r'coconut|narikel', 'Coconut & Coconut Products'),
    (r'spice|masala|javantry|jawantri|mace|powder', 'Ground Spices'),
    (r'mukhi|frozen', 'Frozen Snacks'),
    (r'lamb|beef|mutton|goat', 'Halal Lamb'),
    (r'duck', 'Halal Beef'),
    (r'rohu|katla|boal|hilisha|mirgal|pabda|tengra|fish', 'Frozen Whole Fish'),
    (r'prawn|shrimp|king prawn', 'King Prawns & Shrimps'),
    (r'tea|chai', 'Loose Leaf Tea'),
    (r'green tea', 'Green Tea'),
    (r'bin bag|towel|detergent|daz|cleaning', 'Vinegar & Cooking Essentials'),
    (r'condensed milk|evaporated', 'Condensed & Evaporated Milk'),
    (r'tomato|pepper|chana|chickpea|tin|can', 'Canned & Tinned Foods'),
    (r'mango.*slice|mango.*syrup', 'Canned & Tinned Foods'),
]

# Fallback: eFoods topCategory -> our subcategory
TOP_CATEGORY_FALLBACK = {
    'Food Cupboard': 'Vinegar & Cooking Essentials',
    'Spice Bazaar': 'Ground Spices',
    'Rice, Flour & Lentils': 'Basmati Rice',
    'Chilled & Frozen': 'Frozen Snacks',
    'Meat & Poultry': 'Halal Beef',
    'Fresh Food': 'Desi Vegetables',
    'Drinks': 'Soft Drinks & Fizzy',
    'Household & Homeware': 'Vinegar & Cooking Essentials',
    'Miscellaneous': 'Vinegar & Cooking Essentials',
    'Special Offers': 'Vinegar & Cooking Essentials',
    'MULTI BUY': 'Vinegar & Cooking Essentials',
}


def sku_to_name(sku):
    """Convert SKU slug to readable product name."""
    name = sku.replace('-', ' ')
    # Capitalize each word
    words = name.split()
    result = []
    for w in words:
        if w.upper() in ('KG', 'ML', 'GM', 'G', 'LTR', 'PCS', 'PKT'):
            result.append(w.upper())
        elif len(w) <= 2 and w.isalpha():
            result.append(w.upper())
        else:
            result.append(w.capitalize())
    return ' '.join(result)


def parse_price(product):
    """Extract best price."""
    for field in ['salePrice', 'regularPrice', 'priceText']:
        val = str(product.get(field, ''))
        match = re.search(r'[\d.]+', val)
        if match:
            price = float(match.group())
            if price > 0:
                return price
    return 0


def parse_sale_price(product):
    """Extract sale price only if on sale."""
    if product.get('onSale'):
        val = str(product.get('salePrice', ''))
        match = re.search(r'[\d.]+', val)
        if match:
            return float(match.group())
    return None


def parse_regular_price(product):
    """Get regular (non-sale) price."""
    val = str(product.get('regularPrice', ''))
    match = re.search(r'[\d.]+', val)
    if match:
        price = float(match.group())
        if price > 0:
            return price
    val = str(product.get('priceText', ''))
    match = re.search(r'[\d.]+', val)
    if match:
        return float(match.group())
    return 0


def get_best_image(product):
    """Get best available image URL."""
    # Prefer gallery images (real URLs)
    gallery = product.get('galleryImages', [])
    if gallery and isinstance(gallery, list):
        for img in gallery:
            if isinstance(img, str) and img.startswith('http') and 'svg' not in img:
                return img
    # Fallback to main image if real
    main = product.get('image', '')
    if main.startswith('http') and 'svg' not in main:
        return main
    return None


def get_category_name(product):
    """Map eFoods categories to our subcategory name. Checks specific first, then name, then general."""
    detail_cats = product.get('detailCategories', [])
    if isinstance(detail_cats, list):
        # First pass: check specific categories only
        for dc in detail_cats:
            cat_name = dc if isinstance(dc, str) else dc.get('name', '')
            if cat_name in SPECIFIC_CATEGORY_MAP:
                return SPECIFIC_CATEGORY_MAP[cat_name]

    # Name-based classification (before general fallback)
    sku = product.get('sku', '')
    name = sku.replace('-', ' ').lower()
    for pattern, cat in NAME_RULES:
        if re.search(pattern, name):
            return cat

    # General/parent category fallback
    if isinstance(detail_cats, list):
        for dc in detail_cats:
            cat_name = dc if isinstance(dc, str) else dc.get('name', '')
            if cat_name in GENERAL_CATEGORY_MAP:
                return GENERAL_CATEGORY_MAP[cat_name]

    top_cat = product.get('topCategory', '')
    return TOP_CATEGORY_FALLBACK.get(top_cat, 'Vinegar & Cooking Essentials')


def generate_tags(product, name):
    """Generate tags from product data."""
    tags = list(product.get('tags', []) or [])
    # Add first two significant words from name
    words = [w for w in name.split() if len(w) > 3 and w.lower() not in ('with', 'from', 'pack', 'size')]
    for w in words[:2]:
        if w not in tags:
            tags.append(w)
    tags.append('Halal')
    tags.append('Buy online')
    seen = set()
    unique = []
    for t in tags:
        if t.lower() not in seen:
            seen.add(t.lower())
            unique.append(t)
    return unique[:6]


# Process products
output = []
skipped_fish = 0
skipped_other = 0

for product in all_products:
    sku = product.get('sku', '')

    # Skip already-imported fish products
    if sku in fish_skus:
        skipped_fish += 1
        continue

    # Skip multi-buy bundles with 0 price
    regular_price = parse_regular_price(product)
    sale_price = parse_sale_price(product)
    if regular_price <= 0 and not sale_price:
        skipped_other += 1
        continue

    if sale_price and regular_price and sale_price >= regular_price:
        sale_price = None

    name = sku_to_name(sku)
    category_name = get_category_name(product)
    image_url = get_best_image(product)

    slug = 'ef-' + re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')

    item = {
        'name': name,
        'slug': slug,
        'description': product.get('shortDescription', '') or product.get('longDescription', '') or name,
        'categoryName': category_name,
        'price': regular_price if regular_price > 0 else (sale_price or 0.01),
        'salePrice': sale_price,
        'unit': product.get('weight', 'each') or 'each',
        'tags': generate_tags(product, name),
        'localImage': None,
        'remoteImage': image_url or '',
        'is_featured': product.get('onSale', False),
        'sku_source': sku,
        'brand': product.get('brand', '') or '',
        'outOfStock': product.get('outOfStock', False),
    }
    output.append(item)

# Save
output_path = str(PROJECT_ROOT / 'database' / 'data' / 'efoods_all_products.json')
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(output, f, indent=2, ensure_ascii=False)

print('Exported {} new products'.format(len(output)))
print('Skipped {} fish (already imported), {} other (no price)'.format(skipped_fish, skipped_other))
print('Saved to: {}'.format(output_path))

# Category distribution
cats = {}
with_images = 0
for p in output:
    cats[p['categoryName']] = cats.get(p['categoryName'], 0) + 1
    if p['remoteImage']:
        with_images += 1

print('\nWith images: {}/{}'.format(with_images, len(output)))
print('\nBy subcategory:')
for c, n in sorted(cats.items(), key=lambda x: -x[1]):
    print('  {}: {}'.format(c, n))
