"""
Download images for all 474 eFoods products into category-organized folders.
"""
import json
import os
import re
import pathlib
import urllib.request
import time

PROJECT_ROOT = pathlib.Path(__file__).resolve().parent.parent.parent
PRODUCTS_JSON = PROJECT_ROOT / 'database' / 'data' / 'efoods_all_products.json'
IMG_BASE = PROJECT_ROOT / 'public' / 'assets' / 'img' / 'products' / 'efoods'

with open(PRODUCTS_JSON, 'r', encoding='utf-8') as f:
    products = json.load(f)

# Group by category slug for folder organization
downloaded = 0
skipped = 0
failed = 0
updated = []

for i, product in enumerate(products):
    url = product.get('remoteImage', '')
    if not url:
        skipped += 1
        updated.append(product)
        continue

    # Create folder based on category
    cat_slug = re.sub(r'[^a-z0-9]+', '-', product['categoryName'].lower()).strip('-')
    folder = IMG_BASE / cat_slug
    folder.mkdir(parents=True, exist_ok=True)

    # Filename from slug
    slug = product['slug']
    ext = '.jpg'
    if '.png' in url.lower():
        ext = '.png'
    elif '.webp' in url.lower():
        ext = '.webp'
    filename = slug + ext
    filepath = folder / filename

    if filepath.exists():
        # Already downloaded
        rel_path = f'/assets/img/products/efoods/{cat_slug}/{filename}'
        product['localImage'] = rel_path
        updated.append(product)
        downloaded += 1
        continue

    try:
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read()
            if len(data) < 500:
                # Too small, probably placeholder
                skipped += 1
                updated.append(product)
                continue
            with open(filepath, 'wb') as out:
                out.write(data)

        rel_path = f'/assets/img/products/efoods/{cat_slug}/{filename}'
        product['localImage'] = rel_path
        downloaded += 1

        if downloaded % 25 == 0:
            print(f'  Downloaded {downloaded}...')

    except Exception as e:
        failed += 1
        # Keep remote URL as fallback

    updated.append(product)

    # Small delay to be respectful
    if downloaded % 10 == 0:
        time.sleep(0.2)

# Save updated JSON with local image paths
with open(PRODUCTS_JSON, 'w', encoding='utf-8') as f:
    json.dump(updated, f, indent=2, ensure_ascii=False)

print(f'\nDone! Downloaded: {downloaded}, Skipped (no URL): {skipped}, Failed: {failed}')
print(f'Total products: {len(updated)}')

# Show folder sizes
if IMG_BASE.exists():
    for folder in sorted(IMG_BASE.iterdir()):
        if folder.is_dir():
            count = len(list(folder.glob('*')))
            print(f'  {folder.name}: {count} images')
