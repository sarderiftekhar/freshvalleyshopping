import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import StatusBadge from '@/Components/admin/StatusBadge';
import ConfirmDialog from '@/Components/admin/ConfirmDialog';
import { PaginatedData, Product, Category, Brand } from '@/types';
import { Plus, Download, Trash2, Edit, Eye, Package, Search, X } from 'lucide-react';

interface Props {
    products: PaginatedData<Product & { order_items_count: number }>;
    categories: Pick<Category, 'id' | 'name'>[];
    brands: Pick<Brand, 'id' | 'name'>[];
    filters: {
        search?: string;
        category_id?: string;
        brand_id?: string;
        status?: string;
        stock?: string;
        featured?: string;
        price_min?: string;
        price_max?: string;
    };
}

export default function ProductsIndex({ products, categories, brands, filters }: Props) {
    const [selected, setSelected] = useState<number[]>([]);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [viewProduct, setViewProduct] = useState<(Product & { order_items_count: number }) | null>(null);
    const [search, setSearch] = useState(filters.search || '');
    const [priceMin, setPriceMin] = useState(filters.price_min || '');
    const [priceMax, setPriceMax] = useState(filters.price_max || '');

    const hasActiveFilters = filters.category_id || filters.brand_id || filters.status || filters.stock || filters.featured || filters.price_min || filters.price_max || filters.search;

    const toggleSelect = (id: number) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const toggleAll = () => {
        if (selected.length === products.data.length) {
            setSelected([]);
        } else {
            setSelected(products.data.map((p) => p.id));
        }
    };

    const applyFilter = (key: string, value: string) => {
        router.get('/admin/products', { ...filters, [key]: value || undefined }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSearch = () => {
        router.get('/admin/products', { ...filters, search: search || undefined }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const applyPriceFilter = () => {
        router.get('/admin/products', {
            ...filters,
            price_min: priceMin || undefined,
            price_max: priceMax || undefined,
        }, { preserveState: true, preserveScroll: true });
    };

    const clearFilters = () => {
        setSearch('');
        setPriceMin('');
        setPriceMax('');
        router.get('/admin/products', { reset: '1' });
    };

    const handleBulkAction = (action: string) => {
        if (selected.length === 0) return;
        router.post('/admin/products/bulk-action', {
            action,
            product_ids: selected,
        }, {
            onSuccess: () => setSelected([]),
        });
    };

    const handleDelete = () => {
        if (deleteId === null) return;
        router.delete(`/admin/products/${deleteId}`, {
            onSuccess: () => setDeleteId(null),
        });
    };

    const selectClass = "bg-white border border-gray-300 rounded-xl text-sm py-2.5 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orfarm-blue/30 focus:border-orfarm-blue shadow-sm appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:14px] bg-[right_12px_center] bg-no-repeat pr-10";

    return (
        <AdminLayout title="Products">
            {/* Toolbar Row 1: Search + Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div className="relative flex-1 min-w-[200px] max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Search products by name, SKU..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orfarm-blue/30 focus:border-orfarm-blue shadow-sm"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <a
                        href="/admin/products-export"
                        className="inline-flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        <Download className="size-4" />
                        Export
                    </a>
                    <Link
                        href="/admin/products/create"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-orfarm-blue text-white rounded-lg text-sm font-medium hover:bg-orfarm-blue/90"
                    >
                        <Plus className="size-4" />
                        Add Product
                    </Link>
                </div>
            </div>

            {/* Toolbar Row 2: Filters */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-semibold text-gray-500 uppercase">Category</label>
                    <select value={filters.category_id || ''} onChange={(e) => applyFilter('category_id', e.target.value)} className={selectClass + ' w-full'}>
                        <option value="">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-semibold text-gray-500 uppercase">Brand</label>
                    <select value={filters.brand_id || ''} onChange={(e) => applyFilter('brand_id', e.target.value)} className={selectClass + ' w-full'}>
                        <option value="">All Brands</option>
                        {brands.map((b) => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-semibold text-gray-500 uppercase">Status</label>
                    <select value={filters.status || ''} onChange={(e) => applyFilter('status', e.target.value)} className={selectClass + ' w-full'}>
                        <option value="">All Statuses</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="out_of_stock">Out of Stock</option>
                    </select>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-semibold text-gray-500 uppercase">Stock</label>
                    <select value={filters.stock || ''} onChange={(e) => applyFilter('stock', e.target.value)} className={selectClass + ' w-full'}>
                        <option value="">All Stock</option>
                        <option value="in_stock">In Stock</option>
                        <option value="low_stock">Low Stock</option>
                        <option value="out_of_stock">Out of Stock</option>
                    </select>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-semibold text-gray-500 uppercase">Featured</label>
                    <select value={filters.featured || ''} onChange={(e) => applyFilter('featured', e.target.value)} className={selectClass + ' w-full'}>
                        <option value="">All</option>
                        <option value="1">Featured Only</option>
                    </select>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-semibold text-gray-500 uppercase">Price Range</label>
                    <div className="flex items-center gap-1.5">
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={priceMin}
                            onChange={(e) => setPriceMin(e.target.value)}
                            onBlur={applyPriceFilter}
                            onKeyDown={(e) => e.key === 'Enter' && applyPriceFilter()}
                            placeholder="Min"
                            className="w-full bg-white border border-gray-300 rounded-lg text-sm py-2.5 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orfarm-blue/30 focus:border-orfarm-blue shadow-sm"
                        />
                        <span className="text-gray-400 text-xs shrink-0">to</span>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={priceMax}
                            onChange={(e) => setPriceMax(e.target.value)}
                            onBlur={applyPriceFilter}
                            onKeyDown={(e) => e.key === 'Enter' && applyPriceFilter()}
                            placeholder="Max"
                            className="w-full bg-white border border-gray-300 rounded-lg text-sm py-2.5 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orfarm-blue/30 focus:border-orfarm-blue shadow-sm"
                        />
                    </div>
                </div>
                {hasActiveFilters ? (
                    <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-semibold text-transparent uppercase">Clear</label>
                        <button
                            onClick={clearFilters}
                            className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-colors"
                        >
                            <X className="size-3.5" />
                            Clear All
                        </button>
                    </div>
                ) : <div />}
            </div>

            {/* Bulk Actions */}
            {selected.length > 0 && (
                <div className="flex items-center gap-3 mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <span className="text-sm font-medium text-blue-700">{selected.length} selected</span>
                    <button onClick={() => handleBulkAction('publish')} className="text-xs px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700">Publish</button>
                    <button onClick={() => handleBulkAction('draft')} className="text-xs px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700">Draft</button>
                    <button onClick={() => handleBulkAction('delete')} className="text-xs px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700">Delete</button>
                    <button onClick={() => setSelected([])} className="text-xs text-blue-600 hover:underline ml-auto">Clear</button>
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="w-10 px-4 py-3">
                                    <input type="checkbox" checked={selected.length === products.data.length && products.data.length > 0} onChange={toggleAll} className="rounded border-gray-300" />
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Product</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">SKU</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Unit / Weight</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Category</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Brand</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Price</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Stock</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Sold</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Orders</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.data.map((product) => {
                                const isLowStock = product.quantity <= ((product as any).low_stock_threshold || 10);
                                const hasDiscount = product.sale_price && Number(product.sale_price) < Number(product.price);
                                const discountPct = hasDiscount
                                    ? Math.round(((Number(product.price) - Number(product.sale_price)) / Number(product.price)) * 100)
                                    : 0;

                                return (
                                <tr key={product.id} className="group hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3">
                                        <input type="checkbox" checked={selected.includes(product.id)} onChange={() => toggleSelect(product.id)} className="rounded border-gray-300" />
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            {product.primary_image ? (
                                                <img src={product.primary_image.path.startsWith('/') ? product.primary_image.path : `/storage/${product.primary_image.path}`} alt="" className="size-10 rounded-lg object-cover border" />
                                            ) : (
                                                <div className="size-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                                    <Package className="size-5 text-gray-400" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 line-clamp-1">{product.title}</p>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    {product.is_featured && (
                                                        <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold bg-orange-100 text-orange-700 rounded">FEATURED</span>
                                                    )}
                                                    {product.is_halal_certified && (
                                                        <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-700 rounded">HALAL</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-sm text-gray-800 font-mono">{product.sku}</span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <div className="text-sm text-gray-800">
                                            <span>{product.unit || '-'}</span>
                                            {(product as any).weight > 0 && (
                                                <p className="text-xs text-gray-700 font-medium mt-0.5">{(product as any).weight}{(product as any).weight_unit || 'g'}</p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-sm text-gray-800">{product.category?.name || '-'}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        {product.brand ? (
                                            <div className="flex flex-col items-center gap-1">
                                                {product.brand.image && (
                                                    <img
                                                        src={`/storage/${product.brand.image}`}
                                                        alt={product.brand.name}
                                                        className="h-6 max-w-[48px] object-contain"
                                                    />
                                                )}
                                                <span className="text-xs font-medium text-blue-700">{product.brand.name}</span>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-gray-500">-</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        {hasDiscount ? (
                                            <>
                                                <p className="text-xs text-gray-500 line-through">&pound;{product.price}</p>
                                                <p className="text-sm font-semibold text-green-600">&pound;{product.sale_price}</p>
                                                <span className="text-[10px] font-medium text-white bg-red-500 px-1.5 py-0.5 rounded-full">-{discountPct}%</span>
                                            </>
                                        ) : (
                                            <p className="text-sm font-medium text-gray-900">&pound;{product.price}</p>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        {product.quantity === 0 ? (
                                            <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-700 rounded-full">Out</span>
                                        ) : isLowStock ? (
                                            <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold bg-amber-100 text-amber-700 rounded-full">{product.quantity}</span>
                                        ) : (
                                            <span className="text-sm font-medium text-gray-900">{product.quantity}</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className="text-sm font-medium text-gray-800">{product.sold || 0}</span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className="text-sm font-medium text-gray-800">{product.order_items_count || 0}</span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <StatusBadge status={product.status} type="product" />
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1 justify-end">
                                            <button onClick={() => setViewProduct(product)} className="p-1.5 text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-600 hover:text-white rounded-lg hover:scale-110 active:scale-95 transition-all duration-150" title="View">
                                                <Eye className="size-4" strokeWidth={2} />
                                            </button>
                                            <Link href={`/admin/products/${product.id}/edit`} className="p-1.5 text-amber-600 bg-amber-50 border border-amber-200 hover:bg-amber-500 hover:text-white rounded-lg hover:scale-110 active:scale-95 transition-all duration-150" title="Edit">
                                                <Edit className="size-4" strokeWidth={2} />
                                            </Link>
                                            <button onClick={() => setDeleteId(product.id)} className="p-1.5 text-red-500 bg-red-50 border border-red-200 hover:bg-red-600 hover:text-white rounded-lg hover:scale-110 active:scale-95 transition-all duration-150" title="Delete">
                                                <Trash2 className="size-4" strokeWidth={2} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                );
                            })}
                            {products.data.length === 0 && (
                                <tr>
                                    <td colSpan={12} className="px-4 py-12 text-center text-gray-400 text-sm">
                                        No products found.
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

            <ConfirmDialog
                open={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Product"
                message="Are you sure you want to delete this product? This action cannot be undone."
                confirmText="Delete"
            />

            {/* Product View Modal */}
            {viewProduct && (() => {
                const p = viewProduct;
                const imgSrc = (path: string) => path.startsWith('/') ? path : `/storage/${path}`;
                const hasDisc = p.sale_price && Number(p.sale_price) < Number(p.price);
                const discPct = hasDisc ? Math.round(((Number(p.price) - Number(p.sale_price)) / Number(p.price)) * 100) : 0;

                return (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setViewProduct(null)}>
                        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-5 border-b border-gray-200">
                                <h2 className="text-lg font-bold text-gray-900">Product Details</h2>
                                <div className="flex items-center gap-2">
                                    <Link href={`/admin/products/${p.id}/edit`} className="px-3 py-1.5 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100">
                                        <Edit className="size-3.5 inline mr-1" />Edit
                                    </Link>
                                    <button onClick={() => setViewProduct(null)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                                        <X className="size-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Product Image + Title */}
                            <div className="p-5">
                                <div className="flex gap-5">
                                    {/* Images */}
                                    <div className="shrink-0">
                                        {p.primary_image ? (
                                            <img src={imgSrc(p.primary_image.path)} alt="" className="size-28 rounded-xl object-cover border border-gray-200" />
                                        ) : (
                                            <div className="size-28 rounded-xl bg-gray-100 flex items-center justify-center">
                                                <Package className="size-10 text-gray-300" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Title + Badges */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-xl font-bold text-gray-900 leading-tight">{p.title}</h3>
                                        <p className="text-sm text-gray-500 font-mono mt-1">SKU: {p.sku}</p>
                                        <div className="flex flex-wrap items-center gap-2 mt-3">
                                            <StatusBadge status={p.status} type="product" />
                                            {p.is_featured && <span className="px-2 py-0.5 text-[11px] font-semibold bg-orange-100 text-orange-700 rounded-full">FEATURED</span>}
                                            {p.is_halal_certified && <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-100 text-emerald-700 rounded-full">HALAL</span>}
                                        </div>
                                        {/* Pricing */}
                                        <div className="flex items-baseline gap-2 mt-3">
                                            {hasDisc ? (
                                                <>
                                                    <span className="text-2xl font-bold text-green-600">&pound;{p.sale_price}</span>
                                                    <span className="text-base text-gray-400 line-through">&pound;{p.price}</span>
                                                    <span className="text-xs font-semibold text-white bg-red-500 px-2 py-0.5 rounded-full">-{discPct}%</span>
                                                </>
                                            ) : (
                                                <span className="text-2xl font-bold text-gray-900">&pound;{p.price}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Detail Grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                                    <DetailItem label="Category" value={p.category?.name || '-'} />
                                    <DetailItem label="Brand" value={p.brand?.name || '-'} />
                                    <DetailItem label="Unit" value={p.unit || '-'} />
                                    <DetailItem label="Weight" value={(p as any).weight ? `${(p as any).weight}${(p as any).weight_unit || 'g'}` : '-'} />
                                    <DetailItem label="Stock" value={String(p.quantity)} highlight={p.quantity === 0 ? 'red' : p.quantity <= ((p as any).low_stock_threshold || 10) ? 'amber' : undefined} />
                                    <DetailItem label="Sold" value={String(p.sold || 0)} />
                                    <DetailItem label="Orders" value={String(p.order_items_count || 0)} />
                                    <DetailItem label="Cost Price" value={(p as any).cost_price ? `£${(p as any).cost_price}` : '-'} />
                                    <DetailItem label="Barcode" value={(p as any).barcode || '-'} />
                                </div>

                                {/* Tags */}
                                {p.tags && p.tags.length > 0 && (
                                    <div className="mt-5">
                                        <p className="text-[11px] font-semibold text-gray-500 uppercase mb-1.5">Tags</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {p.tags.map((tag, i) => (
                                                <span key={i} className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Description */}
                                {p.description && (
                                    <div className="mt-5">
                                        <p className="text-[11px] font-semibold text-gray-500 uppercase mb-1.5">Description</p>
                                        <p className="text-sm text-gray-700 leading-relaxed line-clamp-6">{p.description}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })()}
        </AdminLayout>
    );
}

function DetailItem({ label, value, highlight }: { label: string; value: string; highlight?: 'red' | 'amber' }) {
    const valueColor = highlight === 'red' ? 'text-red-600 font-bold' : highlight === 'amber' ? 'text-amber-600 font-bold' : 'text-gray-900';
    return (
        <div className="bg-gray-50 rounded-lg px-3 py-2.5">
            <p className="text-[11px] font-semibold text-gray-500 uppercase">{label}</p>
            <p className={`text-sm font-medium mt-0.5 ${valueColor}`}>{value}</p>
        </div>
    );
}
