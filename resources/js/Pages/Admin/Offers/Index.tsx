import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import StatusBadge from '@/Components/admin/StatusBadge';
import ConfirmDialog from '@/Components/admin/ConfirmDialog';
import { PaginatedData } from '@/types';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';

interface Offer {
    id: number;
    title: string;
    slug: string;
    type: 'percentage' | 'fixed' | 'buy_x_get_y' | 'bundle';
    discount_value: string | null;
    starts_at: string;
    ends_at: string | null;
    is_active: boolean;
    products_count: number;
}

interface Props {
    offers: PaginatedData<Offer>;
}

export default function OffersIndex({ offers }: Props) {
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const handleDelete = () => {
        if (!deleteId) return;
        router.delete(`/admin/offers/${deleteId}`, {
            onSuccess: () => setDeleteId(null),
        });
    };

    const getOfferStatus = (offer: Offer) => {
        if (!offer.is_active) return 'inactive';
        const now = new Date();
        const start = new Date(offer.starts_at);
        if (start > now) return 'scheduled';
        if (offer.ends_at && new Date(offer.ends_at) < now) return 'expired';
        return 'active';
    };

    const formatType = (type: string) => {
        const labels: Record<string, string> = {
            percentage: 'Percentage Off',
            fixed: 'Fixed Discount',
            buy_x_get_y: 'Buy X Get Y',
            bundle: 'Bundle Deal',
        };
        return labels[type] || type;
    };

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    return (
        <AdminLayout title="Special Offers">
            <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-gray-500">{offers.total} offers</p>
                <Link
                    href="/admin/offers/create"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-orfarm-blue text-white rounded-lg text-sm font-medium hover:bg-orfarm-blue/90"
                >
                    <Plus className="size-4" />
                    Create Offer
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Offer</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Discount</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Products</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Period</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {offers.data.map((offer) => (
                                <tr key={offer.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                                                <Tag className="size-4" />
                                            </div>
                                            <span className="text-sm font-medium text-gray-900">{offer.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">{formatType(offer.type)}</td>
                                    <td className="px-4 py-3 text-center text-sm font-medium text-gray-900">
                                        {offer.type === 'percentage' && offer.discount_value ? `${offer.discount_value}%` : ''}
                                        {offer.type === 'fixed' && offer.discount_value ? `\u00A3${offer.discount_value}` : ''}
                                        {offer.type === 'buy_x_get_y' ? 'BOGO' : ''}
                                        {offer.type === 'bundle' ? 'Bundle' : ''}
                                    </td>
                                    <td className="px-4 py-3 text-center text-sm text-gray-500">{offer.products_count}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500">
                                        {formatDate(offer.starts_at)}
                                        {offer.ends_at ? ` - ${formatDate(offer.ends_at)}` : ' - No end'}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <StatusBadge status={getOfferStatus(offer)} type="offer" />
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1 justify-end">
                                            <Link href={`/admin/offers/${offer.id}/edit`} className="p-1.5 text-gray-400 hover:text-orfarm-blue rounded-md hover:bg-blue-50">
                                                <Edit className="size-4" />
                                            </Link>
                                            <button onClick={() => setDeleteId(offer.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50">
                                                <Trash2 className="size-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {offers.data.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-12 text-center text-gray-400 text-sm">No special offers yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ConfirmDialog
                open={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Offer"
                message="Are you sure you want to delete this special offer?"
                confirmText="Delete"
            />
        </AdminLayout>
    );
}
