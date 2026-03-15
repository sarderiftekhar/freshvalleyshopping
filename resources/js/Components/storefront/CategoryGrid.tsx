import { Link } from '@inertiajs/react';
import { Category } from '@/types';

interface Props {
    categories: Category[];
}

const categoryIcons: Record<string, string> = {
    'Fresh Meat': '🥩',
    'Fresh Fish': '🐟',
    'Vegetables': '🥬',
    'Fresh Fruits': '🍎',
    'Rice & Grains': '🍚',
    'Spices & Herbs': '🌶️',
    'Dairy & Eggs': '🥚',
    'Frozen Foods': '❄️',
    'Snacks & Drinks': '🥤',
    'Bakery': '🍞',
};

export default function CategoryGrid({ categories }: Props) {
    return (
        <section className="py-10 lg:py-14 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8">
                    <span className="text-sm font-medium text-primary">Categories</span>
                    <h2 className="text-2xl lg:text-3xl font-bold text-foreground mt-1">Shop by Category</h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/shop?category=${category.slug}`}
                            className="group bg-white rounded-xl p-5 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-200 border border-border/50"
                        >
                            <div className="w-[72px] h-[72px] mx-auto mb-3 rounded-full overflow-hidden group-hover:ring-2 group-hover:ring-primary/30 transition-all">
                                {category.image ? (
                                    <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-primary/5 flex items-center justify-center text-3xl">
                                        {categoryIcons[category.name] || '📦'}
                                    </div>
                                )}
                            </div>
                            <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                                {category.name}
                            </h3>
                            {category.products_count !== undefined && (
                                <span className="text-xs text-muted-foreground mt-1 block">
                                    {category.products_count} items
                                </span>
                            )}
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
