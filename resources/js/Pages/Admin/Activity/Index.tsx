import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PaginatedData, ActivityLog } from '@/types';
import {
    Search,
    Filter,
    Clock,
    User,
    Globe,
    Activity,
} from 'lucide-react';

interface Props {
    logs: PaginatedData<ActivityLog>;
    filters: {
        search?: string;
        user_id?: string;
        date_from?: string;
        date_to?: string;
    };
}

const actionColors: Record<string, string> = {
    created: 'bg-green-100 text-green-700 border-green-200',
    updated: 'bg-blue-100 text-blue-700 border-blue-200',
    deleted: 'bg-red-100 text-red-700 border-red-200',
    login: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    logout: 'bg-gray-100 text-gray-700 border-gray-200',
};

function getActionColor(action: string): string {
    const key = Object.keys(actionColors).find((k) =>
        action.toLowerCase().includes(k)
    );
    return key ? actionColors[key] : 'bg-gray-100 text-gray-700 border-gray-200';
}

export default function ActivityIndex({ logs, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');

    const handleFilter = () => {
        router.get(
            '/admin/activity',
            {
                search: search || undefined,
                user_id: filters.user_id || undefined,
                date_from: dateFrom || undefined,
                date_to: dateTo || undefined,
            },
            { preserveState: true, preserveScroll: true }
        );
    };

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

    const getSubjectLabel = (log: ActivityLog) => {
        if (!log.subject_type) return null;
        const type = log.subject_type.split('\\').pop() || log.subject_type;
        return `${type} #${log.subject_id}`;
    };

    return (
        <AdminLayout title="Activity Log">
            <Head title="Activity Log" />

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
                <div className="flex flex-wrap items-end gap-4">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Search
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                                placeholder="Search actions..."
                                className="w-full pl-3 pr-10 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orfarm-blue/20 focus:border-orfarm-blue"
                            />
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                        </div>
                    </div>
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
                        onClick={handleFilter}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-orfarm-blue text-white rounded-lg text-sm font-medium hover:bg-orfarm-blue/90 transition-colors"
                    >
                        <Filter className="size-4" />
                        Apply
                    </button>
                </div>
            </div>

            {/* Activity Timeline */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                    <Activity className="size-5 text-gray-400" />
                    <h2 className="font-semibold text-gray-900">Activity Timeline</h2>
                    {logs.total > 0 && (
                        <span className="ml-auto text-sm text-gray-400">
                            {logs.total} entries
                        </span>
                    )}
                </div>

                <div className="divide-y divide-gray-100">
                    {logs.data.map((log) => (
                        <div
                            key={log.id}
                            className="px-5 py-4 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-start gap-4">
                                {/* Timeline dot */}
                                <div className="mt-1 flex-shrink-0">
                                    <div
                                        className={`size-3 rounded-full border-2 ${getActionColor(
                                            log.action
                                        )}`}
                                    />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                        <span
                                            className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${getActionColor(
                                                log.action
                                            )}`}
                                        >
                                            {log.action}
                                        </span>
                                        {getSubjectLabel(log) && (
                                            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
                                                {getSubjectLabel(log)}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                        {/* User */}
                                        <div className="flex items-center gap-1.5">
                                            <User className="size-3.5" />
                                            <span>
                                                {log.user?.name || 'System'}
                                            </span>
                                        </div>

                                        {/* IP Address */}
                                        {log.ip_address && (
                                            <div className="flex items-center gap-1.5">
                                                <Globe className="size-3.5" />
                                                <span className="font-mono text-xs">
                                                    {log.ip_address}
                                                </span>
                                            </div>
                                        )}

                                        {/* Date */}
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="size-3.5" />
                                            <span>{formatDate(log.created_at)}</span>
                                        </div>
                                    </div>

                                    {/* Properties */}
                                    {log.properties &&
                                        Object.keys(log.properties).length > 0 && (
                                            <details className="mt-2">
                                                <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">
                                                    View details
                                                </summary>
                                                <pre className="mt-1 p-2 bg-gray-50 rounded text-xs text-gray-600 overflow-x-auto">
                                                    {JSON.stringify(log.properties, null, 2)}
                                                </pre>
                                            </details>
                                        )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {logs.data.length === 0 && (
                        <div className="px-5 py-12 text-center text-gray-400 text-sm">
                            No activity logs found.
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {logs.last_page > 1 && (
                    <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            Showing {logs.from}-{logs.to} of {logs.total}
                        </p>
                        <div className="flex gap-1">
                            {logs.links.map((link, i) => (
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
