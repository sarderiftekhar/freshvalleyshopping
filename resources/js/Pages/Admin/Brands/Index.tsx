import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Brand, PaginatedData } from '@/types';
import { Plus, Edit, Trash2, Search, ImageIcon } from 'lucide-react';

interface Props {
    brands: PaginatedData<Brand>;
    filters: { search?: string };
}

export default function BrandsIndex({ brands, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/brands', { search: search || undefined }, { preserveState: true });
    };

    const handleDelete = () => {
        if (deleteId) {
            router.delete(`/admin/brands/${deleteId}`);
            setDeleteId(null);
        }
    };

    return (
        <AdminLayout title="Brands">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">{brands.total} brand{brands.total !== 1 ? 's' : ''}</p>
                    <Link
                        href="/admin/brands/create"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-orfarm-blue text-white rounded-lg text-sm font-medium hover:bg-orfarm-blue/90 transition-colors"
                    >
                        <Plus className="size-4" /> Add Brand
                    </Link>
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className="flex gap-3">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search brands..."
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orfarm-blue/20 focus:border-orfarm-blue"
                        />
                    </div>
                    <button type="submit" className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200">
                        Search
                    </button>
                </form>

                {/* Table */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Brand</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Products</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {brands.data.map((brand) => (
                                <tr key={brand.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {brand.image ? (
                                                <img
                                                    src={`/storage/${brand.image}`}
                                                    alt={brand.name}
                                                    className="size-10 rounded-lg object-contain border border-gray-200 bg-white p-0.5"
                                                />
                                            ) : (
                                                <div className="size-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                                    <ImageIcon className="size-5 text-gray-400" />
                                                </div>
                                            )}
                                            <span className="font-medium text-gray-900">{brand.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {brand.products_count ?? 0}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            brand.is_active
                                                ? 'bg-green-50 text-green-700 border border-green-200'
                                                : 'bg-gray-100 text-gray-500 border border-gray-200'
                                        }`}>
                                            {brand.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/brands/${brand.id}/edit`}
                                                className="p-1.5 text-amber-600 bg-amber-50 border border-amber-200 hover:bg-amber-500 hover:text-white rounded-lg hover:scale-110 active:scale-95 transition-all duration-150"
                                                title="Edit"
                                            >
                                                <Edit className="size-4" strokeWidth={2} />
                                            </Link>
                                            <button
                                                onClick={() => setDeleteId(brand.id)}
                                                className="p-1.5 text-red-500 bg-red-50 border border-red-200 hover:bg-red-600 hover:text-white rounded-lg hover:scale-110 active:scale-95 transition-all duration-150"
                                                title="Delete"
                                            >
                                                <Trash2 className="size-4" strokeWidth={2} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {brands.data.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                                        No brands found. Create your first brand.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {brands.last_page > 1 && (
                    <div className="flex items-center justify-center gap-1">
                        {brands.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                className={`px-3 py-1.5 rounded-lg text-sm ${
                                    link.active
                                        ? 'bg-orfarm-blue text-white'
                                        : link.url
                                        ? 'text-gray-600 hover:bg-gray-100'
                                        : 'text-gray-300 pointer-events-none'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}

                {/* Delete Confirmation */}
                {deleteId && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Brand</h3>
                            <p className="text-sm text-gray-500 mb-6">
                                Are you sure? Products using this brand will have their brand removed.
                            </p>
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setDeleteId(null)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
