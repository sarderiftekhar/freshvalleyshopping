import { useState, useRef, FormEvent } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import SearchInput from '@/Components/admin/SearchInput';
import StatCard from '@/Components/admin/StatCard';
import ConfirmDialog from '@/Components/admin/ConfirmDialog';
import { PaginatedData } from '@/types';
import { Users, UserCheck, UserX, Download, Upload, Trash2, Bell } from 'lucide-react';

interface Subscriber {
    id: number;
    email: string;
    name: string | null;
    status: 'subscribed' | 'unsubscribed';
    created_at: string;
}

interface Props {
    subscribers: PaginatedData<Subscriber>;
    counts: {
        total: number;
        subscribed: number;
        unsubscribed: number;
    };
    filters: {
        search?: string;
        status?: string;
    };
}

export default function SubscribersIndex({ subscribers, counts, filters }: Props) {
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [importing, setImporting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const applyFilter = (key: string, value: string) => {
        router.get('/admin/marketing/subscribers', { ...filters, [key]: value || undefined }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = () => {
        if (deleteId === null) return;
        router.delete(`/admin/marketing/subscribers/${deleteId}`, {
            onSuccess: () => setDeleteId(null),
        });
    };

    const handleImport = (e: FormEvent<HTMLInputElement>) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setImporting(true);
        router.post('/admin/marketing/subscribers/import', formData, {
            forceFormData: true,
            onFinish: () => {
                setImporting(false);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            },
        });
    };

    return (
        <AdminLayout title="Subscribers">
            <Head title="Subscribers" />

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <StatCard title="Total Subscribers" value={counts.total} icon={Users} color="blue" />
                <StatCard title="Subscribed" value={counts.subscribed} icon={UserCheck} color="green" />
                <StatCard title="Unsubscribed" value={counts.unsubscribed} icon={UserX} color="red" />
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3 flex-wrap">
                    <div className="w-64">
                        <SearchInput
                            value={filters.search || ''}
                            route="/admin/marketing/subscribers"
                            placeholder="Search by email or name..."
                            params={{ status: filters.status }}
                        />
                    </div>
                    <select
                        value={filters.status || ''}
                        onChange={(e) => applyFilter('status', e.target.value)}
                        className="border border-gray-200 rounded-lg text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orfarm-blue/20"
                    >
                        <option value="">All Statuses</option>
                        <option value="subscribed">Subscribed</option>
                        <option value="unsubscribed">Unsubscribed</option>
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv"
                        onChange={handleImport}
                        className="hidden"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={importing}
                        className="inline-flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                        <Upload className="size-4" />
                        {importing ? 'Importing...' : 'Import CSV'}
                    </button>
                    <a
                        href="/admin/marketing/subscribers/export"
                        className="inline-flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        <Download className="size-4" />
                        Export
                    </a>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Subscribed Date</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {subscribers.data.map((subscriber) => (
                                <tr key={subscriber.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <Bell className="size-4 text-gray-400 shrink-0" />
                                            <span className="text-sm font-medium text-gray-900">{subscriber.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        {subscriber.name || '-'}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-full capitalize ${
                                            subscriber.status === 'subscribed'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {subscriber.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">
                                        {new Date(subscriber.created_at).toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1 justify-end">
                                            <button
                                                onClick={() => setDeleteId(subscriber.id)}
                                                className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50"
                                                title="Delete"
                                            >
                                                <Trash2 className="size-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {subscribers.data.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-12 text-center text-gray-400 text-sm">
                                        No subscribers found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {subscribers.last_page > 1 && (
                    <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            Showing {subscribers.from}-{subscribers.to} of {subscribers.total}
                        </p>
                        <div className="flex gap-1">
                            {subscribers.links.map((link, i) => (
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

            <ConfirmDialog
                open={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Subscriber"
                message="Are you sure you want to delete this subscriber? This action cannot be undone."
                confirmText="Delete"
            />
        </AdminLayout>
    );
}
