import { ReactNode, useEffect, useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import {
    LayoutDashboard,
    Package,
    FolderTree,
    Warehouse,
    Tag,
    Award,
    ShoppingCart,
    Calendar,
    Users,
    Truck,
    UserCog,
    Mail,
    Bell,
    Share2,
    BarChart3,
    TrendingUp,
    Settings,
    History,
    LogOut,
    User,
    Menu,
} from 'lucide-react';
import { toast } from 'react-toastify';
import SidebarNav, { NavGroup } from '@/Components/admin/SidebarNav';
import PageTransition from '@/Components/storefront/PageTransition';

const SIDEBAR_WIDTH = 260;
const SIDEBAR_COLLAPSED_WIDTH = 70;

const navGroups: NavGroup[] = [
    {
        label: 'Main',
        items: [
            { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, roles: ['super_admin', 'admin', 'editor'] },
        ],
    },
    {
        label: 'Catalog',
        items: [
            { name: 'Products', href: '/admin/products', icon: Package, roles: ['super_admin', 'admin', 'editor'] },
            { name: 'Categories', href: '/admin/categories', icon: FolderTree, roles: ['super_admin', 'admin', 'editor'] },
            { name: 'Brands', href: '/admin/brands', icon: Award, roles: ['super_admin', 'admin', 'editor'] },
            { name: 'Inventory', href: '/admin/inventory', icon: Warehouse, roles: ['super_admin', 'admin'] },
            { name: 'Special Offers', href: '/admin/offers', icon: Tag, roles: ['super_admin', 'admin', 'editor'] },
        ],
    },
    {
        label: 'Sales',
        items: [
            { name: 'Orders', href: '/admin/orders', icon: ShoppingCart, roles: ['super_admin', 'admin'] },
            { name: 'Delivery Slots', href: '/admin/delivery-slots', icon: Calendar, roles: ['super_admin', 'admin'] },
        ],
    },
    {
        label: 'People',
        items: [
            { name: 'Customers', href: '/admin/customers', icon: Users, roles: ['super_admin', 'admin'] },
            { name: 'Suppliers', href: '/admin/suppliers', icon: Truck, roles: ['super_admin'] },
            { name: 'User Management', href: '/admin/users', icon: UserCog, roles: ['super_admin'] },
        ],
    },
    {
        label: 'Marketing',
        items: [
            { name: 'Email Campaigns', href: '/admin/campaigns', icon: Mail, roles: ['super_admin', 'admin'] },
            { name: 'Subscribers', href: '/admin/subscribers', icon: Bell, roles: ['super_admin', 'admin'] },
            { name: 'Social Media', href: '/admin/social-posts', icon: Share2, roles: ['super_admin', 'admin'] },
        ],
    },
    {
        label: 'Reports',
        items: [
            { name: 'Sales Reports', href: '/admin/reports/sales', icon: BarChart3, roles: ['super_admin', 'admin'] },
            { name: 'Product Reports', href: '/admin/reports/products', icon: TrendingUp, roles: ['super_admin', 'admin'] },
        ],
    },
    {
        label: 'System',
        items: [
            { name: 'Settings', href: '/admin/settings/general', icon: Settings, roles: ['super_admin'] },
            { name: 'Activity Log', href: '/admin/activity', icon: History, roles: ['super_admin'] },
        ],
    },
];

interface Props {
    children: ReactNode;
    title?: string;
}

export default function AdminLayout({ children, title }: Props) {
    const { auth, flash } = usePage().props as any;
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const check = () => setIsDesktop(window.innerWidth >= 1024);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash?.success, flash?.error]);

    const userRole = auth?.user?.role || 'customer';
    const sidebarWidth = sidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Desktop Sidebar */}
            {isDesktop && (
                <SidebarNav
                    groups={navGroups}
                    collapsed={sidebarCollapsed}
                    onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                    userRole={userRole}
                />
            )}

            {/* Mobile Sidebar Overlay */}
            {mobileSidebarOpen && !isDesktop && (
                <div className="fixed inset-0 z-50">
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setMobileSidebarOpen(false)}
                    />
                    <div className="relative z-10">
                        <SidebarNav
                            groups={navGroups}
                            collapsed={false}
                            onToggle={() => setMobileSidebarOpen(false)}
                            userRole={userRole}
                        />
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div
                className="transition-all duration-300 min-w-0"
                style={{ marginLeft: isDesktop ? sidebarWidth : 0 }}
            >
                {/* Top Header */}
                <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
                    <div className="flex items-center justify-between h-16 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                            {!isDesktop && (
                                <button
                                    onClick={() => setMobileSidebarOpen(true)}
                                    className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
                                >
                                    <Menu className="size-5" />
                                </button>
                            )}
                            {title && (
                                <h1 className="text-lg font-bold text-gray-900">{title}</h1>
                            )}
                        </div>

                        <div className="flex items-center gap-4">
                            <Link
                                href="/"
                                className="text-sm text-gray-500 hover:text-orfarm-blue transition-colors"
                            >
                                View Store
                            </Link>
                            <div className="flex items-center gap-2">
                                <div className="size-8 rounded-full bg-orfarm-blue text-white flex items-center justify-center text-sm font-medium">
                                    {auth?.user?.name?.charAt(0)?.toUpperCase() || 'A'}
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-sm font-medium text-gray-700">
                                        {auth?.user?.name}
                                    </p>
                                    <p className="text-xs text-gray-400 capitalize">
                                        {userRole.replace('_', ' ')}
                                    </p>
                                </div>
                            </div>
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-red-500 transition-colors"
                                title="Logout"
                            >
                                <LogOut className="size-4" />
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 sm:p-8 lg:p-10">
                    <PageTransition>
                        {children}
                    </PageTransition>
                </main>
            </div>
        </div>
    );
}
