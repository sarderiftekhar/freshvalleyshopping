import { ReactNode, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Search, User, ShoppingCart, Menu, X, Phone, MapPin, ChevronDown } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface Props {
    children: ReactNode;
}

export default function StorefrontLayout({ children }: Props) {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}

function Header() {
    const { auth } = usePage().props as any;
    const { totalItems } = useCart();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm">
            {/* Top Bar */}
            <div className="bg-primary text-primary-foreground">
                <div className="container mx-auto px-4 py-1.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                            <Phone className="size-3" />
                            07XXX XXXXXX
                        </span>
                        <span className="hidden sm:flex items-center gap-1">
                            <MapPin className="size-3" />
                            Dartford, Kent
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="hidden sm:inline">Certified Halal | Free Delivery over £40</span>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 shrink-0">
                        <img src="/assets/img/logo/logo.png" alt="Fresh Valley" className="h-10 w-auto" />
                        <div className="hidden sm:block">
                            <span className="font-bold text-xl text-foreground leading-tight block">Fresh Valley</span>
                            <span className="text-xs text-muted-foreground leading-tight block">Halal Grocery & Delivery</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-8">
                        <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                            Home
                        </Link>
                        <Link href="/shop" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                            Shop
                        </Link>
                        <div className="relative group">
                            <button className="text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1">
                                Categories
                                <ChevronDown className="size-3.5" />
                            </button>
                        </div>
                        <Link href="/shop" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                            Offers
                        </Link>
                    </nav>

                    {/* Search Bar (Desktop) */}
                    <div className="hidden lg:flex flex-1 max-w-md mx-8">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Search for halal meat, fish, groceries..."
                                className="w-full h-10 pl-4 pr-10 rounded-full border border-border bg-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                            />
                            <button className="absolute right-1 top-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors">
                                <Search className="size-4" />
                            </button>
                        </div>
                    </div>

                    {/* Action Icons */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setSearchOpen(!searchOpen)}
                            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
                        >
                            <Search className="size-5 text-foreground" />
                        </button>

                        {auth?.user ? (
                            <Link
                                href="/dashboard"
                                className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full hover:bg-muted transition-colors"
                            >
                                <User className="size-5 text-foreground" />
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full hover:bg-muted transition-colors"
                            >
                                <User className="size-5 text-foreground" />
                            </Link>
                        )}

                        <Link
                            href="/cart"
                            className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
                        >
                            <ShoppingCart className="size-5 text-foreground" />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                        </Link>

                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
                        >
                            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Search */}
                {searchOpen && (
                    <div className="lg:hidden pb-3">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search for halal meat, fish, groceries..."
                                className="w-full h-10 pl-4 pr-10 rounded-full border border-border bg-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                                autoFocus
                            />
                            <button className="absolute right-1 top-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
                                <Search className="size-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden border-t border-border bg-white">
                    <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
                        <Link href="/" className="py-2.5 px-3 text-sm font-medium text-foreground hover:bg-muted rounded-lg" onClick={() => setMobileMenuOpen(false)}>Home</Link>
                        <Link href="/shop" className="py-2.5 px-3 text-sm font-medium text-foreground hover:bg-muted rounded-lg" onClick={() => setMobileMenuOpen(false)}>Shop</Link>
                        <Link href="/shop" className="py-2.5 px-3 text-sm font-medium text-foreground hover:bg-muted rounded-lg" onClick={() => setMobileMenuOpen(false)}>Offers</Link>
                        {auth?.user ? (
                            <Link href="/dashboard" className="py-2.5 px-3 text-sm font-medium text-foreground hover:bg-muted rounded-lg" onClick={() => setMobileMenuOpen(false)}>My Account</Link>
                        ) : (
                            <Link href="/login" className="py-2.5 px-3 text-sm font-medium text-foreground hover:bg-muted rounded-lg" onClick={() => setMobileMenuOpen(false)}>Login / Register</Link>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}

function Footer() {
    return (
        <footer className="bg-neutral-900 text-neutral-300">
            {/* Main Footer */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* About */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <img src="/assets/img/logo/logo.png" alt="Fresh Valley" className="h-9 w-auto brightness-0 invert" />
                            <span className="font-bold text-lg text-white">Fresh Valley</span>
                        </div>
                        <p className="text-sm leading-relaxed mb-4">
                            Certified halal meat, fish, and Asian groceries delivered fresh to your door in Dartford, Orpington & Sidcup.
                        </p>
                        <div className="flex gap-3">
                            <a href="#" className="w-8 h-8 bg-neutral-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors text-sm">f</a>
                            <a href="#" className="w-8 h-8 bg-neutral-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors text-sm">W</a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2.5 text-sm">
                            <li><Link href="/shop" className="hover:text-primary transition-colors">Shop All</Link></li>
                            <li><Link href="/shop?category=fresh-meat" className="hover:text-primary transition-colors">Fresh Meat</Link></li>
                            <li><Link href="/shop?category=fresh-fish" className="hover:text-primary transition-colors">Fresh Fish</Link></li>
                            <li><Link href="/shop?category=vegetables" className="hover:text-primary transition-colors">Vegetables</Link></li>
                            <li><Link href="/shop?category=rice-grains" className="hover:text-primary transition-colors">Rice & Grains</Link></li>
                        </ul>
                    </div>

                    {/* Delivery Info */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Delivery Info</h4>
                        <ul className="space-y-2.5 text-sm">
                            <li className="flex items-start gap-2">
                                <MapPin className="size-4 mt-0.5 shrink-0" />
                                Dartford, Orpington, Sidcup & surrounding areas
                            </li>
                            <li>Delivery: Twice a week</li>
                            <li>Free delivery on orders over £40</li>
                            <li>Same-day order cutoff: 6pm</li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Contact Us</h4>
                        <ul className="space-y-2.5 text-sm">
                            <li className="flex items-center gap-2">
                                <Phone className="size-4 shrink-0" />
                                07XXX XXXXXX
                            </li>
                            <li>WhatsApp orders welcome</li>
                            <li>info@freshvalley.co.uk</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-neutral-800">
                <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-neutral-500">
                    <p>&copy; {new Date().getFullYear()} Fresh Valley Shopping. All rights reserved.</p>
                    <p>Halal Certified by HMC</p>
                </div>
            </div>
        </footer>
    );
}
