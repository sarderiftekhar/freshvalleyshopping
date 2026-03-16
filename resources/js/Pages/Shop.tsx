import { Head, Link, router } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import ProductCard from '@/Components/storefront/ProductCard';
import { Category, Product } from '@/types';
import { Button, buttonVariants } from '@/Components/ui/button';
import { cn } from '@/lib/utils';

interface PaginatedProducts {
    data: Product[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    categories: Category[];
    products: PaginatedProducts;
    filters: {
        category?: string;
        search?: string;
        sort?: string;
    };
}

export default function Shop({ categories, products, filters }: Props) {
    const activeCategory = categories.find(c => c.slug === filters.category);

    const handleSort = (sort: string) => {
        router.get('/shop', { ...filters, sort }, { preserveState: true, preserveScroll: true });
    };

    return (
        <StorefrontLayout>
            <Head title={activeCategory ? `${activeCategory.name} - Shop` : 'Shop All Products'} />

            {/* Breadcrumb */}
            <div className="bg-muted/30 border-b border-border/50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-gray-700">
                        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                        <ChevronRight className="size-3.5" />
                        <span className="text-foreground font-medium">
                            {activeCategory ? activeCategory.name : 'Shop'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="lg:flex lg:gap-8">
                    {/* Sidebar */}
                    <aside className="lg:w-60 shrink-0 mb-6 lg:mb-0">
                        <h3 className="font-semibold text-foreground mb-3">Categories</h3>
                        <nav className="space-y-0.5">
                            <Link
                                href="/shop"
                                className={`block py-2 px-3 rounded-lg text-sm transition-colors ${
                                    !filters.category ? 'bg-primary text-primary-foreground font-medium' : 'text-foreground hover:bg-muted'
                                }`}
                            >
                                All Products
                            </Link>
                            {categories.map(cat => {
                                const isParentActive = filters.category === cat.slug;
                                const isChildActive = cat.children?.some(child => filters.category === child.slug);
                                const showChildren = isParentActive || isChildActive;

                                return (
                                    <div key={cat.id}>
                                        <Link
                                            href={`/shop?category=${cat.slug}`}
                                            className={`block py-2 px-3 rounded-lg text-sm transition-colors ${
                                                isParentActive
                                                    ? 'bg-primary text-primary-foreground font-medium'
                                                    : 'text-foreground hover:bg-muted'
                                            }`}
                                        >
                                            {cat.name}
                                            {cat.products_count !== undefined && (
                                                <span className="text-xs ml-1 opacity-90">({cat.products_count})</span>
                                            )}
                                        </Link>
                                        {cat.children && cat.children.length > 0 && showChildren && (
                                            <div className="ml-3 mt-0.5 space-y-0.5 border-l-2 border-border pl-2">
                                                {cat.children.map(child => (
                                                    <Link
                                                        key={child.id}
                                                        href={`/shop?category=${child.slug}`}
                                                        className={`block py-1.5 px-3 rounded-lg text-sm transition-colors ${
                                                            filters.category === child.slug
                                                                ? 'bg-primary text-primary-foreground font-medium'
                                                                : 'text-gray-700 hover:bg-muted hover:text-foreground'
                                                        }`}
                                                    >
                                                        {child.name}
                                                        {child.products_count !== undefined && (
                                                            <span className="text-xs ml-1 opacity-90">({child.products_count})</span>
                                                        )}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </nav>
                    </aside>

                    {/* Products */}
                    <div className="flex-1">
                        {/* Toolbar */}
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-sm text-gray-700">
                                Showing {products.data.length} of {products.total} products
                            </p>
                            <select
                                value={filters.sort || ''}
                                onChange={(e) => handleSort(e.target.value)}
                                className="h-9 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                            >
                                <option value="">Default</option>
                                <option value="newest">Newest</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                                <option value="name">Name</option>
                            </select>
                        </div>

                        {/* Grid */}
                        {products.data.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                                {products.data.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <p className="text-lg text-gray-700">No products found</p>
                                <Link href="/shop" className={cn(buttonVariants({ variant: 'outline' }), 'mt-4')}>
                                    View all products
                                </Link>
                            </div>
                        )}

                        {/* Pagination */}
                        {products.last_page > 1 && (
                            <div className="flex justify-center gap-1 mt-8">
                                {products.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                                            link.active
                                                ? 'bg-primary text-primary-foreground'
                                                : link.url
                                                ? 'hover:bg-muted text-foreground'
                                                : 'text-gray-700 pointer-events-none'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </StorefrontLayout>
    );
}
