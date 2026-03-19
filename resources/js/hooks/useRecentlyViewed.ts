import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/types';

const STORAGE_KEY = 'recently_viewed_products';
const MAX_ITEMS = 12;

export function addRecentlyViewed(product: Product) {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        let items: Product[] = stored ? JSON.parse(stored) : [];

        // Remove if already exists (we'll re-add at front)
        items = items.filter((p) => p.id !== product.id);

        // Ensure primary_image is set (derive from images array if missing)
        const toStore = { ...product };
        if (!toStore.primary_image && toStore.images?.length) {
            toStore.primary_image =
                toStore.images.find((img) => img.is_primary) ?? toStore.images[0];
        }

        // Add to front
        items.unshift(toStore);

        // Limit size
        if (items.length > MAX_ITEMS) {
            items = items.slice(0, MAX_ITEMS);
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
        // Ignore storage errors
    }
}

export function useRecentlyViewed(): Product[] {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setProducts(JSON.parse(stored));
            }
        } catch {
            // Ignore parse errors
        }
    }, []);

    return products;
}
