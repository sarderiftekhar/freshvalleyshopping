import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { ChevronRight, Minus, Plus, ShoppingCart, Shield } from 'lucide-react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import ProductCard from '@/Components/storefront/ProductCard';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types';
import { Button } from '@/Components/ui/button';

interface Props {
    product: Product;
    relatedProducts: Product[];
}

export default function ProductDetail({ product, relatedProducts }: Props) {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);

    const price = parseFloat(product.price);
    const salePrice = product.sale_price ? parseFloat(product.sale_price) : null;
    const activeImage = product.images?.[0]?.path;

    const handleAddToCart = () => {
        addToCart(product, quantity);
        setQuantity(1);
    };

    return (
        <StorefrontLayout>
            <Head title={product.title} />

            {/* Breadcrumb */}
            <div className="bg-muted/30 border-b border-border/50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
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
                            <div className="text-8xl">
                                {product.category?.name === 'Fresh Meat' ? '🥩' :
                                 product.category?.name === 'Fresh Fish' ? '🐟' :
                                 product.category?.name === 'Vegetables' ? '🥬' :
                                 product.category?.name === 'Rice & Grains' ? '🍚' :
                                 product.category?.name === 'Spices & Herbs' ? '🌶️' : '📦'}
                            </div>
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
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                                    <Shield className="size-3" />
                                    Halal Certified
                                    {product.halal_certification_body && ` (${product.halal_certification_body})`}
                                </span>
                            )}
                            <span className="text-xs text-muted-foreground">SKU: {product.sku}</span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-3 mt-5">
                            {salePrice ? (
                                <>
                                    <span className="text-3xl font-bold text-primary">£{salePrice.toFixed(2)}</span>
                                    <span className="text-lg text-muted-foreground line-through">£{price.toFixed(2)}</span>
                                    <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded">
                                        -{product.discount_percent}%
                                    </span>
                                </>
                            ) : (
                                <span className="text-3xl font-bold text-foreground">£{price.toFixed(2)}</span>
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{product.unit}</p>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground mt-5 leading-relaxed">
                            {product.description}
                        </p>

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
                            <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                                <ShoppingCart className="size-4 mr-2" />
                                Add to Cart
                            </Button>
                        </div>

                        {/* Tags */}
                        {product.tags && product.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-6">
                                {product.tags.map((tag, i) => (
                                    <span key={i} className="px-2.5 py-1 bg-muted rounded-full text-xs text-muted-foreground">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Info */}
                        <div className="mt-8 space-y-3 border-t pt-6">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span className="text-green-600">✓</span>
                                {product.quantity > 0 ? `In Stock (${product.quantity} available)` : 'Out of Stock'}
                            </div>
                            {product.brand && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    Brand: <span className="text-foreground font-medium">{product.brand}</span>
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
