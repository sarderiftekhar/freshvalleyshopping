export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    role?: 'customer' | 'supplier' | 'editor' | 'admin' | 'super_admin';
    phone?: string;
    avatar?: string;
    is_active?: boolean;
    last_login_at?: string;
}

export interface SupplierCategory {
    id: number;
    name: string;
    slug: string;
    emoji: string | null;
    sort_order: number;
    is_active: boolean;
    products_count?: number;
    active_products_count?: number;
}

export interface SupplierProduct {
    id: number;
    supplier_category_id: number;
    name: string;
    unit: string;
    pack_size: string | null;
    base_price: string;
    bulk_price: string | null;
    bulk_qty: number | null;
    bulk_unit: string | null;
    notes: string | null;
    is_active: boolean;
    sort_order: number;
    category?: SupplierCategory;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: { url: string | null; label: string; active: boolean }[];
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
    parent?: Category;
}

export interface Brand {
    id: number;
    name: string;
    slug: string;
    image: string | null;
    is_active: boolean;
    sort_order: number;
    products_count?: number;
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
    brand_id: number | null;
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
    brand?: Brand;
    images?: ProductImage[];
    primary_image?: ProductImage;
    discount_percent?: number;
    effective_price?: string;
}

export interface CartItem {
    product: Product;
    quantity: number;
    cuttingOption?: string;
}

export interface Order {
    id: number;
    order_number: string;
    user_id: number | null;
    delivery_slot_id: number | null;
    email: string;
    phone: string | null;
    delivery_address: string;
    postcode: string;
    city: string;
    subtotal: string;
    delivery_fee: string;
    total: string;
    status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
    payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
    stripe_payment_intent_id: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
    user?: User;
    items?: OrderItem[];
    delivery_slot?: DeliverySlot;
}

export interface OrderItem {
    id: number;
    order_id: number;
    product_id: number;
    product_title: string;
    price: string;
    quantity: number;
    total: string;
    product?: Product;
}

export interface DeliverySlot {
    id: number;
    delivery_date: string;
    label: string;
    max_orders: number;
    current_orders: number;
    is_active: boolean;
}

export interface Address {
    id: number;
    user_id: number;
    first_name: string;
    last_name: string;
    address_line_1: string;
    address_line_2: string | null;
    city: string;
    postcode: string;
    phone: string | null;
    is_default: boolean;
}

export interface ActivityLog {
    id: number;
    user_id: number | null;
    action: string;
    subject_type: string | null;
    subject_id: number | null;
    properties: Record<string, any> | null;
    ip_address: string | null;
    created_at: string;
    user?: User;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
        isAdmin?: boolean;
    };
};
