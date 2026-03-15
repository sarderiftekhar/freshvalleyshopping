import { Link } from '@inertiajs/react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/types';
import ProductCard from './ProductCard';
import { useRef } from 'react';

interface Props {
    title: string;
    subtitle?: string;
    products: Product[];
    viewAllHref?: string;
}

export default function ProductSection({ title, subtitle, products, viewAllHref }: Props) {
    const scrollRef = useRef<HTMLDivElement>(null);

    if (products.length === 0) return null;

    const scroll = (dir: 'left' | 'right') => {
        if (!scrollRef.current) return;
        const amount = 300;
        scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
    };

    return (
        <section className="bg-orfarm-grey pb-10">
            <div className="container mx-auto px-4">
                {/* Section Header - Orfarm style */}
                <div className="text-center mb-10">
                    {subtitle && (
                        <span className="text-sm font-medium text-orfarm-green uppercase tracking-widest">
                            ~ {subtitle} ~
                        </span>
                    )}
                    <h2 className="text-2xl lg:text-[36px] font-heading font-bold text-orfarm-blue mt-2">{title}</h2>
                    <p className="text-sm text-orfarm-body/70 mt-2 max-w-md mx-auto">
                        The best halal groceries and fresh produce, delivered right to your door.
                    </p>
                </div>

                {/* Product Slider */}
                <div className="relative group/products">
                    {/* Scroll Arrows */}
                    <button
                        onClick={() => scroll('left')}
                        className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-orfarm-green hover:text-white transition-colors opacity-0 group-hover/products:opacity-100 hidden lg:flex"
                    >
                        <ChevronLeft className="size-5" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-orfarm-green hover:text-white transition-colors opacity-0 group-hover/products:opacity-100 hidden lg:flex"
                    >
                        <ChevronRight className="size-5" />
                    </button>

                    <div
                        ref={scrollRef}
                        className="flex gap-5 overflow-x-auto pb-4 -mx-1 px-1"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {products.map((product) => (
                            <div key={product.id} className="flex-shrink-0 w-[220px] sm:w-[240px]">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* View All Link */}
                {viewAllHref && (
                    <div className="text-center mt-6">
                        <Link
                            href={viewAllHref}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-orfarm-blue hover:text-orfarm-green transition-colors border-b-2 border-orfarm-blue hover:border-orfarm-green pb-1"
                        >
                            Shop All Products
                            <ArrowRight className="size-4" />
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
