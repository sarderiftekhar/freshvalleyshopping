import { FormEvent, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    DollarSign,
    ShoppingCart,
    TrendingUp,
    Download,
    Filter,
} from 'lucide-react';
import {
    LineChart,
    BarChart,
    Line,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';

interface DailySale {
    date: string;
    orders: number;
    revenue: number;
}

interface Props {
    dailySales: DailySale[];
    totals: {
        revenue: number;
        orders: number;
        average_order: number;
    };
    filters: {
        date_from: string;
        date_to: string;
    };
}

export default function Sales({ dailySales, totals, filters }: Props) {
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount);

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });

    const formatChartDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
        });

    const handleFilter = (e: FormEvent) => {
        e.preventDefault();
        router.get('/admin/reports/sales', {
            date_from: dateFrom || undefined,
            date_to: dateTo || undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const chartData = dailySales.map((d) => ({
        ...d,
        label: formatChartDate(d.date),
    }));

    const statCards = [
        {
            title: 'Total Revenue',
            value: formatCurrency(totals.revenue),
            icon: DollarSign,
            color: 'bg-green-50 text-green-600',
        },
        {
            title: 'Total Orders',
            value: totals.orders.toLocaleString(),
            icon: ShoppingCart,
            color: 'bg-blue-50 text-blue-600',
        },
        {
            title: 'Avg Order Value',
            value: formatCurrency(totals.average_order),
            icon: TrendingUp,
            color: 'bg-purple-50 text-purple-600',
        },
    ];

    return (
        <AdminLayout title="Sales Reports">
            <Head title="Sales Reports" />

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

            {/* Revenue Line Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Over Time</h2>
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                            <YAxis
                                tick={{ fontSize: 12 }}
                                tickFormatter={(v) => `\u00A3${v}`}
                            />
                            <Tooltip
                                formatter={(value: any) => [formatCurrency(Number(value)), 'Revenue']}
                                labelFormatter={(label) => `Date: ${label}`}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="revenue"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                dot={{ r: 3 }}
                                activeDot={{ r: 5 }}
                                name="Revenue"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="py-12 text-center text-gray-400 text-sm">
                        No sales data for the selected period.
                    </div>
                )}
            </div>

            {/* Orders Bar Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Orders Per Day</h2>
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                            <Tooltip
                                formatter={(value: any) => [value, 'Orders']}
                                labelFormatter={(label) => `Date: ${label}`}
                            />
                            <Legend />
                            <Bar
                                dataKey="orders"
                                fill="#8b5cf6"
                                radius={[4, 4, 0, 0]}
                                name="Orders"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="py-12 text-center text-gray-400 text-sm">
                        No order data for the selected period.
                    </div>
                )}
            </div>

            {/* Daily Sales Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-900">Daily Sales Breakdown</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                                    Date
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                                    Orders
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                                    Revenue
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                                    Avg Order
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {dailySales.map((day) => (
                                <tr
                                    key={day.date}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-4 py-3 text-sm text-gray-900">
                                        {formatDate(day.date)}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-900 text-right">
                                        {day.orders}
                                    </td>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                                        {formatCurrency(day.revenue)}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500 text-right">
                                        {day.orders > 0
                                            ? formatCurrency(day.revenue / day.orders)
                                            : '-'}
                                    </td>
                                </tr>
                            ))}
                            {dailySales.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-4 py-12 text-center text-gray-400 text-sm"
                                    >
                                        No sales data found for the selected period.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                        {dailySales.length > 0 && (
                            <tfoot className="bg-gray-50 border-t border-gray-200">
                                <tr>
                                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                                        Total
                                    </td>
                                    <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">
                                        {totals.orders}
                                    </td>
                                    <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">
                                        {formatCurrency(totals.revenue)}
                                    </td>
                                    <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">
                                        {formatCurrency(totals.average_order)}
                                    </td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
