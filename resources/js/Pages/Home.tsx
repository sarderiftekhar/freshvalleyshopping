import { Head } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import HeroBanner from '@/Components/storefront/HeroBanner';
import CategoryGrid from '@/Components/storefront/CategoryGrid';
import ProductSection from '@/Components/storefront/ProductSection';
import FeatureBanner from '@/Components/storefront/FeatureBanner';
import { Category, Product } from '@/types';

interface Props {
    categories: Category[];
    featuredProducts: Product[];
    latestProducts: Product[];
}

export default function Home({ categories, featuredProducts, latestProducts }: Props) {
    return (
        <StorefrontLayout>
            <Head title="Fresh Halal Grocery Delivery - Dartford, Orpington & Sidcup" />

            <HeroBanner />

            <CategoryGrid categories={categories} />

            <ProductSection
                title="Featured Products"
                subtitle="Best Sellers"
                products={featuredProducts}
                viewAllHref="/shop"
            />

            <FeatureBanner />

            <ProductSection
                title="Latest Products"
                subtitle="New Arrivals"
                products={latestProducts}
                viewAllHref="/shop?sort=newest"
            />

            {/* CTA Banner */}
            <section className="py-12 lg:py-16 bg-primary">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl lg:text-3xl font-bold text-primary-foreground mb-3">
                        Order Fresh Halal Groceries Today
                    </h2>
                    <p className="text-primary-foreground/80 max-w-md mx-auto mb-6">
                        Free delivery on orders over £40. Serving Dartford, Orpington, Sidcup and surrounding areas.
                    </p>
                    <a
                        href="/shop"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-white/90 transition-colors"
                    >
                        Start Shopping
                    </a>
                </div>
            </section>
        </StorefrontLayout>
    );
}
