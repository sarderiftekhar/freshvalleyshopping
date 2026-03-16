import json, re, os

with open('efoods_direct_fish_market.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Map eFoods categories to our subcategory names
CATEGORY_MAP = {
    'dried-fish': 'Dried Fish',
    'frozen-whole-fish': 'Frozen Whole Fish',
    'frozen-large-fish-block': 'Frozen Large Fish Block',
    'frozen-small-fish-block': 'Frozen Small Fish Block',
    'frozen-seafood': 'Frozen Seafood',
    'frozen-king-prawns-shrimps': 'King Prawns & Shrimps',
}

# Map eFoods categories to image folder names
IMAGE_DIR_MAP = {
    'dried-fish': 'dried-fish',
    'frozen-whole-fish': 'frozen-whole-fish',
    'frozen-large-fish-block': 'frozen-large-fish-block',
    'frozen-small-fish-block': 'frozen-small-fish-block',
    'frozen-seafood': 'frozen-seafood',
    'frozen-king-prawns-shrimps': 'king-prawns-shrimps',
}

# Build image filename lookup from the actual files we have
# Images were downloaded with product-name-based filenames (underscored)
image_files = {}
image_by_stem = {}
for subdir in os.listdir('images'):
    subdir_path = os.path.join('images', subdir)
    if os.path.isdir(subdir_path):
        for fname in os.listdir(subdir_path):
            image_files[fname.lower()] = (subdir, fname)
            stem = os.path.splitext(fname)[0].lower()
            image_by_stem[stem] = (subdir, fname)


def parse_sale_price(product):
    if product.get('onSale') and product.get('salePrice'):
        match = re.search(r'[\d.]+', str(product['salePrice']))
        if match:
            return float(match.group())
    return None


def parse_regular_price(product):
    if product.get('regularPrice'):
        match = re.search(r'[\d.]+', str(product['regularPrice']))
        if match:
            return float(match.group())
    if product.get('priceText'):
        match = re.search(r'[\d.]+', str(product['priceText']))
        if match:
            return float(match.group())
    return 0


def get_primary_category(product):
    cats = product.get('categories', [])
    for cat_slug in cats:
        if cat_slug in CATEGORY_MAP:
            return CATEGORY_MAP[cat_slug], IMAGE_DIR_MAP[cat_slug]
    for dc in product.get('detailCategories', []):
        url = dc.get('url', '')
        for slug, name in CATEGORY_MAP.items():
            if slug in url:
                return name, IMAGE_DIR_MAP[slug]
    return None, None


def find_local_image(product, image_dir):
    if not image_dir:
        return None

    # Images were downloaded with product-name-based filenames
    # e.g., "Ayer Whole Fish" -> "ayer_whole_fish.jpg"
    name = product.get('name', '')
    # Clean the name to match the download filename pattern
    name_stem = re.sub(r'[^a-z0-9]+', '_', name.lower()).strip('_')
    # Also try with common truncations (very long names get truncated)
    name_stem_short = name_stem[:60]

    dir_underscore = image_dir.replace('-', '_')

    # Strategy 1: Match by product name stem
    for stem, (subdir, actual_fname) in image_by_stem.items():
        if stem == name_stem or stem == name_stem_short:
            mapped_dir = IMAGE_DIR_MAP.get(subdir.replace('_', '-'), image_dir)
            return '/assets/img/products/fresh-fish/' + mapped_dir + '/' + actual_fname
        # Partial match - stem starts with name or vice versa
        if len(name_stem) > 10 and (stem.startswith(name_stem[:30]) or name_stem.startswith(stem[:30])):
            if subdir == dir_underscore:
                mapped_dir = IMAGE_DIR_MAP.get(subdir.replace('_', '-'), image_dir)
                return '/assets/img/products/fresh-fish/' + mapped_dir + '/' + actual_fname

    # Strategy 2: Match by original URL filename
    img_url = product.get('image', '')
    if img_url:
        fname = img_url.split('/')[-1]
        fname_clean = re.sub(r'-\d+x\d+', '', fname)

        if fname.lower() in image_files:
            subdir, actual_fname = image_files[fname.lower()]
            mapped_dir = IMAGE_DIR_MAP.get(subdir.replace('_', '-'), image_dir)
            return '/assets/img/products/fresh-fish/' + mapped_dir + '/' + actual_fname

        if fname_clean.lower() in image_files:
            subdir, actual_fname = image_files[fname_clean.lower()]
            mapped_dir = IMAGE_DIR_MAP.get(subdir.replace('_', '-'), image_dir)
            return '/assets/img/products/fresh-fish/' + mapped_dir + '/' + actual_fname

    # Strategy 3: Search in the correct subdirectory for any close match
    img_path = os.path.join('images', dir_underscore)
    if os.path.isdir(img_path):
        sku = product.get('sku', '').replace('-', '_').lower()
        for f in os.listdir(img_path):
            fstem = os.path.splitext(f)[0].lower()
            if sku and len(sku) > 8 and (sku in fstem or fstem in sku):
                return '/assets/img/products/fresh-fish/' + image_dir + '/' + f

    return None


def generate_description(product):
    parts = []
    if product.get('shortDescription'):
        parts.append(product['shortDescription'].strip())
    if product.get('longDescription'):
        parts.append(product['longDescription'].strip())
    if not parts:
        parts.append(product['name'])
    return ' '.join(parts)


def generate_tags(product):
    tags = list(product.get('tags', []))
    if product.get('brand'):
        tags.append(product['brand'])
    name_words = [
        'fish', 'prawn', 'shrimp', 'dried', 'frozen', 'whole', 'block', 'fillet',
        'king', 'tiger', 'hilsa', 'ilish', 'rohu', 'katla', 'pabda', 'boal',
        'koi', 'pangash', 'tilapia', 'pomfret', 'rupchanda', 'seafood',
        'chingri', 'shutki', 'loitta', 'mola', 'tengra', 'baila',
    ]
    name_lower = product['name'].lower()
    for w in name_words:
        if w in name_lower and w.capitalize() not in tags:
            tags.append(w.capitalize())
    first_word = product['name'].split()[0] if product['name'].split() else 'Fish'
    tags.append('Buy ' + first_word + ' online')
    tags.append('Halal fish')
    seen = set()
    unique_tags = []
    for t in tags:
        tl = t.lower()
        if tl not in seen:
            seen.add(tl)
            unique_tags.append(t)
    return unique_tags[:8]


# Process all products
output_products = []
skipped = 0
skipped_names = []

for product in data['products']:
    category_name, image_dir = get_primary_category(product)
    if not category_name:
        skipped += 1
        skipped_names.append(product['name'])
        continue

    regular_price = parse_regular_price(product)
    sale_price = parse_sale_price(product)

    if sale_price and regular_price and sale_price >= regular_price:
        sale_price = None
    if sale_price and not regular_price:
        regular_price = sale_price
        sale_price = None

    if regular_price <= 0:
        regular_price = 0.01

    slug = re.sub(r'[^a-z0-9]+', '-', product['name'].lower()).strip('-')
    cat_prefix = re.sub(r'[^a-z0-9]+', '-', category_name.lower()).strip('-')
    unique_slug = cat_prefix + '-' + slug

    local_image = find_local_image(product, image_dir)

    item = {
        'name': product['name'],
        'slug': unique_slug,
        'description': generate_description(product),
        'categoryName': category_name,
        'price': regular_price,
        'salePrice': sale_price,
        'unit': 'KG',
        'tags': generate_tags(product),
        'localImage': local_image,
        'remoteImage': product.get('image', ''),
        'is_featured': product.get('onSale', False),
        'sku_source': product.get('sku', ''),
        'brand': product.get('brand', ''),
        'outOfStock': product.get('outOfStock', False),
    }
    output_products.append(item)

# Save
import pathlib
output_path = str(pathlib.Path(__file__).resolve().parent.parent.parent / 'database' / 'data' / 'efoods_fish_products.json')
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(output_products, f, indent=2, ensure_ascii=False)

print('Exported {} products (skipped {} without matching category)'.format(
    len(output_products), skipped
))
print('Saved to: {}'.format(output_path))

if skipped_names:
    print('\nSkipped products (no matching fish subcategory):')
    for n in skipped_names:
        print('  - ' + n)

# Summary
cats = {}
with_images = 0
with_sale = 0
for p in output_products:
    cats[p['categoryName']] = cats.get(p['categoryName'], 0) + 1
    if p['localImage']:
        with_images += 1
    if p['salePrice']:
        with_sale += 1

print('\nWith local images: {}/{}'.format(with_images, len(output_products)))
print('With sale price: {}'.format(with_sale))
print('\nBy category:')
for c, n in sorted(cats.items(), key=lambda x: -x[1]):
    print('  {}: {}'.format(c, n))
