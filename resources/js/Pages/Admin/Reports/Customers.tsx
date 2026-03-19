import { FormEvent, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Users, UserPlus, ShoppingCart, Filter } from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';

interface NewCustomerEntry {
    date: string;
    count: number;
}

interface TopCustomer {
    id: number;
    name: string;
    email: string;
    orders_count: number;
    total_spent: number;
}

interface Props {
    newCustomers: NewCustomerEntry[];
    topCustomers: TopCustomer[];
    stats: {
        total_customers: number;
        new_this_period: number;
        with_orders: number;
    };
    filters: {
        date_from: string;
        date_to: string;
    };
}

export default function Customers({ newCustomers, topCustomers, stats, filters }: Props) {
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount);

    const formatChartDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
        });

    const handleFilter = (e: FormEvent) => {
        e.preventDefault();
        router.get('/admin/reports/customers', {
            date_from: dateFrom || undefined,
            date_to: dateTo || undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const chartData = newCustomers.map((d) => ({
        ...d,
        label: formatChartDate(d.date),
    }));

    const statCards = [
        {
            title: 'Total Customers',
            value: stats.total_customers.toLocaleString(),
            icon: Users,
            color: 'bg-blue-50 text-blue-600',
        },
        {
            title: 'New This Period',
            value: stats.new_this_period.toLocaleString(),
            icon: UserPlus,
            color: 'bg-green-50 text-green-600',
        },
        {
            title: 'With Orders',
            value: stats.with_orders.toLocaleString(),
            icon: ShoppingCart,
            color: 'bg-purple-50 text-purple-600',
        },
    ];

    return (
        <AdminLayout title="Customer Reports">
            <Head title="Customer Reports" />

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {statCards.map((card) => (
                    <div
                        key={card.title}
                        className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4"
                    >
                        <div className={`p-3 rounded-lg ${card.color}`}>
                            <card.icon className="size-5" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">{card.title}</p>
                            <p className="text-xl font-bold text-gray-900">{card.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Date Range Filter */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
                <form onSubmit={handleFilter} className="flex flex-wrap items-end gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date From
                        </label>
                        <input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orfarm-blue/20 focus:border-orfarm-blue"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date To
                        </label>
                        <input
                            type="date"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orfarm-blue/20 focus:border-orfarm-blue"
                        />
                    </div>
                    <button
                        type="submit"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-orfarm-blue text-white rounded-lg text-sm font-medium hover:bg-orfarm-blue/90 transition-colors"
                    >
                        <Filter className="size-4" />
                        Apply
                    </button>
                </form>
            </div>

            {/* New Customer Acquisitions Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    New Customer Acquisitions
                </h2>
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                            <Tooltip
                                formatter={(value: any) => [value, 'New Customers']}
                                labelFormatter={(label) => `Date: ${label}`}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="count"
                                stroke="#10b981"
                                strokeWidth={2}
                                dot={{ r: 3 }}
                                activeDot={{ r: 5 }}
                                name="New Customers"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="py-12 text-center text-gray-400 text-sm">
                        No customer acquisition data for the selected period.
                    </div>
                )}
            </div>

            {/* Top Customers Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-900">Top Customers</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                                    #
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                                    Name
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                                    Email
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                                    Orders
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                                    Total Spent
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {topCustomers.map((customer, index) => (
                                <tr
                                    key={customer.id}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-4 py-3 text-sm text-gray-400">
                                        {index + 1}
                                    </td>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                        {customer.name}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">
                                        {customer.email}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-900 text-right">
                                        {customer.orders_count}
                                    </td>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                                        {formatCurrency(customer.total_spent)}
                                    </td>
                                </tr>
                            ))}
                            {topCustomers.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-4 py-12 text-center text-gray-400 text-sm"
                                    >
                                        No customer data available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
