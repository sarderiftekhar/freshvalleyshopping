import { Link } from '@inertiajs/react';
import { ShoppingCart, Eye } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { Button } from '@/Components/ui/button';

interface Props {
    product: Product;
}

export default function ProductCard({ product }: Props) {
    const { addToCart } = useCart();
    const price = parseFloat(product.price);
    const salePrice = product.sale_price ? parseFloat(product.sale_price) : null;
    const discount = product.discount_percent;

    return (
        <div className="group bg-white rounded-xl border border-border/50 overflow-hidden hover:shadow-lg transition-all duration-200">
            {/* Image */}
            <Link href={`/product/${product.slug}`} className="block relative aspect-square bg-muted/30 overflow-hidden">
                {product.primary_image ? (
                    <img
                        src={product.primary_image.path}
                        alt={product.title}
                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">
                        {product.category?.name === 'Fresh Meat' ? '🥩' :
                         product.category?.name === 'Fresh Fish' ? '🐟' :
                         product.category?.name === 'Vegetables' ? '🥬' :
                         product.category?.name === 'Rice & Grains' ? '🍚' :
                         product.category?.name === 'Spices & Herbs' ? '🌶️' :
                         product.category?.name === 'Dairy & Eggs' ? '🥚' :
                         product.category?.name === 'Frozen Foods' ? '❄️' :
                         product.category?.name === 'Snacks & Drinks' ? '🥤' : '📦'}
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {discount && (
                        <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded">
                            -{discount}%
                        </span>
                    )}
                    {product.is_halal_certified && (
                        <span className="px-2 py-0.5 bg-primary text-primary-foreground text-[10px] font-bold rounded">
                            HALAL
                        </span>
                    )}
                </div>

                {/* Quick actions on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Link
                        href={`/product/${product.slug}`}
                        className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-primary hover:text-white transition-colors"
                    >
                        <Eye className="size-4" />
                    </Link>
                </div>
            </Link>

            {/* Content */}
            <div className="p-4">
                {product.category && (
                    <Link
                        href={`/shop?category=${product.category.slug}`}
                        className="text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                        {product.category.name}
                    </Link>
                )}

                <Link href={`/product/${product.slug}`}>
                    <h3 className="text-sm font-semibold text-foreground mt-1 line-clamp-2 hover:text-primary transition-colors leading-snug">
                        {product.title}
                    </h3>
                </Link>

                <p className="text-xs text-muted-foreground mt-1">{product.unit}</p>

                <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                        {salePrice ? (
                            <>
                                <span className="text-base font-bold text-primary">£{salePrice.toFixed(2)}</span>
                                <span className="text-xs text-muted-foreground line-through">£{price.toFixed(2)}</span>
                            </>
                        ) : (
                            <span className="text-base font-bold text-foreground">£{price.toFixed(2)}</span>
                        )}
                    </div>

                    <Button
                        size="icon-sm"
                        onClick={() => addToCart(product)}
                        title="Add to cart"
                    >
                        <ShoppingCart className="size-3.5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
