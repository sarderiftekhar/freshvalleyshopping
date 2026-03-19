import { Link } from '@inertiajs/react';
import { Category } from '@/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import { getCategoryIcon } from '@/lib/categoryEmojis';

interface Props {
    categories: Category[];
}

export default function CategoryGrid({ categories }: Props) {
    const scrollRef = useRef<HTMLDivElement>(null);

    if (categories.length === 0) return null;

    const scroll = (dir: 'left' | 'right') => {
        if (!scrollRef.current) return;
        scrollRef.current.scrollBy({
            left: dir === 'left' ? -340 : 340,
            behavior: 'smooth',
        });
    };

    return (
        <section className="bg-orfarm-grey py-10">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8">
                    <span className="text-sm font-medium text-orfarm-green italic font-heading tracking-widest">
                        ~ Browse Categories ~
                    </span>
                    <h2 className="text-2xl lg:text-[36px] font-heading font-bold text-orfarm-blue mt-2">
                        Shop by Category
                    </h2>
                </div>

                <div className="relative group/cats">
                    <button
                        onClick={() => scroll('left')}
                        className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white shadow-lg items-center justify-center hover:bg-orfarm-green hover:text-white transition-all duration-200 opacity-0 group-hover/cats:opacity-100 hidden lg:flex"
                    >
                        <ChevronLeft className="size-5" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white shadow-lg items-center justify-center hover:bg-orfarm-green hover:text-white transition-all duration-200 opacity-0 group-hover/cats:opacity-100 hidden lg:flex"
                    >
                        <ChevronRight className="size-5" />
                    </button>

                    <div
                        ref={scrollRef}
                        className="flex gap-4 overflow-x-auto pb-4 -mx-1 px-1 scrollbar-hide"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {categories.map((category) => {
                            const { icon: Icon, color, bg } = getCategoryIcon(category.name);
                            return (
                                <Link
                                    key={category.id}
                                    href={`/shop?category=${category.slug}`}
                                    className="group/card flex-shrink-0 w-[155px] bg-white rounded-2xl p-5 flex flex-col items-center text-center border border-gray-100 hover:border-orfarm-green/30 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
                                >
                                    <div className={`w-[76px] h-[76px] rounded-full ${bg} flex items-center justify-center transition-all duration-300 group-hover/card:bg-orfarm-green group-hover/card:shadow-lg`}>
                                        <span className="inline-block transition-transform duration-300 group-hover/card:scale-110">
                                            <Icon className={`size-9 ${color} transition-colors duration-300 group-hover/card:text-white`} strokeWidth={1.5} />
                                        </span>
                                    </div>
                                    <h3 className="text-sm font-semibold text-orfarm-blue mt-3 leading-tight line-clamp-2 min-h-[2.5rem] flex items-center">
                                        {category.name}
                                    </h3>
                                    {category.products_count !== undefined && (
                                        <span className="text-xs text-orfarm-body/60 mt-1">
                                            {category.products_count} items
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
