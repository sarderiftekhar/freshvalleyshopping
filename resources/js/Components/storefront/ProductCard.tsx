import { Link } from '@inertiajs/react';
import { ShoppingCart, Eye, Heart, Star } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { getCategoryIcon } from '@/lib/categoryEmojis';

interface Props {
    product: Product;
}

export default function ProductCard({ product }: Props) {
    const { addToCart } = useCart();
    const price = parseFloat(product.price);
    const salePrice = product.sale_price ? parseFloat(product.sale_price) : null;
    const discount = product.discount_percent;

    return (
        <div className="group bg-white rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-transparent hover:border-orfarm-green/20">
            {/* Image */}
            <Link href={`/product/${product.slug}`} className="block relative aspect-square bg-white overflow-hidden p-5">
                {product.primary_image ? (
                    <img
                        src={product.primary_image.path}
                        alt={product.title}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    (() => {
                        const { icon: FallbackIcon, color, bg } = getCategoryIcon(product.category?.name || '');
                        return (
                            <div className={`w-full h-full flex items-center justify-center ${bg}`}>
                                <FallbackIcon className={`size-16 ${color}`} strokeWidth={1.5} />
                            </div>
                        );
                    })()
                )}

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {discount && discount > 0 && (
                        <span className="px-2.5 py-1 bg-orfarm-red text-white text-[11px] font-bold rounded-md">
                            -{discount}%
                        </span>
                    )}
                    {product.is_halal_certified && (
                        <span className="px-2.5 py-1 bg-orfarm-green text-white text-[11px] font-bold rounded-md">
                            HALAL
                        </span>
                    )}
                </div>

                {/* Quick action icons - appear on hover */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    <button className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-orfarm-green hover:text-white transition-colors text-orfarm-blue">
                        <Heart className="size-4" />
                    </button>
                    <Link
                        href={`/product/${product.slug}`}
                        className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-orfarm-green hover:text-white transition-colors text-orfarm-blue"
                    >
                        <Eye className="size-4" />
                    </Link>
                </div>
            </Link>

            {/* Content */}
            <div className="bg-orfarm-grey p-4">
                {product.category && (
                    <Link
                        href={`/shop?category=${product.category.slug}`}
                        className="text-xs text-orfarm-body/80 hover:text-orfarm-green transition-colors"
                    >
                        {product.category.name}
                    </Link>
                )}

                <Link href={`/product/${product.slug}`}>
                    <h3 className="text-sm font-semibold text-orfarm-blue mt-1 line-clamp-2 hover:text-orfarm-green transition-colors leading-snug min-h-[2.5rem]">
                        {product.title}
                    </h3>
                </Link>

                {/* Rating */}
                <div className="flex items-center gap-0.5 mt-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="size-3 fill-orfarm-yellow text-orfarm-yellow" />
                    ))}
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                        {salePrice ? (
                            <>
                                <span className="text-base font-bold text-orfarm-blue">£{salePrice.toFixed(2)}</span>
                                <span className="text-xs text-orfarm-body/75 line-through">£{price.toFixed(2)}</span>
                            </>
                        ) : (
                            <span className="text-base font-bold text-orfarm-blue">£{price.toFixed(2)}</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Add to Cart - slides up on hover */}
            <div className="bg-orfarm-blue text-white text-center transition-all duration-300 max-h-0 group-hover:max-h-16 overflow-hidden">
                <button
                    onClick={() => addToCart(product)}
                    className="w-full py-3 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-orfarm-green transition-colors"
                >
                    <ShoppingCart className="size-4" />
                    Add to Cart
                </button>
            </div>
        </div>
    );
}
