import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { buttonVariants } from '@/Components/ui/button';
import { cn } from '@/lib/utils';

export default function HeroBanner() {
    return (
        <section className="relative overflow-hidden"
            style={{ backgroundImage: 'url(/assets/img/slider/shape-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
            <div className="container mx-auto px-4 py-12 lg:py-20">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                    {/* Content */}
                    <div className="max-w-lg">
                        <span className="inline-block px-3 py-1 text-xs font-semibold text-primary bg-primary/10 rounded-full mb-4">
                            100% Halal Certified
                        </span>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-4">
                            Fresh Halal Meat,
                            <br />
                            Fish & Groceries
                            <br />
                            <span className="text-primary">Delivered to You</span>
                        </h1>
                        <p className="text-muted-foreground text-base lg:text-lg mb-6 leading-relaxed">
                            No more long drives for halal food. We deliver certified fresh meat, fish, and Asian groceries right to your door in Dartford, Orpington & Sidcup.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Link href="/shop" className={cn(buttonVariants({ size: 'lg' }))}>
                                Shop Now
                                <ArrowRight className="size-4 ml-1" />
                            </Link>
                            <Link href="/shop?category=fresh-meat" className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}>
                                Fresh Meat
                            </Link>
                        </div>
                        <div className="flex items-center gap-6 mt-8 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span className="text-primary text-xs font-bold">HMC</span>
                                </div>
                                Halal Certified
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <img src="/assets/img/icon/truck.svg" alt="" className="w-4 h-4" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                                </div>
                                Free over £40
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <img src="/assets/img/icon/star.svg" alt="" className="w-4 h-4" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                                </div>
                                Trusted
                            </div>
                        </div>
                    </div>

                    {/* Hero Image */}
                    <div className="hidden lg:flex justify-center relative">
                        <img
                            src="/assets/img/slider/slider-bg-1.png"
                            alt="Fresh groceries"
                            className="max-h-[420px] object-contain drop-shadow-xl"
                        />
                        {/* Decorative shapes */}
                        <img src="/assets/img/slider/slider-shape-1.png" alt="" className="absolute top-0 right-0 w-24 opacity-60" />
                        <img src="/assets/img/slider/slider-shape-2.png" alt="" className="absolute bottom-4 left-4 w-20 opacity-60" />
                    </div>
                </div>
            </div>

            <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        </section>
    );
}
