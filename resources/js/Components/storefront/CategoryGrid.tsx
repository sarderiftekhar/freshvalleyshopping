import { Link } from '@inertiajs/react';
import { Category } from '@/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import { categoryEmojis } from '@/lib/categoryEmojis';

interface Props {
    categories: Category[];
}

export default function CategoryGrid({ categories }: Props) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (dir: 'left' | 'right') => {
        if (!scrollRef.current) return;
        const amount = 200;
        scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
    };

    return (
        <section className="bg-orfarm-grey pb-10">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8">
                    <span className="text-sm font-medium text-orfarm-green italic font-heading tracking-widest">
                        ~ Browse Categories ~
                    </span>
                    <h2 className="text-2xl lg:text-[36px] font-heading font-bold text-orfarm-blue mt-2">Pick From Our Categories</h2>
                </div>
                <div className="relative">
                    {/* Scroll buttons */}
                    <button
                        onClick={() => scroll('left')}
                        className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-orfarm-green hover:text-white transition-colors hidden lg:flex"
                    >
                        <ChevronLeft className="size-5" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-orfarm-green hover:text-white transition-colors hidden lg:flex"
                    >
                        <ChevronRight className="size-5" />
                    </button>

                    {/* Categories Scroll */}
                    <div
                        ref={scrollRef}
                        className="flex gap-5 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/shop?category=${category.slug}`}
                                className="group flex-shrink-0 w-[140px] bg-white rounded-xl p-5 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                            >
                                <div className="w-[72px] h-[72px] mx-auto mb-3 rounded-full overflow-hidden bg-orfarm-grey group-hover:bg-orfarm-green/10 transition-colors flex items-center justify-center">
                                    {category.image ? (
                                        <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-3xl">{categoryEmojis[category.name] || '📦'}</span>
                                    )}
                                </div>
                                <h3 className="text-sm font-medium text-orfarm-blue group-hover:text-orfarm-green transition-colors leading-tight">
                                    {category.name}
                                </h3>
                                {category.products_count !== undefined && (
                                    <span className="text-xs text-orfarm-body/80 mt-1 block">
                                        {category.products_count} items
                                    </span>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
