import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { toast } from 'react-toastify';
import { Product, CartItem } from '@/types';

function cartItemMatch(item: CartItem, productId: number, cuttingOption?: string): boolean {
    return item.product.id === productId && (item.cuttingOption ?? '') === (cuttingOption ?? '');
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product, quantity?: number, cuttingOption?: string) => void;
    removeFromCart: (productId: number, cuttingOption?: string) => void;
    updateQuantity: (productId: number, quantity: number, cuttingOption?: string) => void;
    clearCart: () => void;
    totalItems: number;
    subtotal: number;
    isSidebarOpen: boolean;
    openSidebar: () => void;
    closeSidebar: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('cart');
            return saved ? JSON.parse(saved) : [];
        }
        return [];
    });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
    }, [items]);

    const openSidebar = useCallback(() => setIsSidebarOpen(true), []);
    const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);

    const addToCart = (product: Product, quantity = 1, cuttingOption?: string) => {
        setItems(prev => {
            const existing = prev.find(item => cartItemMatch(item, product.id, cuttingOption));
            if (existing) {
                toast.success(`Updated ${product.title} quantity in cart`, {
                    position: 'top-center',
                    autoClose: 2000,
                    hideProgressBar: false,
                });
                return prev.map(item =>
                    cartItemMatch(item, product.id, cuttingOption)
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            toast.success(`${product.title} added to cart`, {
                position: 'top-center',
                autoClose: 2000,
                hideProgressBar: false,
            });
            return [...prev, { product, quantity, cuttingOption }];
        });
        openSidebar();
    };

    const removeFromCart = (productId: number, cuttingOption?: string) => {
        const item = items.find(i => cartItemMatch(i, productId, cuttingOption));
        if (item) {
            toast.error(`${item.product.title} removed from cart`, {
                position: 'top-center',
                autoClose: 2000,
            });
        }
        setItems(prev => prev.filter(item => !cartItemMatch(item, productId, cuttingOption)));
    };

    const updateQuantity = (productId: number, quantity: number, cuttingOption?: string) => {
        if (quantity <= 0) {
            removeFromCart(productId, cuttingOption);
            return;
        }
        setItems(prev =>
            prev.map(item =>
                cartItemMatch(item, productId, cuttingOption) ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
        toast.info('Cart cleared', { position: 'top-center', autoClose: 1500 });
    };

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => {
        const price = parseFloat(item.product.sale_price ?? item.product.price);
        return sum + price * item.quantity;
    }, 0);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, subtotal, isSidebarOpen, openSidebar, closeSidebar }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
