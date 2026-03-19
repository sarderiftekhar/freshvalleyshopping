import { FormEvent, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { AlertTriangle, Filter } from 'lucide-react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';

interface TopProduct {
    id: number;
    title: string;
    sku: string;
    quantity_sold: number;
    revenue: number;
}

interface CategoryBreakdown {
    name: string;
    count: number;
    revenue: number;
}

interface LowStockProduct {
    id: number;
    title: string;
    sku: string;
    quantity: number;
    low_stock_threshold: number;
}

interface Props {
    topProducts: TopProduct[];
    categoryBreakdown: CategoryBreakdown[];
    lowStock: LowStockProduct[];
    filters: {
        date_from: string;
        date_to: string;
    };
}

const CHART_COLORS = [
    '#3b82f6', '#8b5cf6', '#ef4444', '#f59e0b', '#10b981',
    '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1',
    '#14b8a6', '#e11d48', '#a855f7', '#0ea5e9', '#22c55e',
];

export default function Products({ topProducts, categoryBreakdown, lowStock, filters }: Props) {
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount);

    const handleFilter = (e: FormEvent) => {
        e.preventDefault();
        router.get('/admin/reports/products', {
            date_from: dateFrom || undefined,
            date_to: dateTo || undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const pieData = categoryBreakdown.map((cat) => ({
        name: cat.name,
        value: cat.revenue,
    }));

    return (
        <AdminLayout title="Product Reports">
            <Head title="Product Reports" />

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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Top 20 Products Table */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden lg:col-span-1">
                    <div className="px-5 py-4 border-b border-gray-100">
                        <h2 className="font-semibold text-gray-900">Top 20 Products</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                                        #
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                                        Product
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                                        Qty Sold
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                                        Revenue
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {topProducts.map((product, index) => (
                                    <tr
                                        key={product.id}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-4 py-3 text-sm text-gray-400">
                                            {index + 1}
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-sm font-medium text-gray-900 line-clamp-1">
                                                {product.title}
                                            </p>
                                            <p className="text-xs text-gray-400">{product.sku}</p>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900 text-right">
                                            {product.quantity_sold}
                                        </td>
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                                            {formatCurrency(product.revenue)}
                                        </td>
                                    </tr>
                                ))}
                                {topProducts.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-4 py-12 text-center text-gray-400 text-sm"
                                        >
                                            No product data available.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Category Breakdown Pie Chart */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 lg:col-span-1">
                    <h2 className="font-semibold text-gray-900 mb-4">
                        Revenue by Category
                    </h2>
                    {pieData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={380}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={120}
                                    dataKey="value"
                                    label={({ name, percent }: any) =>
                                        `${name ?? ''} (${((percent ?? 0) * 100).toFixed(0)}%)`
                                    }
                                    labelLine
                                >
                                    {pieData.map((_, index) => (
                                        <Cell
                                            key={index}
                                            fill={CHART_COLORS[index % CHART_COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: any) => formatCurrency(Number(value))}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="py-12 text-center text-gray-400 text-sm">
                            No category data available.
                        </div>
                    )}
                </div>
            </div>

            {/* Low Stock Alert Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                    <AlertTriangle className="size-5 text-amber-500" />
                    <h2 className="font-semibold text-gray-900">Low Stock Alerts</h2>
                    {lowStock.length > 0 && (
                        <span className="ml-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                            {lowStock.length} items
                        </span>
                    )}
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                                    Product
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                                    SKU
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                                    Current Stock
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                                    Threshold
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {lowStock.map((product) => (
                                <tr
                                    key={product.id}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                        {product.title}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">
                                        {product.sku}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-center">
                                        <span
                                            className={`font-semibold ${
                                                product.quantity === 0
                                                    ? 'text-red-600'
                                                    : 'text-amber-600'
                                            }`}
                                        >
                                            {product.quantity}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500 text-center">
                                        {product.low_stock_threshold}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span
                                            className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
                                                product.quantity === 0
                                                    ? 'bg-red-100 text-red-700'
                                                    : 'bg-amber-100 text-amber-700'
                                            }`}
                                        >
                                            {product.quantity === 0 ? 'Out of Stock' : 'Low Stock'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {lowStock.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-4 py-12 text-center text-gray-400 text-sm"
                                    >
                                        All products are well stocked.
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
