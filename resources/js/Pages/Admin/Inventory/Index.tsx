import { useState, FormEvent } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PaginatedData, Product } from '@/types';
import { AlertTriangle, Search, Minus, Plus } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface Props {
    products: PaginatedData<Pick<Product, 'id' | 'title' | 'sku'> & {
        barcode: string | null;
        quantity: number;
        low_stock_threshold: number;
        status: string;
        category: { id: number; name: string } | null;
    }>;
    filters: { search?: string; low_stock_only?: string };
    lowStockCount: number;
}

export default function InventoryIndex({ products, filters, lowStockCount }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [adjustProduct, setAdjustProduct] = useState<any>(null);
    const [adjustment, setAdjustment] = useState(0);
    const [reason, setReason] = useState('');

    const handleSearch = () => {
        router.get('/admin/inventory', { ...filters, search: search || undefined }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleAdjust = (e: FormEvent) => {
        e.preventDefault();
        if (!adjustProduct || adjustment === 0) return;
        router.post(`/admin/inventory/${adjustProduct.id}/adjust`, {
            adjustment,
            reason,
        }, {
            onSuccess: () => {
                setAdjustProduct(null);
                setAdjustment(0);
                setReason('');
            },
        });
    };

    return (
        <AdminLayout title="Inventory">
            {/* Low stock alert */}
            {lowStockCount > 0 && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-6">
                    <AlertTriangle className="size-5 text-red-500" />
                    <p className="text-sm text-red-700 font-medium">
                        {lowStockCount} product{lowStockCount > 1 ? 's are' : ' is'} below the low stock threshold
                    </p>
                    <button
                        onClick={() => router.get('/admin/inventory', { low_stock_only: '1' }, { preserveState: true })}
                        className="ml-auto text-sm text-red-600 font-medium hover:underline"
                    >
                        Show low stock only
                    </button>
                </div>
            )}

            {/* Filters */}
            <div className="flex items-center gap-3 mb-6">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Search by title or SKU..."
                        className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orfarm-blue/20"
                    />
                </div>
                {filters.low_stock_only && (
                    <button
                        onClick={() => router.get('/admin/inventory', {}, { preserveState: true })}
                        className="text-sm text-gray-500 hover:text-gray-700"
                    >
                        Clear filter
                    </button>
                )}
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Product</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">SKU</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Category</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Current Stock</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Threshold</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Status</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Adjust</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.data.map((product) => {
                            const isLow = product.quantity <= product.low_stock_threshold;
                            return (
                                <tr key={product.id} className={`hover:bg-gray-50 ${isLow ? 'bg-red-50/50' : ''}`}>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{product.title}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500">{product.sku}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500">{product.category?.name || '-'}</td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`text-sm font-bold ${isLow ? 'text-red-600' : 'text-gray-900'}`}>
                                            {product.quantity}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center text-sm text-gray-500">{product.low_stock_threshold}</td>
                                    <td className="px-4 py-3 text-center">
                                        {isLow ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                                                <AlertTriangle className="size-3" /> Low
                                            </span>
                                        ) : (
                                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">OK</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={() => setAdjustProduct(product)}
                                            className="px-3 py-1.5 bg-orfarm-blue text-white text-xs rounded-md hover:bg-orfarm-blue/90"
                                        >
                                            Adjust
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        {products.data.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-4 py-12 text-center text-gray-400 text-sm">No products with stock tracking.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Adjust Stock Modal */}
            <Transition appear show={!!adjustProduct} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setAdjustProduct(null)}>
                    <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-black/40" />
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                                <Dialog.Panel className="w-full max-w-sm bg-white rounded-xl p-6 shadow-xl">
                                    <Dialog.Title className="text-lg font-semibold text-gray-900 mb-1">
                                        Adjust Stock
                                    </Dialog.Title>
                                    <p className="text-sm text-gray-500 mb-4">{adjustProduct?.title}</p>
                                    <p className="text-sm text-gray-700 mb-4">
                                        Current: <span className="font-bold">{adjustProduct?.quantity}</span>
                                    </p>
                                    <form onSubmit={handleAdjust} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Adjustment</label>
                                            <div className="flex items-center gap-2">
                                                <button type="button" onClick={() => setAdjustment((a) => a - 1)} className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                                                    <Minus className="size-4" />
                                                </button>
                                                <input
                                                    type="number"
                                                    value={adjustment}
                                                    onChange={(e) => setAdjustment(parseInt(e.target.value) || 0)}
                                                    className="w-24 text-center px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                                />
                                                <button type="button" onClick={() => setAdjustment((a) => a + 1)} className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                                                    <Plus className="size-4" />
                                                </button>
                                            </div>
                                            {adjustProduct && (
                                                <p className="text-xs text-gray-400 mt-1">
                                                    New total: {Math.max(0, (adjustProduct?.quantity || 0) + adjustment)}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Reason (optional)</label>
                                            <input
                                                type="text"
                                                value={reason}
                                                onChange={(e) => setReason(e.target.value)}
                                                placeholder="e.g. Received shipment, damaged goods..."
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                            />
                                        </div>
                                        <div className="flex gap-3">
                                            <button type="button" onClick={() => setAdjustProduct(null)} className="flex-1 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200">
                                                Cancel
                                            </button>
                                            <button type="submit" disabled={adjustment === 0} className="flex-1 py-2 bg-orfarm-blue text-white rounded-lg text-sm font-medium hover:bg-orfarm-blue/90 disabled:opacity-50">
                                                Apply
                                            </button>
                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </AdminLayout>
    );
}
