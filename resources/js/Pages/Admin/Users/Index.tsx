import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { PaginatedData, User } from '@/types';
import { Plus, Edit, Search, UserCog } from 'lucide-react';

interface Props {
    users: PaginatedData<
        User & {
            orders_count?: number;
        }
    >;
    filters: {
        search?: string;
        role?: string;
    };
}

const roleBadgeColors: Record<string, string> = {
    customer: 'bg-gray-100 text-gray-700',
    supplier: 'bg-blue-100 text-blue-700',
    editor: 'bg-indigo-100 text-indigo-700',
    admin: 'bg-purple-100 text-purple-700',
    super_admin: 'bg-red-100 text-red-700',
};

export default function UsersIndex({ users, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const applyFilter = (key: string, value: string) => {
        router.get(
            '/admin/users',
            { ...filters, [key]: value || undefined },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleSearch = () => {
        router.get(
            '/admin/users',
            { ...filters, search: search || undefined },
            { preserveState: true, preserveScroll: true }
        );
    };

    const formatDate = (dateStr: string | undefined) => {
        if (!dateStr) return 'Never';
        return new Date(dateStr).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AdminLayout title="User Management">
            <Head title="User Management" />

            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3 flex-wrap">
                    <div className="relative">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="Search by name or email..."
                            className="w-72 pl-3 pr-10 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orfarm-blue/20 focus:border-orfarm-blue"
                        />
                        <button
                            onClick={handleSearch}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-orfarm-blue"
                        >
                            <Search className="size-4" />
                        </button>
                    </div>
                    <select
                        value={filters.role || ''}
                        onChange={(e) => applyFilter('role', e.target.value)}
                        className="border border-gray-200 rounded-lg text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orfarm-blue/20"
                    >
                        <option value="">All Roles</option>
                        <option value="customer">Customer</option>
                        <option value="supplier">Supplier</option>
                        <option value="editor">Editor</option>
                        <option value="admin">Admin</option>
                        <option value="super_admin">Super Admin</option>
                    </select>
                </div>
                <Link
                    href="/admin/users/create"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-orfarm-blue text-white rounded-lg text-sm font-medium hover:bg-orfarm-blue/90 transition-colors"
                >
                    <Plus className="size-4" />
                    Add User
                </Link>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                                    Name
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                                    Email
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                                    Role
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                                    Last Login
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.data.map((user) => (
                                <tr
                                    key={user.id}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-full bg-orfarm-blue/10 text-orfarm-blue flex items-center justify-center text-sm font-medium">
                                                {user.name?.charAt(0)?.toUpperCase() || '?'}
                                            </div>
                                            <span className="text-sm font-medium text-gray-900">
                                                {user.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">
                                        {user.email}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span
                                            className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-full capitalize ${
                                                roleBadgeColors[user.role || 'customer'] ||
                                                'bg-gray-100 text-gray-700'
                                            }`}
                                        >
                                            {(user.role || 'customer').replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span
                                            className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-full ${
                                                user.is_active !== false
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                            }`}
                                        >
                                            {user.is_active !== false ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">
                                        {formatDate(user.last_login_at)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1 justify-end">
                                            <Link
                                                href={`/admin/users/${user.id}/edit`}
                                                className="p-1.5 text-gray-400 hover:text-orfarm-blue rounded-md hover:bg-blue-50"
                                                title="Edit"
                                            >
                                                <Edit className="size-4" />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {users.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-4 py-12 text-center text-gray-400 text-sm"
                                    >
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {users.last_page > 1 && (
                    <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            Showing {users.from}-{users.to} of {users.total}
                        </p>
                        <div className="flex gap-1">
                            {users.links.map((link, i) => (
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
