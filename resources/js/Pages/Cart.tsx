import { Head, Link } from '@inertiajs/react';
import { Minus, Plus, Trash2, ChevronRight, ShoppingCart } from 'lucide-react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import { useCart } from '@/context/CartContext';
import { Button, buttonVariants } from '@/Components/ui/button';
import { cn } from '@/lib/utils';

export default function Cart() {
    const { items, updateQuantity, removeFromCart, clearCart, subtotal } = useCart();

    const deliveryFee = subtotal >= 40 ? 0 : 4.99;
    const total = subtotal + deliveryFee;

    return (
        <StorefrontLayout>
            <Head title="Shopping Cart" />

            {/* Breadcrumb */}
            <div className="bg-muted/30 border-b border-border/50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                        <ChevronRight className="size-3.5" />
                        <span className="text-foreground font-medium">Cart</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 pt-10 pb-20">
                <h1 className="text-2xl font-bold text-foreground mb-8">Shopping Cart</h1>

                {items.length === 0 ? (
                    <div className="text-center py-16">
                        <ShoppingCart className="size-16 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-lg text-muted-foreground mb-4">Your cart is empty</p>
                        <Link href="/shop" className={cn(buttonVariants())}>Start Shopping</Link>
                    </div>
                ) : (
                    <div className="lg:flex lg:gap-8">
                        {/* Cart Items */}
                        <div className="flex-1">
                            <div className="space-y-4">
                                {items.map(item => {
                                    const price = parseFloat(item.product.sale_price ?? item.product.price);
                                    const itemKey = `${item.product.id}-${item.cuttingOption ?? ''}`;
                                    return (
                                        <div key={itemKey} className="flex gap-5 p-5 bg-white rounded-xl border border-border/50">
                                            {/* Image */}
                                            <Link href={`/product/${item.product.slug}`} className="w-28 h-28 bg-muted/30 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                                                {item.product.primary_image ? (
                                                    <img src={item.product.primary_image.path} alt={item.product.title} className="w-full h-full object-contain p-2" />
                                                ) : (
                                                    <span className="text-3xl">📦</span>
                                                )}
                                            </Link>

                                            {/* Details */}
                                            <div className="flex-1 min-w-0">
                                                <Link href={`/product/${item.product.slug}`} className="text-base font-semibold text-foreground hover:text-primary transition-colors line-clamp-2">
                                                    {item.product.title}
                                                </Link>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {item.product.unit}
                                                    {item.cuttingOption && <span className="ml-2 text-orfarm-green font-medium">· {item.cuttingOption}</span>}
                                                </p>
                                                <div className="flex items-center justify-between mt-3">
                                                    <div className="flex items-center border border-border rounded-lg">
                                                        <button onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.cuttingOption)} className="w-9 h-9 flex items-center justify-center hover:bg-muted rounded-l-lg">
                                                            <Minus className="size-4" />
                                                        </button>
                                                        <span className="w-10 text-center text-base font-medium">{item.quantity}</span>
                                                        <button onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.cuttingOption)} className="w-9 h-9 flex items-center justify-center hover:bg-muted rounded-r-lg">
                                                            <Plus className="size-4" />
                                                        </button>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-base font-bold text-foreground">£{(price * item.quantity).toFixed(2)}</span>
                                                        <button onClick={() => removeFromCart(item.product.id, item.cuttingOption)} className="text-muted-foreground hover:text-destructive transition-colors">
                                                            <Trash2 className="size-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="mt-4 flex justify-between">
                                <Button variant="ghost" size="sm" onClick={clearCart}>Clear Cart</Button>
                                <Link href="/shop" className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}>
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="lg:w-80 mt-6 lg:mt-0">
                            <div className="bg-white rounded-xl border border-border/50 p-6 sticky top-24">
                                <h3 className="font-semibold text-foreground mb-4">Order Summary</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span className="font-medium">£{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Delivery</span>
                                        <span className={`font-medium ${deliveryFee === 0 ? 'text-green-600' : ''}`}>
                                            {deliveryFee === 0 ? 'FREE' : `£${deliveryFee.toFixed(2)}`}
                                        </span>
                                    </div>
                                    {deliveryFee > 0 && (
                                        <p className="text-xs text-primary">
                                            Add £{(40 - subtotal).toFixed(2)} more for free delivery
                                        </p>
                                    )}
                                    <div className="border-t pt-2 mt-2">
                                        <div className="flex justify-between">
                                            <span className="font-semibold text-foreground">Total</span>
                                            <span className="font-bold text-lg text-foreground">£{total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                                <Button className="w-full mt-6" size="lg">
                                    Proceed to Checkout
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </StorefrontLayout>
    );
}
