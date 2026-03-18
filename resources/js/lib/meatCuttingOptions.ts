import { Product } from '@/types';

const MEAT_CUTS = ['Small Pieces', 'Medium Pieces', 'Large Pieces'];

const CHICKEN_CUTS = [
    ...MEAT_CUTS,
    '4 Piece Cut',
    '8 Piece Cut',
    'Curry Pieces',
    'Whole',
];

const CUTTING_OPTIONS: Record<string, string[]> = {
    'fresh-meat': MEAT_CUTS,
    'fresh-meat-chicken': CHICKEN_CUTS,
};

export function getCuttingOptions(product: Product): string[] {
    const parentSlug = product.category?.parent?.slug;
    const categorySlug = product.category?.slug;

    // Check parent category first (product is in a subcategory)
    if (parentSlug && CUTTING_OPTIONS[parentSlug]) {
        return CUTTING_OPTIONS[parentSlug];
    }

    // Fallback: check if the product's own category is a meat parent
    if (categorySlug && CUTTING_OPTIONS[categorySlug]) {
        return CUTTING_OPTIONS[categorySlug];
    }

    return [];
}
