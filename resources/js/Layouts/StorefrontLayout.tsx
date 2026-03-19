import { ReactNode, useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Search, User, ShoppingCart, Menu, X, Phone, MapPin, ChevronDown, ChevronRight, Truck, Shield, Tag, Headphones, Package, Mail, Facebook, Twitter, Youtube } from 'lucide-react';
import { getCategoryIcon } from '@/lib/categoryEmojis';
import { useCart } from '@/context/CartContext';
import PageTransition from '@/Components/storefront/PageTransition';
import type { Category } from '@/types';

interface Props {
    children: ReactNode;
}

export default function StorefrontLayout({ children }: Props) {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
                <PageTransition>{children}</PageTransition>
            </main>
            <FeatureBar />
            <Footer />
        </div>
    );
}

function Header() {
    const { auth, navCategories } = usePage().props as any;
    const categories = (navCategories ?? []) as Category[];
    const { totalItems, openSidebar } = useCart();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [expandedMobileCat, setExpandedMobileCat] = useState<number | null>(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <header className={`sticky top-0 z-50 bg-white shadow-sm transition-[border-color] duration-300 border-b-[3px] ${scrolled ? 'border-orfarm-green' : 'border-transparent'}`}>
            {/* Top Bar */}
            <div className="bg-orfarm-blue text-white">
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
                <div className="flex items-center justify-between h-28 lg:h-32">
                    {/* Logo */}
                    <Link href="/" className="shrink-0 ml-4 lg:ml-8">
                        <img src="/assets/img/logo/logo.png" alt="Fresh Valley" className="h-24 lg:h-28 w-auto logo-animated" />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-8">
                        <Link href="/" className="text-sm font-medium text-foreground hover:text-orfarm-green transition-colors">
                            Home
                        </Link>
                        <Link href="/shop" className="text-sm font-medium text-foreground hover:text-orfarm-green transition-colors">
                            Shop
                        </Link>
                        <div className="relative group">
                            <button className="text-sm font-medium text-foreground hover:text-orfarm-green transition-colors flex items-center gap-1">
                                Categories
                                <ChevronDown className="size-3.5 transition-transform duration-200 group-hover:rotate-180" />
                            </button>
                            {/* Mega Menu Dropdown */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                <div className="bg-white rounded-2xl shadow-2xl border border-border/50 p-6 w-[680px]">
                                    <div className="grid grid-cols-3 gap-1.5">
                                        {categories.map(cat => {
                                            const { icon: Icon, color, bg } = getCategoryIcon(cat.name);
                                            return (
                                                <Link
                                                    key={cat.id}
                                                    href={`/shop?category=${cat.slug}`}
                                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-orfarm-green transition-all duration-200 group/item hover:shadow-md hover:scale-[1.03]"
                                                >
                                                    <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center flex-shrink-0 transition-colors duration-200 group-hover/item:bg-white/20`}>
                                                        <Icon className={`size-4 ${color} transition-colors duration-200 group-hover/item:text-white`} strokeWidth={1.5} />
                                                    </div>
                                                    <span className="text-sm font-medium text-foreground group-hover/item:text-white transition-colors duration-200">
                                                        {cat.name}
                                                    </span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-border/50 text-center">
                                        <Link
                                            href="/shop"
                                            className="text-xs font-semibold text-orfarm-green hover:text-orfarm-green-dark transition-colors uppercase tracking-wide"
                                        >
                                            Browse All Products
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Link href="/shop" className="text-sm font-medium text-foreground hover:text-orfarm-green transition-colors">
                            Offers
                        </Link>
                        <Link href="/proposal" className="text-sm font-medium text-orfarm-green hover:text-orfarm-blue transition-colors">
                            Proposal
                        </Link>
                    </nav>

                    {/* Search Bar (Desktop) */}
                    <div className="hidden lg:flex flex-1 max-w-md mx-8">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Search for halal meat, fish, groceries..."
                                className="w-full h-10 pl-4 pr-10 rounded-full border border-border bg-orfarm-grey text-sm focus:outline-none focus:ring-2 focus:ring-orfarm-green/30 focus:border-orfarm-green"
                            />
                            <button className="absolute right-1 top-1 w-8 h-8 bg-orfarm-green rounded-full flex items-center justify-center text-white hover:bg-orfarm-blue transition-colors">
                                <Search className="size-4" />
                            </button>
                        </div>
                    </div>

                    {/* Action Icons */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setSearchOpen(!searchOpen)}
                            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-orfarm-grey transition-colors"
                        >
                            <Search className="size-5 text-foreground" />
                        </button>

                        {auth?.user ? (
                            <Link
                                href="/dashboard"
                                className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full hover:bg-orfarm-grey transition-colors"
                            >
                                <User className="size-5 text-foreground" />
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full hover:bg-orfarm-grey transition-colors"
                            >
                                <User className="size-5 text-foreground" />
                            </Link>
                        )}

                        <button
                            onClick={openSidebar}
                            className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-orfarm-grey transition-colors"
                        >
                            <ShoppingCart className="size-5 text-foreground" />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-orfarm-green text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                                    {totalItems}
                                </span>
                            )}
                        </button>

                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-orfarm-grey transition-colors"
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
                                className="w-full h-10 pl-4 pr-10 rounded-full border border-border bg-orfarm-grey text-sm focus:outline-none focus:ring-2 focus:ring-orfarm-green/30"
                                autoFocus
                            />
                            <button className="absolute right-1 top-1 w-8 h-8 bg-orfarm-green rounded-full flex items-center justify-center text-white">
                                <Search className="size-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden border-t border-border bg-white">
                    <nav className="container mx-auto px-4 py-4 flex flex-col gap-1 max-h-[70vh] overflow-y-auto">
                        <Link href="/" className="py-2.5 px-3 text-sm font-medium text-foreground hover:bg-orfarm-grey rounded-lg" onClick={() => setMobileMenuOpen(false)}>Home</Link>
                        <Link href="/shop" className="py-2.5 px-3 text-sm font-medium text-foreground hover:bg-orfarm-grey rounded-lg" onClick={() => setMobileMenuOpen(false)}>Shop</Link>
                        {/* Mobile Categories */}
                        {categories.map(cat => (
                            <div key={cat.id}>
                                <div className="flex items-center">
                                    <Link
                                        href={`/shop?category=${cat.slug}`}
                                        className="flex-1 py-2.5 px-3 text-sm font-medium text-foreground hover:bg-orfarm-grey rounded-lg"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {cat.name}
                                    </Link>
                                    {cat.children && cat.children.length > 0 && (
                                        <button
                                            onClick={() => setExpandedMobileCat(expandedMobileCat === cat.id ? null : cat.id)}
                                            className="p-2 hover:bg-orfarm-grey rounded-lg"
                                        >
                                            <ChevronDown className={`size-4 transition-transform ${expandedMobileCat === cat.id ? 'rotate-180' : ''}`} />
                                        </button>
                                    )}
                                </div>
                                {expandedMobileCat === cat.id && cat.children && (
                                    <div className="ml-4 border-l-2 border-orfarm-green/20 pl-2">
                                        {cat.children.map(child => (
                                            <Link
                                                key={child.id}
                                                href={`/shop?category=${child.slug}`}
                                                className="block py-2 px-3 text-sm text-muted-foreground hover:text-orfarm-green hover:bg-orfarm-grey rounded-lg"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                {child.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        <Link href="/shop" className="py-2.5 px-3 text-sm font-medium text-foreground hover:bg-orfarm-grey rounded-lg" onClick={() => setMobileMenuOpen(false)}>Offers</Link>
                        <Link href="/proposal" className="py-2.5 px-3 text-sm font-medium text-orfarm-green hover:bg-orfarm-grey rounded-lg" onClick={() => setMobileMenuOpen(false)}>Proposal</Link>
                        {auth?.user ? (
                            <Link href="/dashboard" className="py-2.5 px-3 text-sm font-medium text-foreground hover:bg-orfarm-grey rounded-lg" onClick={() => setMobileMenuOpen(false)}>My Account</Link>
                        ) : (
                            <Link href="/login" className="py-2.5 px-3 text-sm font-medium text-foreground hover:bg-orfarm-grey rounded-lg" onClick={() => setMobileMenuOpen(false)}>Login / Register</Link>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}

function FeatureBar() {
    const features = [
        { icon: Truck, title: 'Fast Delivery', desc: 'Dartford & Surrounding' },
        { icon: Shield, title: 'Safe Payment', desc: '100% Secure Payment' },
        { icon: Tag, title: 'Online Discount', desc: 'Multi-buy Discounts' },
        { icon: Headphones, title: 'Help Center', desc: 'Dedicated 24/7 Support' },
        { icon: Package, title: 'Curated Items', desc: 'From Handpicked Sellers' },
    ];

    return (
        <section className="relative bg-orfarm-blue pt-16 pb-10 mt-20">
            {/* Torn/ripped paper top edge using template SVG */}
            <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] -translate-y-full" style={{ height: '50px' }}>
                <img src="/assets/img/shape/footer-shape-1.svg" alt="" className="w-full absolute top-0 left-0" />
            </div>
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 border-b border-white/20 pb-8">
                    {features.map((f, i) => (
                        <div key={i} className="group/feat flex flex-col items-center text-center gap-3 cursor-pointer py-3 rounded-xl transition-all duration-300 hover:bg-white/5">
                            <div className="w-14 h-14 rounded-full border-2 border-orfarm-green/40 flex items-center justify-center transition-all duration-300 group-hover/feat:bg-orfarm-green group-hover/feat:border-orfarm-green group-hover/feat:scale-110 group-hover/feat:shadow-[0_0_20px_rgba(16,98,7,0.4)]">
                                <f.icon className="size-6 text-orfarm-green transition-colors duration-300 group-hover/feat:text-white" />
                            </div>
                            <div className="transition-transform duration-300 group-hover/feat:-translate-y-0.5">
                                <h4 className="text-xs font-bold uppercase text-white tracking-wider">{f.title}</h4>
                                <p className="text-xs text-white/60 mt-1 transition-colors duration-300 group-hover/feat:text-white/90">{f.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function Footer() {
    const categories = [
        { name: 'Fruits & Vegetables', href: '/shop?category=vegetables' },
        { name: 'Dairy Products', href: '/shop?category=dairy-eggs' },
        { name: 'Fresh Meat', href: '/shop?category=fresh-meat' },
        { name: 'Fresh Fish', href: '/shop?category=fresh-fish' },
        { name: 'Rice & Grains', href: '/shop?category=rice-grains' },
    ];

    return (
        <footer className="bg-orfarm-blue text-white/90">
            {/* Main Footer */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Let Us Help You */}
                    <div>
                        <h4 className="text-white font-heading font-bold text-base uppercase tracking-wide mb-6">Let Us Help You</h4>
                        <p className="text-sm leading-relaxed mb-6">
                            If you have any question, please<br />
                            contact us at:<Link href="mailto:info@freshvalley.co.uk" className="text-orfarm-green hover:underline">info@freshvalley.co.uk</Link>
                        </p>
                        <p className="text-sm text-white/80 mb-3">Social Media:</p>
                        <div className="flex gap-3">
                            <a href="#" className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-orfarm-green transition-colors">
                                <Facebook className="size-4" />
                            </a>
                            <a href="#" className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-orfarm-green transition-colors">
                                <Twitter className="size-4" />
                            </a>
                            <a href="#" className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-orfarm-green transition-colors">
                                <Youtube className="size-4" />
                            </a>
                        </div>
                    </div>

                    {/* Location & Hours */}
                    <div>
                        <h4 className="text-white font-heading font-bold text-base uppercase tracking-wide mb-6">Find Us</h4>
                        <p className="text-sm leading-relaxed mb-5">
                            Dartford, Orpington, Sidcup<br />
                            & surrounding areas, Kent, UK.
                        </p>
                        <div className="text-sm space-y-1.5">
                            <p>Monday — Friday: <span className="text-white font-medium">8:00 AM — 6:00 PM</span></p>
                            <p>Saturday: <span className="text-white font-medium">10:00 AM — 06:00 PM</span></p>
                            <p>Sunday: <span className="text-white font-medium">Closed</span></p>
                        </div>
                    </div>

                    {/* Hot Categories */}
                    <div>
                        <h4 className="text-white font-heading font-bold text-base uppercase tracking-wide mb-6">Hot Categories</h4>
                        <ul className="space-y-3">
                            {categories.map((cat, i) => (
                                <li key={i}>
                                    <Link href={cat.href} className="text-sm hover:text-orfarm-green transition-colors flex items-center gap-2">
                                        <ChevronRight className="size-3 text-orfarm-green" />
                                        {cat.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-white font-heading font-bold text-base uppercase tracking-wide mb-6">Our Newsletter</h4>
                        <p className="text-sm leading-relaxed mb-5">
                            Subscribe to the Fresh Valley mailing list to receive updates on new arrivals & other information.
                        </p>
                        <div className="flex">
                            <div className="relative flex-1">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                                <input
                                    type="email"
                                    placeholder="Your email address..."
                                    className="w-full h-12 pl-10 pr-3 bg-white border border-white/20 rounded-l-lg text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-orfarm-green"
                                />
                            </div>
                            <button className="h-12 px-5 bg-orfarm-green text-white font-semibold text-sm rounded-r-lg hover:bg-orfarm-blue transition-colors uppercase tracking-wide">
                                Subscribe
                            </button>
                        </div>
                        <label className="flex items-center gap-2 mt-3 text-xs text-white/80 cursor-pointer">
                            <input type="checkbox" className="rounded border-white/30 bg-transparent text-orfarm-green focus:ring-orfarm-green" />
                            I accept terms & conditions & privacy policy.
                        </label>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-white/10">
                <div className="container mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-white/80">
                        Copyright &copy; {new Date().getFullYear()} <span className="text-orfarm-green font-semibold">FRESH VALLEY</span> all rights reserved. Halal Certified.
                    </p>
                    <p className="text-xs text-white/60">
                        Designed & Developed by <a href="https://www.uniqevo.co.uk" target="_blank" rel="noopener noreferrer" className="text-orfarm-green hover:text-white transition-colors font-medium">Unique Evolution Limited</a>
                    </p>
                    <div className="flex items-center">
                        <img src="/assets/img/shape/payment.png" alt="Payment methods" className="h-7" />
                    </div>
                </div>
            </div>
        </footer>
    );
}
