import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import StatusBadge from '@/Components/admin/StatusBadge';
import { PaginatedData, Order } from '@/types';
import {
    Search,
    Download,
    Eye,
    Calendar,
    X,
    ShoppingCart,
} from 'lucide-react';

interface Props {
    orders: PaginatedData<
        Order & {
            items_count: number;
            user?: { id: number; name: string; email: string };
        }
    >;
    filters: {
        search?: string;
        status?: string;
        date_from?: string;
        date_to?: string;
    };
}

const ORDER_STATUSES = [
    { value: '', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'dispatched', label: 'Dispatched' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
];

export default function OrdersIndex({ orders, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');

    const applyFilters = (overrides: Record<string, string | undefined> = {}) => {
        const params: Record<string, string | undefined> = {
            search: search || undefined,
            status: filters.status || undefined,
            date_from: dateFrom || undefined,
            date_to: dateTo || undefined,
            ...overrides,
        };

        // Remove undefined/empty values
        const cleanParams = Object.fromEntries(
            Object.entries(params).filter(([, v]) => v !== undefined && v !== '')
        );

        router.get(route('admin.orders.index'), cleanParams, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSearch = () => {
        applyFilters({ search: search || undefined });
    };

    const handleStatusChange = (value: string) => {
        applyFilters({ status: value || undefined });
    };

    const handleDateFromChange = (value: string) => {
        setDateFrom(value);
        applyFilters({ date_from: value || undefined });
    };

    const handleDateToChange = (value: string) => {
        setDateTo(value);
        applyFilters({ date_to: value || undefined });
    };

    const clearFilters = () => {
        setSearch('');
        setDateFrom('');
        setDateTo('');
        router.get(route('admin.orders.index'), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const hasActiveFilters =
        filters.search || filters.status || filters.date_from || filters.date_to;

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    const formatTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AdminLayout title="Orders">
            <Head title="Orders" />

            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3 flex-wrap">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="Search order # or customer..."
                            className="w-72 pl-9 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orfarm-blue/20 focus:border-orfarm-blue"
                        />
                        {search && (
                            <button
                                onClick={() => {
                                    setSearch('');
                                    applyFilters({ search: undefined });
                                }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X className="size-4" />
                            </button>
                        )}
                    </div>

                    {/* Status Filter */}
                    <select
                        value={filters.status || ''}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className="border border-gray-200 rounded-lg text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orfarm-blue/20"
                    >
                        {ORDER_STATUSES.map((s) => (
                            <option key={s.value} value={s.value}>
                                {s.label}
                            </option>
                        ))}
                    </select>

                    {/* Date Range */}
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => handleDateFromChange(e.target.value)}
                                className="pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orfarm-blue/20 focus:border-orfarm-blue"
                                placeholder="From"
                            />
                        </div>
                        <span className="text-gray-400 text-sm">to</span>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => handleDateToChange(e.target.value)}
                                className="pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orfarm-blue/20 focus:border-orfarm-blue"
                                placeholder="To"
                            />
                        </div>
                    </div>

                    {/* Clear Filters */}
                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="text-sm text-gray-500 hover:text-gray-700 underline"
                        >
                            Clear filters
                        </button>
                    )}
                </div>

                {/* Export */}
                <a
                    href={route('admin.orders.export')}
                    className="inline-flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    <Download className="size-4" />
                    Export
                </a>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <p className="text-sm text-gray-500">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{orders.total}</p>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                                    Order #
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                                    Customer
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                                    Items
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                                    Total
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                                    Payment
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                                    Date
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.data.map((order) => (
                                <tr
                                    key={order.id}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-4 py-3">
                                        <Link
                                            href={route('admin.orders.show', order.id)}
                                            className="text-sm font-medium text-orfarm-blue hover:underline"
                                        >
                                            {order.order_number}
                                        </Link>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {order.user?.name || 'Guest'}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {order.email}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className="text-sm text-gray-700">
                                            {order.items_count}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <span className="text-sm font-medium text-gray-900">
                                            &pound;{parseFloat(order.total).toFixed(2)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <StatusBadge
                                            status={order.status}
                                            type="order"
                                        />
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <StatusBadge
                                            status={order.payment_status}
                                            type="payment"
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <div>
                                            <p className="text-sm text-gray-900">
                                                {formatDate(order.created_at)}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {formatTime(order.created_at)}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end">
                                            <Link
                                                href={route(
                                                    'admin.orders.show',
                                                    order.id
                                                )}
                                                className="p-1.5 text-gray-400 hover:text-orfarm-blue rounded-md hover:bg-blue-50"
                                                title="View Order"
                                            >
                                                <Eye className="size-4" />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {orders.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="px-4 py-12 text-center"
                                    >
                                        <ShoppingCart className="size-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-sm text-gray-400">
                                            No orders found.
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {orders.last_page > 1 && (
                    <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            Showing {orders.from}-{orders.to} of {orders.total}
                        </p>
                        <div className="flex gap-1">
                            {orders.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url || '#'}
                                    className={`px-3 py-1 text-sm rounded-md ${
                                        link.active
                                            ? 'bg-orfarm-blue text-white'
                                            : link.url
                                            ? 'text-gray-600 hover:bg-gray-100'
                                            : 'text-gray-300 cursor-not-allowed'
                                    }`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                    preserveState
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
