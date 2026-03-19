import { Fragment, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Dialog, Transition } from '@headlessui/react';
import AdminLayout from '@/Layouts/AdminLayout';
import StatusBadge from '@/Components/admin/StatusBadge';
import ConfirmDialog from '@/Components/admin/ConfirmDialog';
import { PaginatedData, User, SupplierCategory } from '@/types';
import { CheckCircle, XCircle, Package, Clock } from 'lucide-react';

interface PendingProduct {
    id: number;
    name: string;
    unit: string;
    pack_size: string | null;
    base_price: string;
    notes: string | null;
    created_at: string;
    user?: User;
    category?: SupplierCategory;
}

interface Props {
    products: PaginatedData<PendingProduct>;
}

export default function SupplierProductsPending({ products }: Props) {
    const [approveId, setApproveId] = useState<number | null>(null);
    const [rejectId, setRejectId] = useState<number | null>(null);
    const [rejectReason, setRejectReason] = useState('');
    const [processing, setProcessing] = useState(false);

    const handleApprove = () => {
        if (approveId === null) return;
        setProcessing(true);
        router.patch(`/admin/supplier-products/${approveId}/approve`, {}, {
            onFinish: () => {
                setProcessing(false);
                setApproveId(null);
            },
        });
    };

    const handleReject = () => {
        if (rejectId === null || !rejectReason.trim()) return;
        setProcessing(true);
        router.patch(`/admin/supplier-products/${rejectId}/reject`, {
            reason: rejectReason,
        }, {
            onFinish: () => {
                setProcessing(false);
                setRejectId(null);
                setRejectReason('');
            },
        });
    };

    return (
        <AdminLayout title="Pending Supplier Products">
            <Head title="Pending Supplier Products" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                        <Clock className="size-5 text-yellow-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Pending Approval</h2>
                        <p className="text-sm text-gray-500">
                            {products.total} product{products.total !== 1 ? 's' : ''} awaiting review
                        </p>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Product</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Supplier</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Category</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Price</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Submitted</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.data.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="size-9 rounded-lg bg-gray-100 flex items-center justify-center">
                                                <Package className="size-4 text-gray-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{product.name}</p>
                                                <p className="text-xs text-gray-400">
                                                    {product.unit}
                                                    {product.pack_size && ` / Pack: ${product.pack_size}`}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="text-sm text-gray-900">{product.user?.name || '-'}</p>
                                        <p className="text-xs text-gray-400">{product.user?.email}</p>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">
                                        {product.category?.emoji && (
                                            <span className="mr-1">{product.category.emoji}</span>
                                        )}
                                        {product.category?.name || '-'}
                                    </td>
                                    <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                                        &pound;{Number(product.base_price).toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">
                                        {new Date(product.created_at).toLocaleDateString('en-GB', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1 justify-end">
                                            <button
                                                onClick={() => setApproveId(product.id)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                                                title="Approve"
                                            >
                                                <CheckCircle className="size-3.5" />
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => setRejectId(product.id)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                                title="Reject"
                                            >
                                                <XCircle className="size-3.5" />
                                                Reject
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {products.data.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12 text-center">
                                        <CheckCircle className="size-10 text-green-300 mx-auto mb-3" />
                                        <p className="text-sm text-gray-400">All caught up! No pending products to review.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {products.last_page > 1 && (
                    <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            Showing {products.from}-{products.to} of {products.total}
                        </p>
                        <div className="flex gap-1">
                            {products.links.map((link, i) => (
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

            {/* Approve Confirmation */}
            <ConfirmDialog
                open={approveId !== null}
                onClose={() => setApproveId(null)}
                onConfirm={handleApprove}
                title="Approve Product"
                message="Are you sure you want to approve this product? It will become visible in the supplier catalogue."
                confirmText="Approve"
                variant="warning"
                loading={processing}
            />

            {/* Reject Modal with Reason */}
            <Transition appear show={rejectId !== null} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => { setRejectId(null); setRejectReason(''); }}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-200"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-150"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/40" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-200"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-150"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform rounded-xl bg-white p-6 shadow-xl transition-all">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 rounded-lg bg-red-50 text-red-600">
                                            <XCircle className="size-5" />
                                        </div>
                                        <div className="flex-1">
                                            <Dialog.Title className="text-lg font-semibold text-gray-900">
                                                Reject Product
                                            </Dialog.Title>
                                            <p className="mt-2 text-sm text-gray-600">
                                                Please provide a reason for rejecting this product. The supplier will be notified.
                                            </p>
                                            <textarea
                                                value={rejectReason}
                                                onChange={(e) => setRejectReason(e.target.value)}
                                                rows={3}
                                                placeholder="Enter rejection reason..."
                                                className="mt-3 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-6 flex gap-3 justify-end">
                                        <button
                                            onClick={() => { setRejectId(null); setRejectReason(''); }}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                            disabled={processing}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleReject}
                                            disabled={processing || !rejectReason.trim()}
                                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                                        >
                                            {processing ? 'Rejecting...' : 'Reject Product'}
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </AdminLayout>
    );
}
