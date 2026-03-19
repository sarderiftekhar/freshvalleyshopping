import AdminLayout from '@/Layouts/AdminLayout';
import StatCard from '@/Components/admin/StatCard';
import { Link } from '@inertiajs/react';
import {
    ShoppingCart,
    DollarSign,
    Package,
    Users,
    Clock,
    AlertTriangle,
    Plus,
    Eye,
    Calendar,
} from 'lucide-react';

interface ActivityLogEntry {
    id: number;
    user_id: number | null;
    action: string;
    subject_type: string | null;
    subject_id: number | null;
    properties: Record<string, any> | null;
    ip_address: string | null;
    created_at: string;
    user?: { id: number; name: string };
}

interface OrderEntry {
    id: number;
    order_number: string;
    email: string;
    total: string;
    status: string;
    payment_status: string;
    created_at: string;
    user?: { id: number; name: string };
}

interface Props {
    stats: {
        totalOrders: number;
        totalRevenue: number;
        totalProducts: number;
        totalCustomers: number;
        pendingOrders: number;
        lowStockProducts: number;
    };
    recentOrders: OrderEntry[];
    recentActivity: ActivityLogEntry[];
}

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    preparing: 'bg-indigo-100 text-indigo-700',
    out_for_delivery: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
};

const paymentStatusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    paid: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700',
    refunded: 'bg-gray-100 text-gray-700',
};

export default function Dashboard({ stats, recentOrders, recentActivity }: Props) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-GB', {
            style: 'currency',
            currency: 'GBP',
        }).format(amount);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AdminLayout title="Dashboard">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
                <StatCard
                    title="Total Revenue"
                    value={formatCurrency(stats.totalRevenue)}
                    icon={DollarSign}
                    color="green"
                />
                <StatCard
                    title="Total Orders"
                    value={stats.totalOrders}
                    icon={ShoppingCart}
                    color="blue"
                />
                <StatCard
                    title="Products"
                    value={stats.totalProducts}
                    icon={Package}
                    color="purple"
                />
                <StatCard
                    title="Customers"
                    value={stats.totalCustomers}
                    icon={Users}
                    color="indigo"
                />
                <StatCard
                    title="Pending Orders"
                    value={stats.pendingOrders}
                    icon={Clock}
                    color="orange"
                />
                <StatCard
                    title="Low Stock"
                    value={stats.lowStockProducts}
                    icon={AlertTriangle}
                    color="red"
                />
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3 mb-8">
                <Link
                    href="/admin/products/create"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-orfarm-blue text-white rounded-lg text-sm font-medium hover:bg-orfarm-blue/90 transition-colors"
                >
                    <Plus className="size-4" />
                    Add Product
                </Link>
                <Link
                    href="/admin/orders"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                    <Eye className="size-4" />
                    View Orders
                </Link>
                <Link
                    href="/admin/delivery-slots"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                    <Calendar className="size-4" />
                    Delivery Slots
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="font-semibold text-gray-900">Recent Orders</h2>
                        <Link
                            href="/admin/orders"
                            className="text-sm text-orfarm-blue hover:underline"
                        >
                            View all
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {recentOrders.length === 0 ? (
                            <div className="px-5 py-8 text-center text-gray-400 text-sm">
                                No orders yet
                            </div>
                        ) : (
                            recentOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            #{order.order_number}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {order.user?.name || order.email}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-gray-900">
                                            {formatCurrency(parseFloat(order.total))}
                                        </p>
                                        <div className="flex gap-1.5 mt-0.5 justify-end">
                                            <span
                                                className={`inline-block px-2 py-0.5 text-[10px] font-medium rounded-full ${
                                                    statusColors[order.status] || 'bg-gray-100 text-gray-600'
                                                }`}
                                            >
                                                {order.status.replace('_', ' ')}
                                            </span>
                                            <span
                                                className={`inline-block px-2 py-0.5 text-[10px] font-medium rounded-full ${
                                                    paymentStatusColors[order.payment_status] || 'bg-gray-100 text-gray-600'
                                                }`}
                                            >
                                                {order.payment_status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="font-semibold text-gray-900">Recent Activity</h2>
                        <Link
                            href="/admin/activity"
                            className="text-sm text-orfarm-blue hover:underline"
                        >
                            View all
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {recentActivity.length === 0 ? (
                            <div className="px-5 py-8 text-center text-gray-400 text-sm">
                                No activity recorded yet
                            </div>
                        ) : (
                            recentActivity.map((entry) => (
                                <div
                                    key={entry.id}
                                    className="px-5 py-3 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm text-gray-900">
                                                <span className="font-medium">
                                                    {entry.user?.name || 'System'}
                                                </span>{' '}
                                                {entry.action}
                                            </p>
                                        </div>
                                        <p className="text-xs text-gray-400 whitespace-nowrap ml-4">
                                            {formatDate(entry.created_at)}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
