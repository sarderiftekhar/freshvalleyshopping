import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import SearchInput from '@/Components/admin/SearchInput';
import StatusBadge from '@/Components/admin/StatusBadge';
import { PaginatedData, User } from '@/types';
import { Download, Eye, Users } from 'lucide-react';

interface Customer extends User {
    orders_count: number;
    orders_sum_total: string | null;
    created_at: string;
}

interface Props {
    customers: PaginatedData<Customer>;
    filters: {
        search?: string;
        status?: string;
    };
}

export default function CustomersIndex({ customers, filters }: Props) {
    const [statusFilter, setStatusFilter] = useState(filters.status || '');

    const applyFilter = (key: string, value: string) => {
        router.get('/admin/customers', { ...filters, [key]: value || undefined }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleStatusChange = (value: string) => {
        setStatusFilter(value);
        applyFilter('status', value);
    };

    return (
        <AdminLayout title="Customers">
            <Head title="Customers" />

            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3 flex-wrap">
                    <div className="w-72">
                        <SearchInput
                            value={filters.search || ''}
                            route="/admin/customers"
                            placeholder="Search by name or email..."
                            params={{ status: filters.status }}
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className="border border-gray-200 rounded-lg text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orfarm-blue/20"
                    >
                        <option value="">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
                <a
                    href="/admin/customers-export"
                    className="inline-flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    <Download className="size-4" />
                    Export
                </a>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <p className="text-sm text-gray-500">Total Customers</p>
                    <p className="text-2xl font-bold text-gray-900">{customers.total}</p>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Customer</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Phone</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Orders</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Total Spent</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Joined</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {customers.data.map((customer) => (
                                <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="size-9 rounded-full bg-orfarm-blue/10 text-orfarm-blue flex items-center justify-center text-sm font-semibold">
                                                {customer.name?.charAt(0)?.toUpperCase() || '?'}
                                            </div>
                                            <span className="text-sm font-medium text-gray-900">{customer.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">{customer.email}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500">{customer.phone || '-'}</td>
                                    <td className="px-4 py-3 text-center text-sm font-medium text-gray-900">
                                        {customer.orders_count}
                                    </td>
                                    <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                                        &pound;{Number(customer.orders_sum_total || 0).toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <StatusBadge
                                            status={customer.is_active !== false ? 'active' : 'inactive'}
                                            type="offer"
                                        />
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">
                                        {new Date(customer.created_at).toLocaleDateString('en-GB', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end">
                                            <Link
                                                href={`/admin/customers/${customer.id}`}
                                                className="p-1.5 text-gray-400 hover:text-blue-600 rounded-md hover:bg-blue-50"
                                                title="View Customer"
                                            >
                                                <Eye className="size-4" />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {customers.data.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-4 py-12 text-center">
                                        <Users className="size-10 text-gray-300 mx-auto mb-3" />
                                        <p className="text-sm text-gray-400">No customers found.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {customers.last_page > 1 && (
                    <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            Showing {customers.from}-{customers.to} of {customers.total}
                        </p>
                        <div className="flex gap-1">
                            {customers.links.map((link, i) => (
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
                                    dangerouslySetInnerHTML={{ __html: link.label }}
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
