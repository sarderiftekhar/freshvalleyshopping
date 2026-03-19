import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import StatusBadge from '@/Components/admin/StatusBadge';
import ConfirmDialog from '@/Components/admin/ConfirmDialog';
import { PaginatedData } from '@/types';
import { Plus, Edit, Trash2, Send, Mail } from 'lucide-react';

interface Campaign {
    id: number;
    name: string;
    subject: string;
    audience: 'all_customers' | 'subscribers';
    status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
    sent_count: number;
    total_recipients: number;
    scheduled_at: string | null;
    created_at: string;
    creator: { id: number; name: string } | null;
}

interface Props {
    campaigns: PaginatedData<Campaign>;
    filters: {
        status?: string;
    };
}

const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-600',
    scheduled: 'bg-blue-100 text-blue-700',
    sending: 'bg-yellow-100 text-yellow-700',
    sent: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700',
};

export default function CampaignsIndex({ campaigns, filters }: Props) {
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [sendId, setSendId] = useState<number | null>(null);

    const applyFilter = (key: string, value: string) => {
        router.get('/admin/marketing/campaigns', { ...filters, [key]: value || undefined }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = () => {
        if (deleteId === null) return;
        router.delete(`/admin/marketing/campaigns/${deleteId}`, {
            onSuccess: () => setDeleteId(null),
        });
    };

    const handleSend = () => {
        if (sendId === null) return;
        router.post(`/admin/marketing/campaigns/${sendId}/send`, {}, {
            onSuccess: () => setSendId(null),
        });
    };

    return (
        <AdminLayout title="Email Campaigns">
            <Head title="Email Campaigns" />

            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3 flex-wrap">
                    <select
                        value={filters.status || ''}
                        onChange={(e) => applyFilter('status', e.target.value)}
                        className="border border-gray-200 rounded-lg text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orfarm-blue/20"
                    >
                        <option value="">All Statuses</option>
                        <option value="draft">Draft</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="sending">Sending</option>
                        <option value="sent">Sent</option>
                        <option value="failed">Failed</option>
                    </select>
                </div>
                <Link
                    href="/admin/marketing/campaigns/create"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-orfarm-blue text-white rounded-lg text-sm font-medium hover:bg-orfarm-blue/90"
                >
                    <Plus className="size-4" />
                    New Campaign
                </Link>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Subject</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Audience</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Sent / Total</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Created By</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {campaigns.data.map((campaign) => (
                                <tr key={campaign.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <Mail className="size-4 text-gray-400 shrink-0" />
                                            <span className="text-sm font-medium text-gray-900">{campaign.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600 max-w-[200px] truncate">
                                        {campaign.subject}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-sm text-gray-600 capitalize">
                                            {campaign.audience.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-full capitalize ${statusColors[campaign.status] || 'bg-gray-100 text-gray-600'}`}>
                                            {campaign.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center text-sm text-gray-600">
                                        {campaign.sent_count} / {campaign.total_recipients}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">
                                        {campaign.creator?.name || '-'}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">
                                        {new Date(campaign.created_at).toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1 justify-end">
                                            <Link
                                                href={`/admin/marketing/campaigns/${campaign.id}/edit`}
                                                className="p-1.5 text-gray-400 hover:text-orfarm-blue rounded-md hover:bg-blue-50"
                                                title="Edit"
                                            >
                                                <Edit className="size-4" />
                                            </Link>
                                            {campaign.status === 'draft' && (
                                                <button
                                                    onClick={() => setSendId(campaign.id)}
                                                    className="p-1.5 text-gray-400 hover:text-green-600 rounded-md hover:bg-green-50"
                                                    title="Send"
                                                >
                                                    <Send className="size-4" />
                                                </button>
                                            )}
                                            {(campaign.status === 'draft' || campaign.status === 'scheduled') && (
                                                <button
                                                    onClick={() => setDeleteId(campaign.id)}
                                                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="size-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {campaigns.data.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-4 py-12 text-center text-gray-400 text-sm">
                                        No campaigns found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {campaigns.last_page > 1 && (
                    <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            Showing {campaigns.from}-{campaigns.to} of {campaigns.total}
                        </p>
                        <div className="flex gap-1">
                            {campaigns.links.map((link, i) => (
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

            {/* Send Confirmation */}
            <ConfirmDialog
                open={sendId !== null}
                onClose={() => setSendId(null)}
                onConfirm={handleSend}
                title="Send Campaign"
                message="Are you sure you want to send this campaign now? This action cannot be undone."
                confirmText="Send Now"
                variant="warning"
            />

            {/* Delete Confirmation */}
            <ConfirmDialog
                open={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Campaign"
                message="Are you sure you want to delete this campaign? This action cannot be undone."
                confirmText="Delete"
            />
        </AdminLayout>
    );
}
