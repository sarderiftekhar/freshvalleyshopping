import { Truck, Shield, Clock, Leaf } from 'lucide-react';

export default function FeatureBanner() {
    const features = [
        { icon: Shield, title: 'Halal Certified', description: 'HMC certified meat & poultry' },
        { icon: Truck, title: 'Local Delivery', description: 'Dartford, Orpington & Sidcup' },
        { icon: Clock, title: 'Twice Weekly', description: 'Reliable delivery schedule' },
        { icon: Leaf, title: 'Fresh Promise', description: 'Direct from our butcher shop' },
    ];

    return (
        <section className="py-10 lg:py-14 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    {features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3 bg-white rounded-xl p-5 border border-border/50">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                                <feature.icon className="size-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-foreground">{feature.title}</h3>
                                <p className="text-xs text-muted-foreground mt-0.5">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
