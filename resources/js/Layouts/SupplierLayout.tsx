import { ReactNode, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, Package, FolderOpen, LogOut, ChevronRight, User } from 'lucide-react';
import { toast } from 'react-toastify';

interface Props {
    children: ReactNode;
    title?: string;
}

export default function SupplierLayout({ children, title }: Props) {
    const { auth, flash } = usePage().props as any;
    const currentUrl = usePage().url;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash?.success, flash?.error]);

    const nav = [
        { name: 'Dashboard', href: '/supplier', icon: LayoutDashboard },
        { name: 'Products', href: '/supplier/products', icon: Package },
        { name: 'Categories', href: '/supplier/categories', icon: FolderOpen },
    ];

    const isActive = (href: string) => {
        if (href === '/supplier') return currentUrl === '/supplier';
        return currentUrl.startsWith(href);
    };

    return (
        <div className="min-h-screen bg-orfarm-grey">
            {/* Header */}
            <header className="bg-orfarm-blue text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <Link href="/supplier" className="flex items-center gap-2">
                                <img src="/assets/img/logo/logo.png" alt="Fresh Valley" className="h-10 w-auto brightness-0 invert" />
                                <span className="text-sm font-heading font-bold tracking-wide hidden sm:block">SUPPLIER PORTAL</span>
                            </Link>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-sm text-white/70 hidden sm:block">
                                <User className="size-4 inline mr-1" />
                                {auth?.user?.name}
                            </span>
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="flex items-center gap-1 text-sm text-white/70 hover:text-white transition-colors"
                            >
                                <LogOut className="size-4" />
                                <span className="hidden sm:inline">Logout</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Navigation Tabs */}
                <nav className="flex gap-1 mb-6 bg-white rounded-xl p-1.5 shadow-sm">
                    {nav.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                isActive(item.href)
                                    ? 'bg-orfarm-blue text-white shadow-sm'
                                    : 'text-orfarm-body hover:bg-orfarm-grey hover:text-orfarm-blue'
                            }`}
                        >
                            <item.icon className="size-4" />
                            {item.name}
                        </Link>
                    ))}
                </nav>

                {/* Page Title */}
                {title && (
                    <div className="mb-6">
                        <h1 className="text-2xl font-heading font-bold text-orfarm-blue">{title}</h1>
                    </div>
                )}

                {/* Content */}
                {children}
            </div>
        </div>
    );
}
