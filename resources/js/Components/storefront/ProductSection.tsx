import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { Product } from '@/types';
import ProductCard from './ProductCard';
import { buttonVariants } from '@/Components/ui/button';
import { cn } from '@/lib/utils';

interface Props {
    title: string;
    subtitle?: string;
    products: Product[];
    viewAllHref?: string;
}

export default function ProductSection({ title, subtitle, products, viewAllHref }: Props) {
    if (products.length === 0) return null;

    return (
        <section className="py-10 lg:py-14">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex items-end justify-between mb-8">
                    <div>
                        {subtitle && <span className="text-sm font-medium text-primary">{subtitle}</span>}
                        <h2 className="text-2xl lg:text-3xl font-bold text-foreground mt-1">{title}</h2>
                    </div>
                    {viewAllHref && (
                        <Link href={viewAllHref} className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}>
                            View All
                            <ArrowRight className="size-4 ml-1" />
                        </Link>
                    )}
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
}
