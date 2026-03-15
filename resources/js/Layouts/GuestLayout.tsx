import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import StorefrontLayout from './StorefrontLayout';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <StorefrontLayout>
            {/* Breadcrumb */}
            <div className="bg-muted/50 border-b border-border">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-foreground">My Account</span>
                    </div>
                </div>
            </div>

            {/* Auth Content */}
            <section className="py-10 sm:py-16">
                <div className="container mx-auto px-4">
                    {children}
                </div>
            </section>
        </StorefrontLayout>
    );
}
