import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import SearchInput from '@/Components/admin/SearchInput';
import StatusBadge from '@/Components/admin/StatusBadge';
import { PaginatedData, User } from '@/types';
import { Plus, Eye, Truck, Package } from 'lucide-react';

interface Supplier extends User {
    supplier_products_count: number;
    created_at: string;
}

interface Props {
    suppliers: PaginatedData<Supplier>;
    filters: {
        search?: string;
    };
}

export default function SuppliersIndex({ suppliers, filters }: Props) {
    return (
        <AdminLayout title="Suppliers">
            <Head title="Suppliers" />

            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="w-72">
                    <SearchInput
                        value={filters.search || ''}
                        route="/admin/suppliers"
                        placeholder="Search suppliers..."
                    />
                </div>
                <Link
                    href="/admin/suppliers/create"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-orfarm-blue text-white rounded-lg text-sm font-medium hover:bg-orfarm-blue/90"
                >
                    <Plus className="size-4" />
                    Add Supplier
                </Link>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Supplier</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Products</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {suppliers.data.map((supplier) => (
                                <tr key={supplier.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="size-9 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm font-semibold">
                                                {supplier.name?.charAt(0)?.toUpperCase() || '?'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{supplier.name}</p>
                                                {supplier.phone && (
                                                    <p className="text-xs text-gray-400">{supplier.phone}</p>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">{supplier.email}</td>
                                    <td className="px-4 py-3 text-center">
                                        <span className="inline-flex items-center gap-1 text-sm font-medium text-gray-900">
                                            <Package className="size-3.5 text-gray-400" />
                                            {supplier.supplier_products_count}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <StatusBadge
                                            status={supplier.is_active !== false ? 'active' : 'inactive'}
                                            type="offer"
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end">
                                            <Link
                                                href={`/admin/suppliers/${supplier.id}`}
                                                className="p-1.5 text-gray-400 hover:text-blue-600 rounded-md hover:bg-blue-50"
                                                title="View Supplier"
                                            >
                                                <Eye className="size-4" />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {suppliers.data.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-12 text-center">
                                        <Truck className="size-10 text-gray-300 mx-auto mb-3" />
                                        <p className="text-sm text-gray-400">No suppliers found.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {suppliers.last_page > 1 && (
                    <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            Showing {suppliers.from}-{suppliers.to} of {suppliers.total}
                        </p>
                        <div className="flex gap-1">
                            {suppliers.links.map((link, i) => (
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
