import { Head, Link } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import HeroBanner from '@/Components/storefront/HeroBanner';
import CategoryGrid from '@/Components/storefront/CategoryGrid';
import ProductSection from '@/Components/storefront/ProductSection';
import FeatureBanner from '@/Components/storefront/FeatureBanner';
import { Category, Product } from '@/types';
import { useState, useEffect, useCallback } from 'react';
import { ArrowRight, Leaf, Shield, Truck, Clock, Award, Sparkles } from 'lucide-react';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';

interface Props {
    categories: Category[];
    featuredProducts: Product[];
    latestProducts: Product[];
}

export default function Home({ categories, featuredProducts, latestProducts }: Props) {
    const recentlyViewed = useRecentlyViewed();

    return (
        <StorefrontLayout>
            <Head title="Fresh Halal Grocery Delivery - Dartford, Orpington & Sidcup" />

            {/* 1. Hero Slider */}
            <HeroBanner />

            {/* 2. Category Slider */}
            <CategoryGrid categories={categories} />

            {/* 3. Weekly Product Offers */}
            <ProductSection
                title="Weekly Food Offers"
                subtitle="Special Products"
                products={featuredProducts}
                viewAllHref="/shop"
            />

            {/* 4. Product Feature Area */}
            <ProductFeatureArea />

            {/* 5. Three Promotional Banners */}
            <FeatureBanner />

            {/* 6. Recently Viewed Items */}
            {recentlyViewed.length > 0 ? (
                <ProductSection
                    title="Recently Viewed Items"
                    subtitle="Your History"
                    products={recentlyViewed}
                    viewAllHref="/shop"
                />
            ) : (
                <ProductSection
                    title="Our Latest Products"
                    subtitle="Fresh Arrivals"
                    products={latestProducts}
                    viewAllHref="/shop?sort=newest"
                />
            )}

            {/* 7. Offer Countdown Banner */}
            <CountdownBanner />

            {/* 8. Blog / Latest Posts */}
            <BlogSection />
        </StorefrontLayout>
    );
}

const featureSlides = [
    {
        image: '/assets/img/slider/slider-bg-1.png',
        subtitle: 'About Our Products',
        title: 'Choose Your Healthy\nLifestyle With Us.',
        description: 'We source only the finest halal-certified meat, fresh fish, and premium groceries. Every product is carefully selected to ensure quality and freshness for your family.',
        cards: [
            { icon: Shield, iconBg: 'bg-orfarm-green/10', iconColor: 'text-orfarm-green', label: 'Halal Certified', text: 'All meat products are HMC certified for your peace of mind.', link: '/shop?category=fresh-meat-chicken', linkText: 'Shop Meat', linkColor: 'text-orfarm-green hover:text-orfarm-green-dark' },
            { icon: Leaf, iconBg: 'bg-orfarm-blue/10', iconColor: 'text-orfarm-blue', label: 'Farm Fresh', text: 'Fresh vegetables and fruits sourced from trusted farms.', link: '/shop?category=fresh-vegetables', linkText: 'Shop Veggies', linkColor: 'text-orfarm-blue hover:text-orfarm-green' },
        ],
    },
    {
        image: '/assets/img/slider/slider-bg-3.png',
        subtitle: 'Why Choose Us',
        title: 'Fresh From The\nFarm To Your Door.',
        description: 'We deliver straight from trusted farms and suppliers to your doorstep. No middlemen, no delays — just the freshest groceries at the best prices.',
        cards: [
            { icon: Truck, iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', label: 'Fast Delivery', text: 'Same-day delivery across Dartford, Orpington & Sidcup.', link: '/shop', linkText: 'Order Now', linkColor: 'text-emerald-600 hover:text-emerald-700' },
            { icon: Clock, iconBg: 'bg-amber-100', iconColor: 'text-amber-600', label: 'Always Fresh', text: 'Products restocked daily to guarantee peak freshness.', link: '/shop', linkText: 'Browse Fresh', linkColor: 'text-amber-600 hover:text-amber-700' },
        ],
    },
    {
        image: '/assets/img/slider/slider-bg-5.png',
        subtitle: 'Our Promise',
        title: 'Quality You Can\nTrust Every Day.',
        description: 'From premium halal meats to exotic spices and everyday staples — we bring you authentic flavours with uncompromising quality standards.',
        cards: [
            { icon: Award, iconBg: 'bg-purple-100', iconColor: 'text-purple-600', label: 'Top Quality', text: 'Hand-selected products that meet our strict quality standards.', link: '/shop?category=grocery', linkText: 'Shop Grocery', linkColor: 'text-purple-600 hover:text-purple-700' },
            { icon: Sparkles, iconBg: 'bg-rose-100', iconColor: 'text-rose-600', label: 'Best Value', text: 'Competitive prices on premium products, with weekly deals.', link: '/offers', linkText: 'See Offers', linkColor: 'text-rose-600 hover:text-rose-700' },
        ],
    },
];

function ProductFeatureArea() {
    const [current, setCurrent] = useState(0);
    const [animating, setAnimating] = useState(false);

    const goTo = useCallback((index: number) => {
        if (animating || index === current) return;
        setAnimating(true);
        setCurrent(index);
        setTimeout(() => setAnimating(false), 600);
    }, [animating, current]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent(prev => (prev + 1) % featureSlides.length);
        }, 5500);
        return () => clearInterval(timer);
    }, []);

    const slide = featureSlides[current];

    return (
        <section className="bg-orfarm-grey py-16 lg:py-20 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-10 items-center">
                    {/* Image Side */}
                    <div className="relative flex justify-center min-h-[350px] lg:min-h-[420px]">
                        {featureSlides.map((s, i) => (
                            <div
                                key={i}
                                className={`absolute inset-0 flex justify-center items-center transition-all duration-700 ease-in-out ${i === current ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
                            >
                                <div className="relative">
                                    <img
                                        src={s.image}
                                        alt={s.subtitle}
                                        className="max-h-[380px] lg:max-h-[420px] object-contain drop-shadow-xl"
                                    />
                                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-orfarm-green/10 rounded-full animate-pulse" />
                                    <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-orfarm-blue/10 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Content Side */}
                    <div className="lg:pl-10" key={current}>
                        <span className="text-sm font-medium text-orfarm-green uppercase tracking-widest animate-fade-in-up">
                            ~ {slide.subtitle} ~
                        </span>
                        <h2 className="text-2xl lg:text-[36px] font-heading font-bold text-orfarm-blue mt-3 leading-tight whitespace-pre-line animate-fade-in-up animation-delay-100">
                            {slide.title}
                        </h2>
                        <p className="text-orfarm-body text-base mt-4 leading-relaxed animate-fade-in-up animation-delay-200">
                            {slide.description}
                        </p>

                        <div className="grid grid-cols-2 gap-4 mt-8 animate-fade-in-up animation-delay-300">
                            {slide.cards.map((card, i) => (
                                <div key={i} className="bg-white rounded-xl p-5 border border-border/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className={`w-10 h-10 ${card.iconBg} rounded-lg flex items-center justify-center`}>
                                            <card.icon className={`size-5 ${card.iconColor}`} />
                                        </div>
                                        <h4 className="text-sm font-semibold text-orfarm-blue uppercase">{card.label}</h4>
                                    </div>
                                    <p className="text-xs text-orfarm-body leading-relaxed">
                                        {card.text}
                                    </p>
                                    <Link
                                        href={card.link}
                                        className={`inline-flex items-center gap-1 text-xs font-semibold ${card.linkColor} mt-3 transition-colors`}
                                    >
                                        {card.linkText} <ArrowRight className="size-3" />
                                    </Link>
                                </div>
                            ))}
                        </div>

                        {/* Dot indicators */}
                        <div className="flex items-center gap-2 mt-6">
                            {featureSlides.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => goTo(i)}
                                    className={`rounded-full transition-all duration-300 ${i === current ? 'w-8 h-2.5 bg-orfarm-green' : 'w-2.5 h-2.5 bg-orfarm-green/30 hover:bg-orfarm-green/50'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

const countdownSlides = [
    {
        bg: '/assets/img/banner/coundpwn-bg-1.png',
        subtitle: 'Deals Of The Day',
        title: 'Premium Drinks\nFresh Farm Product',
        description: 'Get the best deals on fresh organic products. Limited time offer on our weekly specials — halal, fresh, and delivered to your door.',
        btnText: 'Shop Now',
        btnLink: '/shop',
        secondBtnText: 'View Menu',
        textAlign: 'left' as const,
    },
    {
        bg: '/assets/img/banner/coundpwn-bg-2.png',
        subtitle: 'Weekend Special',
        title: 'Fresh Halal Meat\nDirect From Butcher',
        description: 'Hand-cut lamb, beef, and chicken — all HMC certified. Order before Friday and get free delivery on your weekend shop.',
        btnText: 'Shop Meat',
        btnLink: '/shop?category=fresh-meat-chicken',
        secondBtnText: 'View Cuts',
        textAlign: 'left' as const,
    },
    {
        bg: '/assets/img/banner/coundpwn-bg-3.png',
        subtitle: 'Seasonal Offer',
        title: 'Farm Fresh Fruits\n& Vegetables Box',
        description: 'Get a curated box of seasonal fruits and vegetables delivered weekly. Fresh from the farm, packed with nutrition and flavour.',
        btnText: 'Order Box',
        btnLink: '/shop?category=fresh-fruits',
        secondBtnText: 'Browse All',
        textAlign: 'right' as const,
    },
    {
        bg: '/assets/img/banner/coundpwn-bg-4.jpg',
        subtitle: 'Berry Boost',
        title: 'Antioxidant Rich\nSmoothies & Juices',
        description: 'Freshly blended berry smoothies packed with blueberries, raspberries, and blackberries. Natural energy and antioxidant power in every sip.',
        btnText: 'Shop Drinks',
        btnLink: '/shop?category=snacks-drinks',
        secondBtnText: 'View All',
        textAlign: 'left' as const,
    },
    {
        bg: '/assets/img/banner/coundpwn-bg-5.jpg',
        subtitle: 'Fresh & Natural',
        title: 'Raw Natural Juices\nDelivered Fresh Daily',
        description: 'Cold-pressed and freshly prepared smoothies made from real fruits. No preservatives, no added sugar — just pure goodness.',
        btnText: 'Order Now',
        btnLink: '/shop?category=snacks-drinks',
        secondBtnText: 'Browse Menu',
        textAlign: 'left' as const,
    },
];

function CountdownBanner() {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const getNextSunday = () => {
            const now = new Date();
            const nextSunday = new Date(now);
            nextSunday.setDate(now.getDate() + (7 - now.getDay()));
            nextSunday.setHours(23, 59, 59, 999);
            return nextSunday;
        };

        const target = getNextSunday();

        const update = () => {
            const now = new Date().getTime();
            const diff = target.getTime() - now;
            if (diff <= 0) return;

            setTimeLeft({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((diff / (1000 * 60)) % 60),
                seconds: Math.floor((diff / 1000) % 60),
            });
        };

        update();
        const timer = setInterval(update, 1000);
        return () => clearInterval(timer);
    }, []);

    // Rotate slides every 15 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent(prev => (prev + 1) % countdownSlides.length);
        }, 15000);
        return () => clearInterval(timer);
    }, []);

    const slide = countdownSlides[current];

    return (
        <section className="relative overflow-hidden">
            {/* Background images with crossfade */}
            {countdownSlides.map((s, i) => (
                <div
                    key={i}
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out"
                    style={{
                        backgroundImage: `url(${s.bg})`,
                        opacity: i === current ? 1 : 0,
                    }}
                />
            ))}

            <div className="container mx-auto px-4 relative z-10">
                <div className={`py-[150px] lg:py-[130px] relative ${slide.textAlign === 'right' ? 'lg:pl-[55%]' : 'lg:pl-[175px]'}`}>
                    <div className="max-w-lg" key={current}>
                        <span className="text-sm font-medium text-white/90 italic font-heading tracking-widest block mb-3 animate-fade-in-up">
                            ~ {slide.subtitle} ~
                        </span>
                        <h2 className="text-3xl lg:text-[42px] font-heading font-bold text-white leading-tight mb-6 whitespace-pre-line animate-fade-in-up animation-delay-100">
                            {slide.title}
                        </h2>
                        <p className="text-white/90 text-base leading-relaxed mb-8 max-w-md animate-fade-in-up animation-delay-200">
                            {slide.description}
                        </p>

                        {/* Countdown */}
                        <div className="animate-fade-in-up animation-delay-200">
                            <h4 className="text-white text-sm font-bold mb-1 uppercase tracking-wide">Hurry Up! Offer End In:</h4>
                            <div className="flex items-end gap-10 mb-12">
                                {[
                                    { value: timeLeft.days, label: 'Days' },
                                    { value: timeLeft.hours, label: 'Hour' },
                                    { value: timeLeft.minutes, label: 'Minute' },
                                    { value: timeLeft.seconds, label: 'Second' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-end">
                                        <span className="text-4xl font-medium text-white leading-none">{String(item.value).padStart(2, '0')}</span>
                                        <span className="text-[11px] text-white/85 uppercase tracking-wider ml-1 mb-0.5">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap gap-4 animate-fade-in-up animation-delay-300">
                            <Link
                                href={slide.btnLink}
                                className="inline-flex items-center gap-2 px-10 py-4 bg-white text-orfarm-blue font-semibold rounded-full hover:bg-orfarm-green hover:text-white transition-colors text-sm uppercase tracking-wide"
                            >
                                {slide.btnText}
                                <ArrowRight className="size-4" />
                            </Link>
                            <Link
                                href="/shop"
                                className="inline-flex items-center gap-2 px-10 py-4 border-2 border-white/50 text-white font-semibold rounded-full hover:bg-white/10 transition-colors text-sm uppercase tracking-wide"
                            >
                                {slide.secondBtnText}
                            </Link>
                        </div>
                    </div>

                    {/* Dot indicators */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 lg:left-auto lg:translate-x-0 lg:bottom-10 lg:right-10">
                        {countdownSlides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrent(i)}
                                className={`rounded-full transition-all duration-300 ${i === current ? 'w-8 h-2.5 bg-white' : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/60'}`}
                            />
                        ))}
                    </div>

                    {/* Decorative leaf shapes */}
                    <img src="/assets/img/shape/tree-leaf-1.svg" alt="" className="leaf-shape absolute -left-[175px] top-[140px] hidden lg:block cursor-pointer" />
                    <img src="/assets/img/shape/tree-leaf-2.svg" alt="" className="leaf-shape absolute right-[600px] bottom-[190px] hidden xl:block cursor-pointer" />
                    <img src="/assets/img/shape/tree-leaf-3.svg" alt="" className="leaf-shape absolute right-[70px] top-[215px] hidden lg:block cursor-pointer" />
                    <img src="/assets/img/shape/fresh-shape-1.svg" alt="" className="leaf-shape absolute right-[280px] bottom-[270px] hidden xl:block cursor-pointer" />
                </div>
            </div>
        </section>
    );
}

function BlogSection() {
    const posts = [
        {
            image: '/assets/img/hero/fish.png',
            category: 'Lifestyle',
            date: 'Mar 10, 2026',
            title: 'Grilled Salmon, Rich In Nutrients For The Body',
            excerpt: 'Discover the health benefits of fresh fish and how to incorporate it into your weekly meal plan for a balanced diet.',
        },
        {
            image: '/assets/img/hero/meat.png',
            category: 'Organics',
            date: 'Mar 08, 2026',
            title: 'The Best Benefits Of Fresh Halal Meat For Health',
            excerpt: 'Learn why choosing HMC certified halal meat matters for your family and how it ensures quality and freshness.',
        },
        {
            image: '/assets/img/hero/vegetables.png',
            category: 'Organics',
            date: 'Mar 05, 2026',
            title: 'Ways To Choose Fruits & Vegetables Good For Family',
            excerpt: 'Tips on selecting the freshest produce and storing them properly to maintain nutrients and flavour.',
        },
        {
            image: '/assets/img/hero/fruits.png',
            category: 'Shopping',
            date: 'Mar 01, 2026',
            title: 'Healthy Breakfast Ideas For The Whole Family',
            excerpt: 'Simple and nutritious breakfast recipes using fresh fruits, dairy, and wholesome grains from your local grocer.',
        },
    ];

    const categoryColors: Record<string, string> = {
        Lifestyle: 'text-orfarm-green',
        Organics: 'text-orfarm-green',
        Shopping: 'text-orfarm-green',
    };

    return (
        <section className="relative z-10 bg-orfarm-grey py-16 lg:py-20 mt-10">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <span className="text-sm font-medium text-orfarm-green italic font-heading tracking-widest">
                        ~ Read Our Blog ~
                    </span>
                    <h2 className="text-2xl lg:text-[36px] font-heading font-bold text-orfarm-blue mt-2">Our Latest Post</h2>
                    <p className="text-sm text-orfarm-body mt-2 max-w-lg mx-auto">
                        Tips, recipes, and insights on healthy eating, halal food, and making the most of fresh produce.
                    </p>
                </div>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {posts.map((post, i) => (
                        <Link key={i} href="/shop" className="group bg-white rounded-xl overflow-hidden hover:shadow-xl transition-shadow">
                            {/* Image */}
                            <div className="aspect-[4/3] bg-orfarm-grey overflow-hidden">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <div className="flex items-center gap-2 text-xs text-orfarm-body/80 mb-2">
                                    <span className={`font-semibold uppercase ${categoryColors[post.category] || 'text-orfarm-green'}`}>
                                        {post.category}
                                    </span>
                                    <span>&middot;</span>
                                    <span>{post.date}</span>
                                </div>

                                <h3 className="text-sm font-heading font-bold text-orfarm-blue leading-snug mb-2 group-hover:text-orfarm-green transition-colors line-clamp-2">
                                    {post.title}
                                </h3>

                                <p className="text-xs text-orfarm-body/80 leading-relaxed line-clamp-2 mb-4">
                                    {post.excerpt}
                                </p>

                                <span className="text-xs font-bold text-orfarm-green uppercase tracking-wide group-hover:text-orfarm-green-dark transition-colors">
                                    Continue Reading
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
