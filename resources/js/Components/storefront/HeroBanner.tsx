import { Link } from '@inertiajs/react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

const slides = [
    {
        subtitle: 'Fresh & Halal Delivered',
        title: 'Farm Fresh Vegetables\nAt Your Doorstep.',
        description: 'Hand-picked seasonal vegetables sourced daily from trusted farms. Crisp, clean, and delivered fresh to your kitchen in Dartford & Sidcup.',
        image: '/assets/img/hero/vegetables.png',
        btnText: 'Shop Vegetables',
        btnLink: '/shop?category=vegetables',
    },
    {
        subtitle: '100% HMC Halal Certified',
        title: 'Premium Raw Halal\nMeat You Can Trust.',
        description: 'Freshly butchered lamb, beef, and mutton — all HMC certified. From our butcher block to your table, quality you can taste.',
        image: '/assets/img/hero/meat.png',
        btnText: 'Shop Meat',
        btnLink: '/shop?category=fresh-meat',
    },
    {
        subtitle: 'Catch Of The Day',
        title: 'Fresh Whole Fish\n& Seafood Delivered.',
        description: 'Wild-caught and responsibly sourced — sea bass, pomfret, tilapia, and prawns. Never frozen, always fresh to your door.',
        image: '/assets/img/hero/fish.png',
        btnText: 'Shop Fish',
        btnLink: '/shop?category=fresh-fish',
    },
    {
        subtitle: 'Naturally Sweet & Ripe',
        title: 'Juicy Fresh Fruits\nPicked For Flavour.',
        description: 'From tropical mangoes to crisp English apples — handpicked fruits bursting with natural sweetness, delivered twice weekly.',
        image: '/assets/img/hero/fruits.png',
        btnText: 'Shop Fruits',
        btnLink: '/shop?category=fresh-fruits',
    },
    {
        subtitle: 'Freshest Cuts Daily',
        title: 'Quality Cuts For\nEvery Family Meal.',
        description: 'Lamb shoulder, beef mince, goat curry cut — prepared fresh by our halal butchers. Perfect for curries, grills, and roasts.',
        image: '/assets/img/hero/meat2.png',
        btnText: 'Order Now',
        btnLink: '/shop?category=fresh-meat',
    },
    {
        subtitle: 'Free Delivery Over £40',
        title: 'Your Weekly Grocery\nShop Made Easy.',
        description: 'Skip the supermarket queues. Get halal meat, fresh fish, vegetables, and Asian groceries delivered to Dartford, Orpington & Sidcup.',
        image: '/assets/img/hero/veggies-line.png',
        btnText: 'Start Shopping',
        btnLink: '/shop',
    },
];

export default function HeroBanner() {
    const [current, setCurrent] = useState(0);
    const [animating, setAnimating] = useState(false);

    const goTo = useCallback((index: number) => {
        if (animating) return;
        setAnimating(true);
        setCurrent(index);
        setTimeout(() => setAnimating(false), 600);
    }, [animating]);

    const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo]);
    const prev = useCallback(() => goTo((current - 1 + slides.length) % slides.length), [current, goTo]);

    useEffect(() => {
        const timer = setInterval(next, 4500);
        return () => clearInterval(timer);
    }, [next]);

    const slide = slides[current];

    return (
        <section className="relative bg-orfarm-grey overflow-hidden group/slider">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[400px] sm:min-h-[500px] lg:min-h-[600px] py-12 lg:py-0">
                    {/* Content */}
                    <div className="max-w-lg" key={current}>
                        <span className="inline-block text-sm font-medium uppercase tracking-widest text-orfarm-green mb-4 animate-fade-in-up">
                            {slide.subtitle}
                        </span>
                        <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-display font-bold italic text-orfarm-blue leading-[1.35] sm:leading-[1.4] lg:leading-[1.45] mb-6 whitespace-pre-line animate-fade-in-up animation-delay-100">
                            {slide.title}
                        </h1>
                        <p className="text-orfarm-body text-base leading-relaxed mb-8 animate-fade-in-up animation-delay-200">
                            {slide.description}
                        </p>
                        <div className="animate-fade-in-up animation-delay-300">
                            <Link
                                href={slide.btnLink}
                                className="inline-flex items-center gap-2 px-8 py-4 bg-orfarm-green text-white font-semibold rounded-lg hover:bg-orfarm-green-dark transition-colors text-sm uppercase tracking-wide"
                            >
                                {slide.btnText}
                                <ArrowRight className="size-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Image */}
                    <div className="hidden lg:flex justify-center items-center relative" key={`img-${current}`}>
                        <img
                            src={slide.image}
                            alt={slide.title.replace('\n', ' ')}
                            className="max-h-[420px] max-w-full object-contain drop-shadow-2xl animate-fade-in-right"
                        />
                        {/* Decorative shapes */}
                        <div className="absolute top-8 right-8 w-20 h-20 rounded-full bg-orfarm-green/10 animate-pulse" />
                        <div className="absolute bottom-12 left-8 w-14 h-14 rounded-full bg-orfarm-blue/10 animate-pulse animation-delay-200" />
                        <div className="absolute top-1/2 right-0 w-10 h-10 rounded-full bg-orfarm-yellow/20 animate-bounce" />
                    </div>
                </div>
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-orfarm-green text-white flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-orfarm-green-dark shadow-lg"
            >
                <ChevronLeft className="size-6" />
            </button>
            <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-orfarm-green text-white flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity hover:bg-orfarm-green-dark shadow-lg"
            >
                <ChevronRight className="size-6" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i)}
                        className={`w-3 h-3 rounded-full transition-all ${i === current ? 'bg-orfarm-green w-8' : 'bg-orfarm-blue/30 hover:bg-orfarm-blue/50'}`}
                    />
                ))}
            </div>
        </section>
    );
}
