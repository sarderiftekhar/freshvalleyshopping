import { Link, usePage } from '@inertiajs/react';
import { LucideIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface NavItem {
    name: string;
    href: string;
    icon: LucideIcon;
    roles: string[];
}

export interface NavGroup {
    label: string;
    items: NavItem[];
}

interface Props {
    groups: NavGroup[];
    collapsed: boolean;
    onToggle: () => void;
    userRole: string;
}

export default function SidebarNav({ groups, collapsed, onToggle, userRole }: Props) {
    const currentUrl = usePage().url;

    const isActive = (href: string) => {
        if (href === '/admin') return currentUrl === '/admin';
        return currentUrl.startsWith(href);
    };

    const filteredGroups = groups
        .map((group) => ({
            ...group,
            items: group.items.filter((item) => item.roles.includes(userRole)),
        }))
        .filter((group) => group.items.length > 0);

    return (
        <aside
            className="fixed left-0 top-0 h-screen bg-white border-r border-gray-200 z-40 transition-all duration-300 flex flex-col"
            style={{ width: collapsed ? 70 : 260 }}
        >
            {/* Logo */}
            <div className="py-5 flex flex-col items-center justify-center border-b border-gray-200 relative">
                {!collapsed && (
                    <Link href="/admin" className="flex items-center justify-center">
                        <img
                            src="/assets/img/logo/logo.png"
                            alt="Fresh Valley"
                            className="h-16 w-auto"
                        />
                    </Link>
                )}
                {collapsed && (
                    <Link href="/admin" className="flex items-center justify-center">
                        <img
                            src="/assets/img/logo/logo.png"
                            alt="Fresh Valley"
                            className="h-10 w-auto"
                        />
                    </Link>
                )}
                <button
                    onClick={onToggle}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                >
                    {collapsed ? (
                        <ChevronRight className="size-4" />
                    ) : (
                        <ChevronLeft className="size-4" />
                    )}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-2">
                {filteredGroups.map((group) => (
                    <div key={group.label} className="mb-4">
                        {!collapsed && (
                            <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                                {group.label}
                            </p>
                        )}
                        <div className="space-y-0.5">
                            {group.items.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group ${
                                        isActive(item.href)
                                            ? 'bg-orfarm-blue text-white shadow-sm'
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-orfarm-blue'
                                    } ${collapsed ? 'justify-center' : ''}`}
                                    title={collapsed ? item.name : undefined}
                                >
                                    <item.icon className="size-[18px] flex-shrink-0" />
                                    {!collapsed && <span>{item.name}</span>}
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>
        </aside>
    );
}
