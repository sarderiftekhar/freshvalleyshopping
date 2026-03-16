import { Link } from '@inertiajs/react';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useEffect } from 'react';

export default function CartSidebar() {
    const { items, isSidebarOpen, closeSidebar, removeFromCart, updateQuantity, totalItems, subtotal } = useCart();

    // Lock body scroll when sidebar is open
    useEffect(() => {
        if (isSidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isSidebarOpen]);

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-[9998] transition-opacity duration-300 ${
                    isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
                onClick={closeSidebar}
            />

            {/* Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full w-[380px] max-w-[90vw] bg-white z-[9999] shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.785,0.135,0.15,0.86)] flex flex-col ${
                    isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-heading font-bold text-orfarm-blue flex items-center gap-2">
                        <ShoppingBag className="size-5" />
                        Your Cart ({totalItems})
                    </h3>
                    <button
                        onClick={closeSidebar}
                        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-orfarm-blue hover:text-white transition-colors"
                    >
                        <X className="size-4" />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <ShoppingBag className="size-16 text-gray-400 mb-4" />
                            <p className="text-sm text-orfarm-body/80">Your cart is empty</p>
                            <button
                                onClick={closeSidebar}
                                className="mt-4 text-sm font-semibold text-orfarm-green hover:text-orfarm-green-dark transition-colors"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <ul className="space-y-4">
                            {items.map((item, index) => {
                                const price = parseFloat(item.product.sale_price ?? item.product.price);
                                return (
                                    <li
                                        key={item.product.id}
                                        className="flex gap-4 pb-4 border-b border-gray-50 animate-fade-in-up"
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        {/* Thumbnail */}
                                        <Link
                                            href={`/product/${item.product.slug}`}
                                            onClick={closeSidebar}
                                            className="w-20 h-20 bg-orfarm-grey rounded-lg overflow-hidden shrink-0 flex items-center justify-center"
                                        >
                                            {item.product.primary_image ? (
                                                <img
                                                    src={item.product.primary_image.path}
                                                    alt={item.product.title}
                                                    className="w-full h-full object-contain p-2"
                                                />
                                            ) : (
                                                <span className="text-3xl">📦</span>
                                            )}
                                        </Link>

                                        {/* Details */}
                                        <div className="flex-1 min-w-0">
                                            <Link
                                                href={`/product/${item.product.slug}`}
                                                onClick={closeSidebar}
                                                className="text-sm font-semibold text-orfarm-blue hover:text-orfarm-green transition-colors line-clamp-2 leading-snug"
                                            >
                                                {item.product.title}
                                            </Link>
                                            <p className="text-sm font-bold text-orfarm-green mt-1">
                                                £{(price * item.quantity).toFixed(2)}
                                            </p>

                                            {/* Quantity controls */}
                                            <div className="flex items-center gap-2 mt-2">
                                                <button
                                                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                    className="w-7 h-7 rounded-md border border-gray-200 flex items-center justify-center hover:bg-orfarm-green hover:text-white hover:border-orfarm-green transition-colors"
                                                >
                                                    <Minus className="size-3" />
                                                </button>
                                                <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                    className="w-7 h-7 rounded-md border border-gray-200 flex items-center justify-center hover:bg-orfarm-green hover:text-white hover:border-orfarm-green transition-colors"
                                                >
                                                    <Plus className="size-3" />
                                                </button>
                                                <button
                                                    onClick={() => removeFromCart(item.product.id)}
                                                    className="ml-auto w-7 h-7 rounded-md flex items-center justify-center text-gray-600 hover:text-orfarm-red hover:bg-red-50 transition-colors"
                                                >
                                                    <Trash2 className="size-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t border-gray-100 px-6 py-5">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-orfarm-body">Subtotal:</span>
                            <span className="text-lg font-bold text-orfarm-blue">£{subtotal.toFixed(2)}</span>
                        </div>
                        {subtotal < 40 && (
                            <p className="text-xs text-orfarm-body/80 mb-4">
                                Add £{(40 - subtotal).toFixed(2)} more for free delivery
                            </p>
                        )}
                        {subtotal >= 40 && (
                            <p className="text-xs text-orfarm-green font-semibold mb-4">
                                You qualify for free delivery!
                            </p>
                        )}
                        <div className="flex flex-col gap-2">
                            <Link
                                href="/cart"
                                onClick={closeSidebar}
                                className="w-full py-3 bg-orfarm-blue text-white text-sm font-semibold rounded-lg text-center hover:bg-orfarm-green transition-colors"
                            >
                                View Cart
                            </Link>
                            <Link
                                href="/checkout"
                                onClick={closeSidebar}
                                className="w-full py-3 bg-orfarm-green text-white text-sm font-semibold rounded-lg text-center hover:bg-orfarm-green-dark transition-colors"
                            >
                                Checkout
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
