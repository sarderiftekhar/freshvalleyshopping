import { Head, Link } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import HeroBanner from '@/Components/storefront/HeroBanner';
import CategoryGrid from '@/Components/storefront/CategoryGrid';
import ProductSection from '@/Components/storefront/ProductSection';
import FeatureBanner from '@/Components/storefront/FeatureBanner';
import { Category, Product } from '@/types';
import { useState, useEffect } from 'react';
import { ArrowRight, Leaf, Shield } from 'lucide-react';

interface Props {
    categories: Category[];
    featuredProducts: Product[];
    latestProducts: Product[];
}

export default function Home({ categories, featuredProducts, latestProducts }: Props) {
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

            {/* 6. All Products / Latest */}
            <ProductSection
                title="Our Latest Products"
                subtitle="Fresh Arrivals"
                products={latestProducts}
                viewAllHref="/shop?sort=newest"
            />

            {/* 7. Offer Countdown Banner */}
            <CountdownBanner />

            {/* 8. Blog / Latest Posts */}
            <BlogSection />
        </StorefrontLayout>
    );
}

function ProductFeatureArea() {
    return (
        <section className="bg-orfarm-grey py-16 lg:py-20">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-10 items-center">
                    {/* Image Side */}
                    <div className="relative flex justify-center">
                        <div className="relative">
                            <img
                                src="/assets/img/slider/slider-bg-1.png"
                                alt="Fresh produce"
                                className="max-h-[400px] object-contain drop-shadow-xl"
                            />
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-orfarm-green/10 rounded-full" />
                            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-orfarm-blue/10 rounded-full" />
                        </div>
                    </div>

                    {/* Content Side */}
                    <div className="lg:pl-10">
                        <span className="text-sm font-medium text-orfarm-green uppercase tracking-widest">
                            ~ About Our Products ~
                        </span>
                        <h2 className="text-2xl lg:text-[36px] font-heading font-bold text-orfarm-blue mt-3 leading-tight">
                            Choose Your Healthy<br />Lifestyle With Us.
                        </h2>
                        <p className="text-orfarm-body text-base mt-4 leading-relaxed">
                            We source only the finest halal-certified meat, fresh fish, and premium groceries.
                            Every product is carefully selected to ensure quality and freshness for your family.
                        </p>

                        <div className="grid grid-cols-2 gap-4 mt-8">
                            <div className="bg-white rounded-xl p-5 border border-border/50">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-orfarm-green/10 rounded-lg flex items-center justify-center">
                                        <Shield className="size-5 text-orfarm-green" />
                                    </div>
                                    <h4 className="text-sm font-semibold text-orfarm-blue uppercase">Halal Certified</h4>
                                </div>
                                <p className="text-xs text-orfarm-body/70 leading-relaxed">
                                    All meat products are HMC certified for your peace of mind.
                                </p>
                                <Link
                                    href="/shop?category=fresh-meat"
                                    className="inline-flex items-center gap-1 text-xs font-semibold text-orfarm-green mt-3 hover:text-orfarm-green-dark transition-colors"
                                >
                                    Shop Meat <ArrowRight className="size-3" />
                                </Link>
                            </div>

                            <div className="bg-white rounded-xl p-5 border border-border/50">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-orfarm-blue/10 rounded-lg flex items-center justify-center">
                                        <Leaf className="size-5 text-orfarm-blue" />
                                    </div>
                                    <h4 className="text-sm font-semibold text-orfarm-blue uppercase">Farm Fresh</h4>
                                </div>
                                <p className="text-xs text-orfarm-body/70 leading-relaxed">
                                    Fresh vegetables and fruits sourced from trusted farms.
                                </p>
                                <Link
                                    href="/shop?category=vegetables"
                                    className="inline-flex items-center gap-1 text-xs font-semibold text-orfarm-blue mt-3 hover:text-orfarm-green transition-colors"
                                >
                                    Shop Veggies <ArrowRight className="size-3" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function CountdownBanner() {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

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

    return (
        <section
            className="relative bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url(/assets/img/banner/coundpwn-bg-1.png)' }}
        >
            <div className="container mx-auto px-4">
                <div className="py-[150px] lg:py-[130px] lg:pl-[175px] relative">
                    <div className="max-w-lg">
                        <span className="text-sm font-medium text-white/80 italic font-heading tracking-widest block mb-3">
                            ~ Deals Of The Day ~
                        </span>
                        <h2 className="text-3xl lg:text-[42px] font-heading font-bold text-white leading-tight mb-6">
                            Premium Drinks<br />
                            Fresh Farm Product
                        </h2>
                        <p className="text-white/70 text-base leading-relaxed mb-8 max-w-md">
                            Get the best deals on fresh organic products. Limited time offer on our weekly specials — halal, fresh, and delivered to your door.
                        </p>

                        {/* Countdown */}
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
                                    <span className="text-[11px] text-white/60 uppercase tracking-wider ml-1 mb-0.5">{item.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap gap-4">
                            <Link
                                href="/shop"
                                className="inline-flex items-center gap-2 px-10 py-4 bg-white text-orfarm-blue font-semibold rounded-full hover:bg-orfarm-green hover:text-white transition-colors text-sm uppercase tracking-wide"
                            >
                                Shop Now
                                <ArrowRight className="size-4" />
                            </Link>
                            <Link
                                href="/shop"
                                className="inline-flex items-center gap-2 px-10 py-4 border-2 border-white/50 text-white font-semibold rounded-full hover:bg-white/10 transition-colors text-sm uppercase tracking-wide"
                            >
                                View Menu
                            </Link>
                        </div>
                    </div>

                    {/* Decorative leaf shapes positioned like template */}
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
                    <p className="text-sm text-orfarm-body/70 mt-2 max-w-lg mx-auto">
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
                                <div className="flex items-center gap-2 text-xs text-orfarm-body/60 mb-2">
                                    <span className={`font-semibold uppercase ${categoryColors[post.category] || 'text-orfarm-green'}`}>
                                        {post.category}
                                    </span>
                                    <span>&middot;</span>
                                    <span>{post.date}</span>
                                </div>

                                <h3 className="text-sm font-heading font-bold text-orfarm-blue leading-snug mb-2 group-hover:text-orfarm-green transition-colors line-clamp-2">
                                    {post.title}
                                </h3>

                                <p className="text-xs text-orfarm-body/60 leading-relaxed line-clamp-2 mb-4">
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
