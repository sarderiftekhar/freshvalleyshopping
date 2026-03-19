import { FormEvent, useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Product } from '@/types';

interface Props {
    products: Pick<Product, 'id' | 'title' | 'sku' | 'price'>[];
}

export default function OfferCreate({ products }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        type: 'percentage' as 'percentage' | 'fixed' | 'buy_x_get_y' | 'bundle',
        discount_value: '',
        buy_quantity: '',
        get_quantity: '',
        minimum_order: '',
        starts_at: '',
        ends_at: '',
        is_active: true,
        banner_image: null as File | null,
        product_ids: [] as number[],
    });

    const [productSearch, setProductSearch] = useState('');

    const filteredProducts = products.filter(
        (p) =>
            p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
            p.sku.toLowerCase().includes(productSearch.toLowerCase())
    );

    const toggleProduct = (id: number) => {
        setData('product_ids',
            data.product_ids.includes(id)
                ? data.product_ids.filter((x) => x !== id)
                : [...data.product_ids, id]
        );
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (key === 'product_ids') {
                (value as number[]).forEach((id, i) => formData.append(`product_ids[${i}]`, String(id)));
            } else if (key === 'banner_image' && value) {
                formData.append(key, value as File);
            } else if (typeof value === 'boolean') {
                formData.append(key, value ? '1' : '0');
            } else if (value !== null) {
                formData.append(key, String(value));
            }
        });
        router.post('/admin/offers', formData, { forceFormData: true });
    };

    const inputClass = "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orfarm-blue/20 focus:border-orfarm-blue";
    const labelClass = "block text-sm font-medium text-gray-700 mb-1";
    const errorClass = "text-xs text-red-500 mt-1";

    return (
        <AdminLayout title="Create Special Offer">
            <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Offer Details</h2>
                    <div className="space-y-4">
                        <div>
                            <label className={labelClass}>Title *</label>
                            <input type="text" value={data.title} onChange={(e) => setData('title', e.target.value)} className={inputClass} />
                            {errors.title && <p className={errorClass}>{errors.title}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Description</label>
                            <textarea value={data.description} onChange={(e) => setData('description', e.target.value)} rows={3} className={inputClass} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Offer Type *</label>
                                <select value={data.type} onChange={(e) => setData('type', e.target.value as any)} className={inputClass}>
                                    <option value="percentage">Percentage Off</option>
                                    <option value="fixed">Fixed Discount</option>
                                    <option value="buy_x_get_y">Buy X Get Y</option>
                                    <option value="bundle">Bundle Deal</option>
                                </select>
                            </div>
                            {(data.type === 'percentage' || data.type === 'fixed') && (
                                <div>
                                    <label className={labelClass}>Discount Value {data.type === 'percentage' ? '(%)' : '(\u00A3)'}</label>
                                    <input type="number" step="0.01" value={data.discount_value} onChange={(e) => setData('discount_value', e.target.value)} className={inputClass} />
                                </div>
                            )}
                            {data.type === 'buy_x_get_y' && (
                                <>
                                    <div>
                                        <label className={labelClass}>Buy Quantity</label>
                                        <input type="number" value={data.buy_quantity} onChange={(e) => setData('buy_quantity', e.target.value)} className={inputClass} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Get Quantity</label>
                                        <input type="number" value={data.get_quantity} onChange={(e) => setData('get_quantity', e.target.value)} className={inputClass} />
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Minimum Order (&pound;)</label>
                                <input type="number" step="0.01" value={data.minimum_order} onChange={(e) => setData('minimum_order', e.target.value)} className={inputClass} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Start Date *</label>
                                <input type="datetime-local" value={data.starts_at} onChange={(e) => setData('starts_at', e.target.value)} className={inputClass} />
                                {errors.starts_at && <p className={errorClass}>{errors.starts_at}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>End Date</label>
                                <input type="datetime-local" value={data.ends_at} onChange={(e) => setData('ends_at', e.target.value)} className={inputClass} />
                            </div>
                        </div>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} className="rounded border-gray-300" />
                            <span className="text-sm text-gray-600">Active</span>
                        </label>
                    </div>
                </div>

                {/* Product Selection */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Products ({data.product_ids.length} selected)</h2>
                    <input
                        type="text"
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        placeholder="Search products..."
                        className={`${inputClass} mb-3`}
                    />
                    <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg divide-y divide-gray-100">
                        {filteredProducts.slice(0, 50).map((product) => (
                            <label key={product.id} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.product_ids.includes(product.id)}
                                    onChange={() => toggleProduct(product.id)}
                                    className="rounded border-gray-300"
                                />
                                <div className="flex-1">
                                    <p className="text-sm text-gray-900">{product.title}</p>
                                    <p className="text-xs text-gray-400">{product.sku} - &pound;{product.price}</p>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="px-6 py-3 bg-orfarm-blue text-white rounded-lg font-medium hover:bg-orfarm-blue/90 disabled:opacity-50"
                >
                    {processing ? 'Creating...' : 'Create Offer'}
                </button>
            </form>
        </AdminLayout>
    );
}
