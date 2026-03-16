import { Head, Link, router } from '@inertiajs/react';
import SupplierLayout from '@/Layouts/SupplierLayout';
import { Plus, Trash2, Search, Filter, Check, X, Pencil, ToggleLeft, ToggleRight, Package, Copy, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { SupplierProduct, SupplierCategory, PaginatedData } from '@/types';
import { useState, useRef, useEffect } from 'react';

function UnitComboBox({ value, onChange, options, placeholder, className }: {
    value: string;
    onChange: (val: string) => void;
    options: string[];
    placeholder?: string;
    className?: string;
}) {
    const [open, setOpen] = useState(false);
    const [filter, setFilter] = useState('');
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const filtered = options.filter((o) => o.toLowerCase().includes(filter.toLowerCase()));

    return (
        <div ref={wrapperRef} className="relative">
            <div className="flex">
                <input
                    ref={inputRef}
                    type="text"
                    value={open ? filter : value}
                    onChange={(e) => {
                        setFilter(e.target.value);
                        onChange(e.target.value);
                        if (!open) setOpen(true);
                    }}
                    onFocus={() => { setFilter(''); setOpen(true); }}
                    placeholder={placeholder}
                    className={className}
                />
                <button
                    type="button"
                    onClick={() => { setOpen(!open); if (!open) { setFilter(''); inputRef.current?.focus(); } }}
                    className="absolute right-0 top-0 bottom-0 w-9 flex items-center justify-center text-gray-600 hover:text-gray-800"
                    tabIndex={-1}
                >
                    <ChevronDown className="size-4" />
                </button>
            </div>
            {open && filtered.length > 0 && (
                <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                    {filtered.map((opt) => (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => { onChange(opt); setOpen(false); setFilter(''); }}
                            className={`w-full text-left px-3 py-2 text-sm hover:bg-orfarm-green/10 transition-colors ${opt === value ? 'bg-orfarm-green/10 font-semibold text-orfarm-green' : 'text-gray-700'}`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

interface Props {
    products: PaginatedData<SupplierProduct>;
    categories: SupplierCategory[];
    filters: { category?: string; search?: string };
}

export default function ProductsIndex({ products, categories, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);

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
                        <form onSubmit={handleSearch} className="relative flex-1 sm:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orfarm-green/30 focus:border-orfarm-green"
                            />
                        </form>
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500 pointer-events-none" />
                            <select
                                value={filters.category || ''}
                                onChange={(e) => handleCategoryFilter(e.target.value)}
                                className="h-10 pl-10 pr-8 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orfarm-green/30 bg-white appearance-none"
                            >
                                <option value="">All Categories</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.emoji} {cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-orfarm-green text-white text-sm font-semibold rounded-lg hover:bg-orfarm-green-dark transition-colors whitespace-nowrap"
                    >
                        <Plus className="size-4" />
                        Add Products
                    </button>
                </div>
            </div>

            <p className="text-xs text-orfarm-body/80 mb-4">
                Click <Pencil className="size-3 inline" /> to edit inline. Press <kbd className="px-1 py-0.5 bg-gray-100 rounded text-[10px] font-mono">Enter</kbd> to save, <kbd className="px-1 py-0.5 bg-gray-100 rounded text-[10px] font-mono">Esc</kbd> to cancel.
            </p>

            {/* Product Tables grouped by category */}
            {Object.entries(grouped).map(([catName, { emoji, items }]) => (
                <div key={catName} className="bg-white rounded-xl shadow-sm overflow-hidden mb-4">
                    <div className="px-5 py-3 bg-orfarm-grey/50 border-b border-gray-100 flex items-center gap-2">
                        <span className="text-lg">{emoji}</span>
                        <h3 className="text-sm font-heading font-bold text-orfarm-blue">{catName}</h3>
                        <span className="text-xs text-orfarm-body/80 ml-1">{items.length} items</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-base">
                            <thead>
                                <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wide text-gray-700 bg-gray-50/80">
                                    <th className="px-5 py-3.5 font-semibold">Product</th>
                                    <th className="px-5 py-3.5 font-semibold">Unit</th>
                                    <th className="px-5 py-3.5 font-semibold text-right">Base Price</th>
                                    <th className="px-5 py-3.5 font-semibold">Bulk Offer</th>
                                    <th className="px-5 py-3.5 font-semibold">Notes</th>
                                    <th className="px-5 py-3.5 font-semibold text-center w-16">Active</th>
                                    <th className="px-5 py-3.5 font-semibold text-right w-24">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((product) =>
                                    editingId === product.id ? (
                                        <InlineEditRow
                                            key={product.id}
                                            product={product}
                                            onCancel={() => setEditingId(null)}
                                            onSaved={() => setEditingId(null)}
                                        />
                                    ) : (
                                        <tr
                                            key={product.id}
                                            className="border-b border-gray-100 hover:bg-orfarm-grey/40 transition-colors group cursor-pointer"
                                            onDoubleClick={() => setEditingId(product.id)}
                                        >
                                            <td className="px-5 py-3.5">
                                                <span className="font-semibold text-gray-900">{product.name}</span>
                                            </td>
                                            <td className="px-5 py-3.5 text-gray-700 font-medium">
                                                {product.pack_size ? (
                                                    <span>{product.pack_size} {product.unit}</span>
                                                ) : product.unit}
                                            </td>
                                            <td className="px-5 py-3.5 text-right">
                                                <span className="font-bold text-orfarm-green text-lg">£{parseFloat(product.base_price).toFixed(2)}</span>
                                                {product.pack_size && (
                                                    <span className="text-xs font-normal text-gray-600 ml-1">/ {product.pack_size} {product.unit}</span>
                                                )}
                                            </td>
                                            <td className="px-5 py-3.5">
                                                {product.bulk_price ? (
                                                    <span>
                                                        <span className="font-bold text-gray-800">£{parseFloat(product.bulk_price).toFixed(2)}</span>
                                                        {product.bulk_qty && <span className="text-gray-700 text-sm"> / {product.bulk_qty} {product.bulk_unit || product.unit}</span>}
                                                        {!product.bulk_qty && product.bulk_unit && <span className="text-gray-700 text-sm"> per {product.bulk_unit}</span>}
                                                    </span>
                                                ) : <span className="text-gray-400">—</span>}
                                            </td>
                                            <td className="px-5 py-3.5 text-gray-700 text-sm truncate max-w-[200px]" title={product.notes || ''}>
                                                {product.notes || <span className="text-gray-400">—</span>}
                                            </td>
                                            <td className="px-5 py-3.5 text-center">
                                                <button onClick={() => handleToggleActive(product)} title={product.is_active ? 'Deactivate' : 'Activate'}>
                                                    {product.is_active ? <ToggleRight className="size-7 text-orfarm-green" /> : <ToggleLeft className="size-7 text-gray-400" />}
                                                </button>
                                            </td>
                                            <td className="px-5 py-3.5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => setEditingId(product.id)}
                                                        className="w-9 h-9 rounded-lg flex items-center justify-center bg-orfarm-green/10 text-orfarm-green hover:bg-orfarm-green hover:text-white hover:scale-110 hover:shadow-md transition-all duration-200"
                                                        title="Edit inline"
                                                    >
                                                        <Pencil className="size-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product)}
                                                        className="w-9 h-9 rounded-lg flex items-center justify-center bg-red-50 text-red-500 hover:bg-orfarm-red hover:text-white hover:scale-110 hover:shadow-md transition-all duration-200"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}

            {products.data.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <Package className="size-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-orfarm-body/80">No products found</p>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-orfarm-green text-white text-sm font-semibold rounded-lg hover:bg-orfarm-green-dark transition-colors"
                    >
                        <Plus className="size-4" /> Add First Product
                    </button>
                </div>
            )}

            {/* Pagination */}
            {products.total > 0 && (
                <div className="bg-white rounded-xl shadow-sm px-5 py-4 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Info */}
                    <p className="text-sm text-gray-600">
                        Showing <span className="font-semibold text-gray-900">{products.from}</span>–<span className="font-semibold text-gray-900">{products.to}</span> of{' '}
                        <span className="font-semibold text-gray-900">{products.total}</span> products
                        <span className="text-gray-400 mx-2">|</span>
                        Page <span className="font-semibold text-gray-900">{products.current_page}</span> of <span className="font-semibold text-gray-900">{products.last_page}</span>
                    </p>

                    {/* Page controls */}
                    {products.last_page > 1 && (
                        <div className="flex items-center gap-1">
                            {/* First page */}
                            <Link
                                href={products.links[0]?.url || '#'}
                                preserveState
                                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                                    products.current_page === 1
                                        ? 'text-gray-300 cursor-not-allowed pointer-events-none'
                                        : 'text-gray-600 hover:bg-orfarm-green/10 hover:text-orfarm-green'
                                }`}
                                title="First page"
                            >
                                <ChevronsLeft className="size-4" />
                            </Link>

                            {/* Previous */}
                            <Link
                                href={products.links[0]?.url || '#'}
                                preserveState
                                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                                    products.current_page === 1
                                        ? 'text-gray-300 cursor-not-allowed pointer-events-none'
                                        : 'text-gray-600 hover:bg-orfarm-green/10 hover:text-orfarm-green'
                                }`}
                                title="Previous page"
                            >
                                <ChevronLeft className="size-4" />
                            </Link>

                            {/* Page numbers */}
                            {products.links.slice(1, -1).map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url || '#'}
                                    preserveState
                                    className={`min-w-[36px] h-9 px-2 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                                        link.active
                                            ? 'bg-orfarm-green text-white shadow-md shadow-orfarm-green/25'
                                            : link.url
                                                ? 'text-gray-600 hover:bg-orfarm-green/10 hover:text-orfarm-green'
                                                : 'text-gray-300 cursor-not-allowed pointer-events-none'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}

                            {/* Next */}
                            <Link
                                href={products.links[products.links.length - 1]?.url || '#'}
                                preserveState
                                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                                    products.current_page === products.last_page
                                        ? 'text-gray-300 cursor-not-allowed pointer-events-none'
                                        : 'text-gray-600 hover:bg-orfarm-green/10 hover:text-orfarm-green'
                                }`}
                                title="Next page"
                            >
                                <ChevronRight className="size-4" />
                            </Link>

                            {/* Last page */}
                            <Link
                                href={products.links[products.links.length - 1]?.url || '#'}
                                preserveState
                                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                                    products.current_page === products.last_page
                                        ? 'text-gray-300 cursor-not-allowed pointer-events-none'
                                        : 'text-gray-600 hover:bg-orfarm-green/10 hover:text-orfarm-green'
                                }`}
                                title="Last page"
                            >
                                <ChevronsRight className="size-4" />
                            </Link>
                        </div>
                    )}
                </div>
            )}
            {showAddModal && (
                <AddProductsModal
                    categories={categories}
                    onClose={() => setShowAddModal(false)}
                />
            )}
        </SupplierLayout>
    );
}

function InlineEditRow({
    product,
    onCancel,
    onSaved,
}: {
    product: SupplierProduct;
    onCancel: () => void;
    onSaved: () => void;
}) {
    const [form, setForm] = useState({
        name: product.name,
        unit: product.unit,
        pack_size: product.pack_size || '',
        base_price: product.base_price,
        bulk_price: product.bulk_price || '',
        bulk_qty: product.bulk_qty?.toString() || '',
        bulk_unit: product.bulk_unit || '',
        notes: product.notes || '',
    });
    const [saving, setSaving] = useState(false);
    const nameRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        nameRef.current?.select();
    }, []);

    const handleSave = () => {
        setSaving(true);
        router.patch(`/supplier/products/${product.id}/quick`, {
            ...form,
            pack_size: form.pack_size || null,
            bulk_price: form.bulk_price || null,
            bulk_qty: form.bulk_qty ? parseInt(form.bulk_qty) : null,
            bulk_unit: form.bulk_unit || null,
            notes: form.notes || null,
        }, {
            preserveState: true,
            onSuccess: () => onSaved(),
            onError: () => setSaving(false),
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') { e.preventDefault(); handleSave(); }
        if (e.key === 'Escape') onCancel();
    };

    const cls = 'h-8 px-2 rounded border border-orfarm-green/40 text-sm focus:outline-none focus:ring-2 focus:ring-orfarm-green/30 bg-white';

    return (
        <tr className="border-b border-orfarm-green/20 bg-orfarm-green/5" onKeyDown={handleKeyDown}>
            <td className="px-4 py-1.5">
                <input ref={nameRef} type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={cls + ' w-full'} />
            </td>
            <td className="px-4 py-1.5">
                <div className="flex items-center gap-1">
                    <input type="text" value={form.pack_size} onChange={(e) => setForm({ ...form, pack_size: e.target.value })} className={cls + ' w-16'} placeholder="5kg" />
                    <UnitComboBox value={form.unit} onChange={(val) => setForm({ ...form, unit: val })} options={UNIT_OPTIONS} className={cls + ' w-20 pr-7'} />
                </div>
            </td>
            <td className="px-4 py-1.5">
                <input type="number" step="0.01" min="0.01" value={form.base_price} onChange={(e) => setForm({ ...form, base_price: e.target.value })} className={cls + ' w-24 text-right font-bold'} />
            </td>
            <td className="px-4 py-1.5">
                <div className="flex items-center gap-1">
                    <input type="number" step="0.01" min="0" value={form.bulk_price} onChange={(e) => setForm({ ...form, bulk_price: e.target.value })} className={cls + ' w-20 text-right'} placeholder="£" />
                    <span className="text-xs text-gray-600">/</span>
                    <input type="number" min="1" step="1" value={form.bulk_qty} onChange={(e) => setForm({ ...form, bulk_qty: e.target.value })} className={cls + ' w-14 text-center'} placeholder="qty" />
                    <UnitComboBox value={form.bulk_unit} onChange={(val) => setForm({ ...form, bulk_unit: val })} options={UNIT_OPTIONS} placeholder="unit" className={cls + ' w-20 pr-7 text-xs'} />
                </div>
            </td>
            <td className="px-4 py-1.5">
                <input type="text" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className={cls + ' w-full'} placeholder="—" />
            </td>
            <td className="px-4 py-1.5 text-center">
                {product.is_active ? <ToggleRight className="size-6 text-orfarm-green mx-auto" /> : <ToggleLeft className="size-6 text-gray-400 mx-auto" />}
            </td>
            <td className="px-4 py-1.5 text-right">
                <div className="flex items-center justify-end gap-1">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-8 h-8 rounded-lg flex items-center justify-center bg-orfarm-green text-white hover:bg-orfarm-green-dark transition-colors disabled:opacity-50"
                        title="Save (Enter)"
                    >
                        <Check className="size-4" />
                    </button>
                    <button
                        onClick={onCancel}
                        className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors"
                        title="Cancel (Esc)"
                    >
                        <X className="size-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
}

interface ProductRow {
    name: string;
    unit: string;
    pack_size: string;
    base_price: string;
    bulk_price: string;
    bulk_qty: string;
    bulk_unit: string;
    notes: string;
}

const UNIT_OPTIONS = ['kg', 'g', 'lb', 'stone', 'piece', 'pack', 'bunch', 'litre', 'ml', 'dozen', 'box', 'bag', 'tin', 'bottle', 'jar'];

const emptyRow = (): ProductRow => ({
    name: '',
    unit: 'kg',
    pack_size: '',
    base_price: '',
    bulk_price: '',
    bulk_qty: '',
    bulk_unit: '',
    notes: '',
});

function AddProductsModal({
    categories,
    onClose,
}: {
    categories: SupplierCategory[];
    onClose: () => void;
}) {
    const [categoryId, setCategoryId] = useState<string>(categories[0]?.id?.toString() || '');
    const [rows, setRows] = useState<ProductRow[]>([emptyRow()]);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const backdropRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, []);

    const updateRow = (index: number, field: keyof ProductRow, value: string) => {
        setRows((prev) => prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)));
    };

    const addRow = () => setRows((prev) => [...prev, emptyRow()]);

    const removeRow = (index: number) => {
        if (rows.length <= 1) return;
        setRows((prev) => prev.filter((_, i) => i !== index));
    };

    const duplicateRow = (index: number) => {
        setRows((prev) => {
            const copy = [...prev];
            copy.splice(index + 1, 0, { ...prev[index] });
            return copy;
        });
    };

    const handleSave = () => {
        const filledRows = rows.filter((r) => r.name.trim() && r.base_price);
        if (filledRows.length === 0) {
            setErrors({ general: 'Add at least one product with a name and price.' });
            return;
        }
        if (!categoryId) {
            setErrors({ general: 'Please select a category.' });
            return;
        }

        setSaving(true);
        setErrors({});

        router.post('/supplier/products/batch', {
            products: filledRows.map((r) => ({
                supplier_category_id: categoryId,
                name: r.name.trim(),
                unit: r.unit.trim() || 'kg',
                pack_size: r.pack_size.trim() || null,
                base_price: parseFloat(r.base_price),
                bulk_price: r.bulk_price ? parseFloat(r.bulk_price) : null,
                bulk_qty: r.bulk_qty ? parseInt(r.bulk_qty) : null,
                bulk_unit: r.bulk_unit.trim() || null,
                notes: r.notes.trim() || null,
            })),
        }, {
            preserveState: false,
            onSuccess: () => onClose(),
            onError: (errs) => {
                setSaving(false);
                setErrors(errs as Record<string, string>);
            },
        });
    };

    const cls = 'h-12 px-3.5 rounded-xl border border-gray-300 text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-orfarm-green/40 focus:border-orfarm-green bg-white shadow-sm';

    return (
        <div
            ref={backdropRef}
            onClick={(e) => e.target === backdropRef.current && onClose()}
            className="fixed inset-0 z-50 flex items-start justify-center pt-[3vh] bg-black/50 backdrop-blur-sm overflow-y-auto"
        >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl mx-4 mb-8 animate-[slideUp_0.25s_ease-out]">
                {/* Header */}
                <div className="px-8 py-6 bg-gradient-to-r from-orfarm-blue to-orfarm-blue/90 rounded-t-2xl flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-heading font-bold text-white tracking-tight">Add New Products</h2>
                        <p className="text-sm text-white/85 mt-1">Add multiple products at once. Empty rows will be skipped automatically.</p>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-xl flex items-center justify-center text-white/80 hover:bg-white/10 hover:text-white transition-colors">
                        <X className="size-6" />
                    </button>
                </div>

                {/* Category Selector */}
                <div className="px-8 py-5 bg-gradient-to-r from-orfarm-grey/60 to-orfarm-grey/30 border-b border-gray-100">
                    <label className="flex items-center gap-4">
                        <span className="text-base font-bold text-orfarm-blue uppercase tracking-wide">Category:</span>
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="h-12 px-5 pr-12 rounded-xl border border-gray-300 text-base font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-orfarm-green/30 bg-white appearance-none flex-1 max-w-md shadow-sm"
                        >
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.emoji} {cat.name}</option>
                            ))}
                        </select>
                    </label>
                </div>

                {/* Product Rows */}
                <div className="px-8 py-5 max-h-[55vh] overflow-y-auto">
                    {errors.general && (
                        <p className="text-sm text-orfarm-red mb-4 bg-red-50 px-4 py-2 rounded-lg">{errors.general}</p>
                    )}

                    {rows.map((row, i) => (
                        <div key={i} className="mb-5 rounded-xl border border-gray-200 bg-white shadow-sm p-5 group hover:border-orfarm-green/40 hover:shadow-md transition-all">
                            {/* Row number badge + Name + Actions */}
                            <div className="flex items-start gap-3 mb-4">
                                <span className="mt-8 w-8 h-8 rounded-full bg-orfarm-blue text-white text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                                <div className="flex-1">
                                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 block">Product Name <span className="text-orfarm-red">*</span></label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Basmati Rice Premium 5kg"
                                        value={row.name}
                                        onChange={(e) => updateRow(i, 'name', e.target.value)}
                                        className="w-full h-12 px-4 rounded-xl border border-gray-300 text-base font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-orfarm-green/40 focus:border-orfarm-green bg-white placeholder:text-gray-400 shadow-sm"
                                        autoFocus={i === 0}
                                    />
                                </div>
                                <div className="flex items-center gap-2 mt-8">
                                    <button
                                        type="button"
                                        onClick={() => duplicateRow(i)}
                                        className="w-10 h-10 rounded-xl flex items-center justify-center bg-orfarm-green/15 text-orfarm-green hover:bg-orfarm-green hover:text-white transition-all shadow-sm"
                                        title="Duplicate this product"
                                    >
                                        <Copy className="size-5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => removeRow(i)}
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm ${rows.length <= 1 ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : 'bg-red-100 text-red-600 hover:bg-orfarm-red hover:text-white'}`}
                                        title="Remove this product"
                                        disabled={rows.length <= 1}
                                    >
                                        <Trash2 className="size-5" />
                                    </button>
                                </div>
                            </div>
                            {/* Fields row */}
                            <div className="grid grid-cols-6 gap-3 ml-11">
                                <div>
                                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 block">Unit <span className="text-orfarm-red">*</span></label>
                                    <UnitComboBox
                                        value={row.unit}
                                        onChange={(val) => updateRow(i, 'unit', val)}
                                        options={UNIT_OPTIONS}
                                        placeholder="kg, bag, pack..."
                                        className={cls + ' w-full font-medium pr-9'}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 block">Pack Size</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 5kg, 10kg"
                                        value={row.pack_size}
                                        onChange={(e) => updateRow(i, 'pack_size', e.target.value)}
                                        className={cls + ' w-full font-medium'}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 block">Price <span className="text-orfarm-red">*</span></label>
                                    <div className="relative">
                                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-semibold">£</span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0.01"
                                            placeholder="0.00"
                                            value={row.base_price}
                                            onChange={(e) => updateRow(i, 'base_price', e.target.value)}
                                            className={cls + ' w-full text-right font-bold pl-8'}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 block">Bulk Price</label>
                                    <div className="relative">
                                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-semibold">£</span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            placeholder="—"
                                            value={row.bulk_price}
                                            onChange={(e) => updateRow(i, 'bulk_price', e.target.value)}
                                            className={cls + ' w-full text-right pl-8'}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 block">Min Qty</label>
                                    <input
                                        type="number"
                                        min="1"
                                        step="1"
                                        placeholder="e.g. 10"
                                        value={row.bulk_qty}
                                        onChange={(e) => updateRow(i, 'bulk_qty', e.target.value)}
                                        className={cls + ' w-full text-center font-medium'}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 block">Bulk Unit</label>
                                    <UnitComboBox
                                        value={row.bulk_unit}
                                        onChange={(val) => updateRow(i, 'bulk_unit', val)}
                                        options={UNIT_OPTIONS}
                                        placeholder="kg, bag..."
                                        className={cls + ' w-full font-medium pr-9'}
                                    />
                                </div>
                            </div>
                            {/* Notes - full width row */}
                            <div className="mt-3 ml-11">
                                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 block">Notes</label>
                                <textarea
                                    rows={2}
                                    placeholder="Optional notes, description, or details..."
                                    value={row.notes}
                                    onChange={(e) => updateRow(i, 'notes', e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-orfarm-green/40 focus:border-orfarm-green bg-white shadow-sm resize-y"
                                />
                            </div>
                            {/* Per-row errors */}
                            {errors[`products.${i}.name`] && (
                                <p className="text-xs text-orfarm-red mt-2 ml-11 font-medium">{errors[`products.${i}.name`]}</p>
                            )}
                            {errors[`products.${i}.base_price`] && (
                                <p className="text-xs text-orfarm-red mt-1 ml-11 font-medium">{errors[`products.${i}.base_price`]}</p>
                            )}
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addRow}
                        className="inline-flex items-center gap-2 mt-1 px-5 py-3 text-sm text-orfarm-green hover:bg-orfarm-green/10 rounded-xl transition-colors font-bold border-2 border-dashed border-orfarm-green/30 hover:border-orfarm-green/50 w-full justify-center"
                    >
                        <Plus className="size-5" />
                        Add Another Product
                    </button>
                </div>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-gray-100 bg-gradient-to-r from-orfarm-grey/40 to-orfarm-grey/20 rounded-b-2xl flex items-center justify-between">
                    <p className="text-sm text-orfarm-body/80 font-medium">
                        <span className="text-orfarm-green font-bold">{rows.filter((r) => r.name.trim() && r.base_price).length}</span> of {rows.length} products ready
                    </p>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="px-5 py-2.5 text-sm font-semibold text-orfarm-body/80 hover:bg-gray-200 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="inline-flex items-center gap-2 px-7 py-3 bg-orfarm-green text-white text-sm font-bold rounded-xl hover:bg-orfarm-green-dark transition-all disabled:opacity-50 shadow-lg shadow-orfarm-green/25"
                        >
                            {saving ? (
                                <>
                                    <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Check className="size-5" />
                                    Save All Products
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
