export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    image: string | null;
    parent_id: number | null;
    sort_order: number;
    is_active: boolean;
    products_count?: number;
    children?: Category[];
}

export interface ProductImage {
    id: number;
    product_id: number;
    path: string;
    is_primary: boolean;
    sort_order: number;
}

export interface Product {
    id: number;
    sku: string;
    title: string;
    slug: string;
    price: string;
    sale_price: string | null;
    category_id: number;
    brand: string | null;
    quantity: number;
    unit: string;
    description: string;
    tags: string[];
    is_halal_certified: boolean;
    halal_certification_body: string | null;
    status: 'draft' | 'published' | 'out_of_stock';
    sold: number;
    sort_order: number;
    is_featured: boolean;
    category?: Category;
    images?: ProductImage[];
    primary_image?: ProductImage;
    discount_percent?: number;
    effective_price?: string;
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
