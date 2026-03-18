import { Head, Link, router } from '@inertiajs/react';
import { ChevronRight, ChevronDown } from 'lucide-react';
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
                    <aside className="lg:w-64 shrink-0 mb-6 lg:mb-0">
                        <h3 className="font-heading font-bold text-foreground mb-4 text-base tracking-tight">Categories</h3>
                        <nav className="space-y-0.5">
                            <Link
                                href="/shop"
                                className={`group flex items-center justify-between py-2.5 px-3 rounded-lg text-[15px] transition-all duration-200 ${
                                    !filters.category
                                        ? 'bg-primary text-primary-foreground font-medium shadow-sm'
                                        : 'text-foreground hover:bg-primary/5 hover:text-primary hover:translate-x-1'
                                }`}
                            >
                                <span>All Products</span>
                            </Link>
                            {categories.map(cat => {
                                const hasChildren = cat.children && cat.children.length > 0;
                                const isParentActive = filters.category === cat.slug;
                                const isChildActive = cat.children?.some(child => filters.category === child.slug);
                                const showChildren = isParentActive || isChildActive;

                                return (
                                    <div key={cat.id}>
                                        <Link
                                            href={`/shop?category=${cat.slug}`}
                                            className={`group flex items-center justify-between py-2.5 px-3 rounded-lg text-[15px] transition-all duration-200 ${
                                                isParentActive
                                                    ? 'bg-primary text-primary-foreground font-medium shadow-sm'
                                                    : 'text-foreground hover:bg-primary/5 hover:text-primary hover:translate-x-1'
                                            }`}
                                        >
                                            <span className="flex items-center gap-2">
                                                <span className={`inline-block w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                                                    isParentActive
                                                        ? 'bg-primary-foreground scale-100'
                                                        : 'bg-primary/40 scale-0 group-hover:scale-100'
                                                }`} />
                                                {cat.name}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                {cat.products_count !== undefined && (
                                                    <span className={`text-xs tabular-nums px-1.5 py-0.5 rounded-full transition-all duration-200 ${
                                                        isParentActive
                                                            ? 'bg-primary-foreground/20 text-primary-foreground'
                                                            : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                                                    }`}>
                                                        {cat.products_count}
                                                    </span>
                                                )}
                                                {hasChildren && (
                                                    <ChevronDown className={`size-3.5 transition-transform duration-200 ${
                                                        showChildren ? 'rotate-0' : '-rotate-90'
                                                    } ${isParentActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-primary'}`} />
                                                )}
                                            </span>
                                        </Link>
                                        {hasChildren && showChildren && (
                                            <div className="mt-1 mb-2 ml-3 rounded-lg bg-muted/50 py-1.5 px-1">
                                                {cat.children!.map(child => (
                                                    <Link
                                                        key={child.id}
                                                        href={`/shop?category=${child.slug}`}
                                                        className={`group/child flex items-center justify-between py-2 px-3 rounded-md text-sm transition-all duration-200 ${
                                                            filters.category === child.slug
                                                                ? 'bg-white text-primary font-medium shadow-sm'
                                                                : 'text-muted-foreground hover:bg-white hover:text-foreground hover:shadow-sm hover:translate-x-0.5'
                                                        }`}
                                                    >
                                                        <span>{child.name}</span>
                                                        {child.products_count !== undefined && (
                                                            <span className={`text-xs tabular-nums transition-all duration-200 ${
                                                                filters.category === child.slug
                                                                    ? 'text-primary'
                                                                    : 'text-muted-foreground/60 group-hover/child:text-foreground'
                                                            }`}>
                                                                {child.products_count}
                                                            </span>
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
