import { Link } from '@inertiajs/react';

const banners = [
    {
        subtitle: 'Fresh & Halal',
        title: 'Eat Healthy\nBest For Family',
        desc: 'Free Delivery Over £40',
        bg: 'from-emerald-600 to-emerald-800',
        textColor: 'text-white',
    },
    {
        subtitle: 'Premium Quality',
        title: 'Fresh Meat\nRestored Daily',
        desc: 'HMC Certified Products',
        bg: 'from-orfarm-blue to-indigo-900',
        textColor: 'text-white',
    },
    {
        subtitle: 'Limited Time',
        title: 'Weekly\nSpecial Offers',
        desc: 'Online Only Deals!',
        bg: 'from-orfarm-green to-lime-700',
        textColor: 'text-white',
    },
];

export default function FeatureBanner() {
    return (
        <section className="bg-orfarm-grey pb-14">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {banners.map((banner, i) => (
                        <Link
                            key={i}
                            href="/shop"
                            className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${banner.bg} p-8 min-h-[200px] flex flex-col justify-center hover:shadow-xl transition-shadow`}
                        >
                            <span className="text-xs font-semibold uppercase tracking-wider text-amber-300 mb-2">
                                {banner.subtitle}
                            </span>
                            <h4 className={`text-xl lg:text-2xl font-heading font-bold ${banner.textColor} whitespace-pre-line leading-tight mb-3`}>
                                {banner.title}
                            </h4>
                            <p className="text-sm text-white/70">{banner.desc}</p>

                            {/* Decorative circle */}
                            <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/10 group-hover:scale-110 transition-transform" />
                            <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-white/5" />
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
