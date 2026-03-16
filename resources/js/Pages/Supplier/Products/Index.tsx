import { Head, Link, router } from '@inertiajs/react';
import SupplierLayout from '@/Layouts/SupplierLayout';
import { Plus, Pencil, Trash2, Search, Filter, ChevronLeft, ChevronRight, ToggleLeft, ToggleRight } from 'lucide-react';
import { SupplierProduct, SupplierCategory, PaginatedData } from '@/types';
import { useState } from 'react';

interface Props {
    products: PaginatedData<SupplierProduct>;
    categories: SupplierCategory[];
    filters: { category?: string; search?: string };
}

export default function ProductsIndex({ products, categories, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/supplier/products', { search, category: filters.category }, { preserveState: true });
    };

    const handleCategoryFilter = (categoryId: string) => {
        router.get('/supplier/products', { category: categoryId || undefined, search: filters.search }, { preserveState: true });
    };

    const handleToggleActive = (product: SupplierProduct) => {
        router.patch(`/supplier/products/${product.id}/quick`, { is_active: !product.is_active }, { preserveState: true });
    };

    const handleDelete = (product: SupplierProduct) => {
        if (confirm(`Delete "${product.name}"? This cannot be undone.`)) {
            router.delete(`/supplier/products/${product.id}`);
        }
    };

    // Group products by category for display
    const grouped = products.data.reduce((acc, product) => {
        const catName = product.category?.name || 'Uncategorized';
        const catEmoji = product.category?.emoji || '📦';
        if (!acc[catName]) acc[catName] = { emoji: catEmoji, items: [] };
        acc[catName].items.push(product);
        return acc;
    }, {} as Record<string, { emoji: string; items: SupplierProduct[] }>);

    return (
        <SupplierLayout title="Product Price List">
            <Head title="Supplier Products" />

            {/* Toolbar */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                    <div className="flex gap-3 w-full sm:w-auto">
                        {/* Search */}
                        <form onSubmit={handleSearch} className="relative flex-1 sm:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orfarm-green/30 focus:border-orfarm-green"
                            />
                        </form>

                        {/* Category Filter */}
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
                            <select
                                value={filters.category || ''}
                                onChange={(e) => handleCategoryFilter(e.target.value)}
                                className="h-10 pl-10 pr-8 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orfarm-green/30 bg-white appearance-none"
                            >
                                <option value="">All Categories</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.emoji} {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <Link
                        href="/supplier/products/create"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-orfarm-green text-white text-sm font-semibold rounded-lg hover:bg-orfarm-green-dark transition-colors whitespace-nowrap"
                    >
                        <Plus className="size-4" />
                        Add Product
                    </Link>
                </div>
            </div>

            {/* Summary */}
            <div className="text-sm text-orfarm-body/60 mb-4">
                Showing {products.from}–{products.to} of {products.total} products
            </div>

            {/* Product Table grouped by category */}
            {Object.entries(grouped).map(([catName, { emoji, items }]) => (
                <div key={catName} className="bg-white rounded-xl shadow-sm overflow-hidden mb-4">
                    <div className="px-5 py-3 bg-orfarm-grey/50 border-b border-gray-100 flex items-center gap-2">
                        <span className="text-lg">{emoji}</span>
                        <h3 className="text-sm font-heading font-bold text-orfarm-blue">{catName}</h3>
                        <span className="text-xs text-orfarm-body/50 ml-1">{items.length} items</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-orfarm-body/50">
                                    <th className="px-5 py-3 font-medium">Product</th>
                                    <th className="px-5 py-3 font-medium">Unit</th>
                                    <th className="px-5 py-3 font-medium text-right">Base Price</th>
                                    <th className="px-5 py-3 font-medium text-right">Bulk Price</th>
                                    <th className="px-5 py-3 font-medium">Bulk Unit</th>
                                    <th className="px-5 py-3 font-medium text-center">Active</th>
                                    <th className="px-5 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((product) => (
                                    <tr key={product.id} className="border-b border-gray-50 hover:bg-orfarm-grey/30 transition-colors">
                                        <td className="px-5 py-3">
                                            <div>
                                                <span className="font-medium text-orfarm-blue">{product.name}</span>
                                                {product.notes && (
                                                    <p className="text-xs text-orfarm-body/50 mt-0.5">{product.notes}</p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-orfarm-body/70">{product.unit}</td>
                                        <td className="px-5 py-3 text-right font-bold text-orfarm-green">
                                            £{parseFloat(product.base_price).toFixed(2)}
                                        </td>
                                        <td className="px-5 py-3 text-right text-orfarm-body/70">
                                            {product.bulk_price ? `£${parseFloat(product.bulk_price).toFixed(2)}` : '—'}
                                        </td>
                                        <td className="px-5 py-3 text-orfarm-body/70 text-xs">{product.bulk_unit || '—'}</td>
                                        <td className="px-5 py-3 text-center">
                                            <button
                                                onClick={() => handleToggleActive(product)}
                                                className="transition-colors"
                                                title={product.is_active ? 'Active — click to deactivate' : 'Inactive — click to activate'}
                                            >
                                                {product.is_active ? (
                                                    <ToggleRight className="size-6 text-orfarm-green" />
                                                ) : (
                                                    <ToggleLeft className="size-6 text-gray-300" />
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-5 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link
                                                    href={`/supplier/products/${product.id}/edit`}
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-orfarm-body/50 hover:bg-orfarm-green/10 hover:text-orfarm-green transition-colors"
                                                >
                                                    <Pencil className="size-3.5" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product)}
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-orfarm-body/50 hover:bg-red-50 hover:text-orfarm-red transition-colors"
                                                >
                                                    <Trash2 className="size-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}

            {/* Empty State */}
            {products.data.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <Package className="size-16 text-gray-200 mx-auto mb-4" />
                    <p className="text-orfarm-body/60">No products found</p>
                    <Link
                        href="/supplier/products/create"
                        className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-orfarm-green text-white text-sm font-semibold rounded-lg hover:bg-orfarm-green-dark transition-colors"
                    >
                        <Plus className="size-4" />
                        Add First Product
                    </Link>
                </div>
            )}

            {/* Pagination */}
            {products.last_page > 1 && (
                <div className="flex items-center justify-center gap-1 mt-6">
                    {products.links.map((link, i) => (
                        <Link
                            key={i}
                            href={link.url || '#'}
                            preserveState
                            className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                                link.active
                                    ? 'bg-orfarm-blue text-white'
                                    : link.url
                                    ? 'bg-white text-orfarm-body hover:bg-orfarm-grey'
                                    : 'bg-white text-gray-300 cursor-not-allowed'
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}
        </SupplierLayout>
    );
}
