import { Head, useForm, Link } from '@inertiajs/react';
import SupplierLayout from '@/Layouts/SupplierLayout';
import { ArrowLeft, Save } from 'lucide-react';
import { SupplierProduct, SupplierCategory } from '@/types';

interface Props {
    product: SupplierProduct;
    categories: SupplierCategory[];
}

export default function EditProduct({ product, categories }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        supplier_category_id: String(product.supplier_category_id),
        name: product.name,
        unit: product.unit,
        base_price: product.base_price,
        bulk_price: product.bulk_price || '',
        bulk_unit: product.bulk_unit || '',
        notes: product.notes || '',
        is_active: product.is_active,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/supplier/products/${product.id}`);
    };

    return (
        <SupplierLayout title={`Edit: ${product.name}`}>
            <Head title={`Edit ${product.name}`} />

            <Link
                href="/supplier/products"
                className="inline-flex items-center gap-1 text-sm text-orfarm-body/60 hover:text-orfarm-green transition-colors mb-4"
            >
                <ArrowLeft className="size-4" />
                Back to Products
            </Link>

            <div className="bg-white rounded-xl shadow-sm max-w-2xl">
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-5">
                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-orfarm-blue mb-1.5">Category *</label>
                            <select
                                value={data.supplier_category_id}
                                onChange={(e) => setData('supplier_category_id', e.target.value)}
                                className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orfarm-green/30 focus:border-orfarm-green bg-white"
                            >
                                <option value="">Select category...</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.emoji} {cat.name}
                                    </option>
                                ))}
                            </select>
                            {errors.supplier_category_id && <p className="text-xs text-orfarm-red mt-1">{errors.supplier_category_id}</p>}
                        </div>

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-orfarm-blue mb-1.5">Product Name *</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orfarm-green/30 focus:border-orfarm-green"
                            />
                            {errors.name && <p className="text-xs text-orfarm-red mt-1">{errors.name}</p>}
                        </div>

                        {/* Unit + Base Price */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-orfarm-blue mb-1.5">Unit *</label>
                                <input
                                    type="text"
                                    value={data.unit}
                                    onChange={(e) => setData('unit', e.target.value)}
                                    className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orfarm-green/30 focus:border-orfarm-green"
                                />
                                {errors.unit && <p className="text-xs text-orfarm-red mt-1">{errors.unit}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-orfarm-blue mb-1.5">Base Price (£) *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    value={data.base_price}
                                    onChange={(e) => setData('base_price', e.target.value)}
                                    className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orfarm-green/30 focus:border-orfarm-green"
                                />
                                {errors.base_price && <p className="text-xs text-orfarm-red mt-1">{errors.base_price}</p>}
                            </div>
                        </div>

                        {/* Bulk Price + Bulk Unit */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-orfarm-blue mb-1.5">Bulk Price (£)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.bulk_price}
                                    onChange={(e) => setData('bulk_price', e.target.value)}
                                    className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orfarm-green/30 focus:border-orfarm-green"
                                />
                                {errors.bulk_price && <p className="text-xs text-orfarm-red mt-1">{errors.bulk_price}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-orfarm-blue mb-1.5">Bulk Unit</label>
                                <input
                                    type="text"
                                    value={data.bulk_unit}
                                    onChange={(e) => setData('bulk_unit', e.target.value)}
                                    className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orfarm-green/30 focus:border-orfarm-green"
                                />
                                {errors.bulk_unit && <p className="text-xs text-orfarm-red mt-1">{errors.bulk_unit}</p>}
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="block text-sm font-medium text-orfarm-blue mb-1.5">Notes</label>
                            <textarea
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                rows={2}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orfarm-green/30 focus:border-orfarm-green resize-none"
                            />
                            {errors.notes && <p className="text-xs text-orfarm-red mt-1">{errors.notes}</p>}
                        </div>

                        {/* Active Toggle */}
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-orfarm-green focus:ring-orfarm-green"
                            />
                            <span className="text-sm text-orfarm-blue font-medium">Active (visible to business owners)</span>
                        </label>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 bg-orfarm-grey/30 border-t border-gray-100 flex items-center justify-end gap-3 rounded-b-xl">
                        <Link
                            href="/supplier/products"
                            className="px-4 py-2.5 text-sm font-medium text-orfarm-body/70 hover:text-orfarm-blue transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-orfarm-green text-white text-sm font-semibold rounded-lg hover:bg-orfarm-green-dark transition-colors disabled:opacity-50"
                        >
                            <Save className="size-4" />
                            {processing ? 'Saving...' : 'Update Product'}
                        </button>
                    </div>
                </form>
            </div>
        </SupplierLayout>
    );
}
