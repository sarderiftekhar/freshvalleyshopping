import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { ChevronRight, Minus, Plus, ShoppingCart, Shield } from 'lucide-react';
import { toast } from 'react-toastify';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import ProductCard from '@/Components/storefront/ProductCard';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types';
import { Button } from '@/Components/ui/button';
import { getCategoryIcon } from '@/lib/categoryEmojis';
import { getCuttingOptions } from '@/lib/meatCuttingOptions';
import { addRecentlyViewed } from '@/hooks/useRecentlyViewed';

interface Props {
    product: Product;
    relatedProducts: Product[];
}

export default function ProductDetail({ product, relatedProducts }: Props) {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [selectedCut, setSelectedCut] = useState<string | null>(null);

    useEffect(() => {
        addRecentlyViewed(product);
    }, [product.id]);

    const price = parseFloat(product.price);
    const salePrice = product.sale_price ? parseFloat(product.sale_price) : null;
    const activeImage = product.images?.[0]?.path;
    const cuttingOptions = getCuttingOptions(product);

    const handleAddToCart = () => {
        if (cuttingOptions.length > 0 && !selectedCut) {
            toast.warning('Please select a cut style first', {
                position: 'top-center',
                autoClose: 2500,
            });
            return;
        }
        addToCart(product, quantity, selectedCut ?? undefined);
        setQuantity(1);
        setSelectedCut(null);
    };

    return (
        <StorefrontLayout>
            <Head title={product.title} />

            {/* Breadcrumb */}
            <div className="bg-muted/30 border-b border-border/50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-gray-700">
                        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                        <ChevronRight className="size-3.5" />
                        <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
                        {product.category && (
                            <>
                                <ChevronRight className="size-3.5" />
                                <Link href={`/shop?category=${product.category.slug}`} className="hover:text-primary transition-colors">
                                    {product.category.name}
                                </Link>
                            </>
                        )}
                        <ChevronRight className="size-3.5" />
                        <span className="text-foreground font-medium truncate max-w-48">{product.title}</span>
                    </div>
                </div>
            </div>

            {/* Product Details */}
            <div className="container mx-auto px-4 py-8 lg:py-12">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Image */}
                    <div className="bg-muted/30 rounded-2xl aspect-square flex items-center justify-center overflow-hidden">
                        {activeImage ? (
                            <img src={activeImage} alt={product.title} className="w-full h-full object-contain p-8" />
                        ) : (
                            (() => {
                                const { icon: FallbackIcon, color, bg } = getCategoryIcon(product.category?.name || '');
                                return (
                                    <div className={`w-full h-full flex items-center justify-center ${bg} rounded-2xl`}>
                                        <FallbackIcon className={`size-24 ${color}`} strokeWidth={1.5} />
                                    </div>
                                );
                            })()
                        )}
                    </div>

                    {/* Info */}
                    <div>
                        {product.category && (
                            <Link
                                href={`/shop?category=${product.category.slug}`}
                                className="text-sm text-primary font-medium hover:underline"
                            >
                                {product.category.name}
                            </Link>
                        )}

                        <h1 className="text-2xl lg:text-3xl font-bold text-foreground mt-2">{product.title}</h1>

                        <div className="flex items-center gap-3 mt-3">
                            {product.is_halal_certified && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orfarm-green text-white text-xs font-semibold rounded-full">
                                    <Shield className="size-3" />
                                    Halal Certified
                                    {product.halal_certification_body && ` (${product.halal_certification_body})`}
                                </span>
                            )}
                            <span className="text-xs text-gray-700">SKU: {product.sku}</span>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-3 mt-5">
                            {salePrice ? (
                                <>
                                    <span className="text-3xl font-bold text-primary">£{salePrice.toFixed(2)}<span className="text-lg font-medium text-muted-foreground">/{product.unit.toLowerCase()}</span></span>
                                    <span className="text-lg text-gray-700 line-through">£{price.toFixed(2)}</span>
                                    <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded">
                                        -{product.discount_percent}%
                                    </span>
                                </>
                            ) : (
                                <span className="text-3xl font-bold text-foreground">£{price.toFixed(2)}<span className="text-lg font-medium text-muted-foreground">/{product.unit.toLowerCase()}</span></span>
                            )}
                        </div>

                        {/* Description */}
                        <p className="text-sm text-gray-700 mt-5 leading-relaxed">
                            {product.description}
                        </p>

                        {/* Cutting Options */}
                        {cuttingOptions.length > 0 && (
                            <div className="mt-6">
                                <p className="text-sm font-semibold text-foreground mb-2.5">Select Cut Style</p>
                                <div className="flex flex-wrap gap-2">
                                    {cuttingOptions.map(option => (
                                        <button
                                            key={option}
                                            onClick={() => setSelectedCut(selectedCut === option ? null : option)}
                                            className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${
                                                selectedCut === option
                                                    ? 'border-orfarm-green bg-orfarm-green text-white'
                                                    : 'border-border text-foreground hover:border-orfarm-green hover:text-orfarm-green'
                                            }`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Add to Cart */}
                        <div className="flex items-center gap-3 mt-8">
                            <div className="flex items-center border border-border rounded-lg">
                                <button
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors rounded-l-lg"
                                >
                                    <Minus className="size-4" />
                                </button>
                                <span className="w-12 text-center text-sm font-medium">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(q => q + 1)}
                                    className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors rounded-r-lg"
                                >
                                    <Plus className="size-4" />
                                </button>
                            </div>
                            <span className="text-sm font-medium text-muted-foreground">{product.unit.toLowerCase()}</span>
                            <Button size="lg" className="px-8" onClick={handleAddToCart}>
                                <ShoppingCart className="size-4 mr-2" />
                                Add to Cart
                            </Button>
                        </div>

                        {/* Tags */}
                        {product.tags && product.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-6">
                                {product.tags.map((tag, i) => (
                                    <span key={i} className="px-2.5 py-1 bg-muted rounded-full text-xs text-gray-700">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Info */}
                        <div className="mt-8 space-y-3 border-t pt-6">
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                <span className="text-green-600">✓</span>
                                {product.quantity > 0 ? `In Stock (${product.quantity} available)` : 'Out of Stock'}
                            </div>
                            {product.brand && (
                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                    Brand: <span className="text-foreground font-medium">{product.brand.name}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold text-foreground mb-6">Related Products</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                            {relatedProducts.map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </StorefrontLayout>
    );
}
