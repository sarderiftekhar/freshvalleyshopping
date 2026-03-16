import { ReactNode, useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Search, User, ShoppingCart, Menu, X, Phone, MapPin, ChevronDown, Truck, Shield, Tag, Headphones, Package, Mail, Facebook, Twitter, Youtube, ChevronRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import PageTransition from '@/Components/storefront/PageTransition';

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
    const { auth } = usePage().props as any;
    const { totalItems, openSidebar } = useCart();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

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
                        <img src="/assets/img/logo/logo.png" alt="Fresh Valley" className="h-24 lg:h-28 w-auto" />
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
                                <ChevronDown className="size-3.5" />
                            </button>
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
                    <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
                        <Link href="/" className="py-2.5 px-3 text-sm font-medium text-foreground hover:bg-orfarm-grey rounded-lg" onClick={() => setMobileMenuOpen(false)}>Home</Link>
                        <Link href="/shop" className="py-2.5 px-3 text-sm font-medium text-foreground hover:bg-orfarm-grey rounded-lg" onClick={() => setMobileMenuOpen(false)}>Shop</Link>
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
                        <div key={i} className="flex flex-col items-center text-center gap-3">
                            <f.icon className="size-8 text-orfarm-green" />
                            <div>
                                <h4 className="text-xs font-bold uppercase text-white tracking-wider">{f.title}</h4>
                                <p className="text-xs text-white/85 mt-1">{f.desc}</p>
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
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/40" />
                                <input
                                    type="email"
                                    placeholder="Your email address..."
                                    className="w-full h-12 pl-10 pr-3 bg-white/10 border border-white/20 rounded-l-lg text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-orfarm-green"
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
                    <div className="flex items-center">
                        <img src="/assets/img/shape/payment.png" alt="Payment methods" className="h-7" />
                    </div>
                </div>
            </div>
        </footer>
    );
}
