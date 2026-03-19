import { FormEvent, useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Brand } from '@/types';
import { Upload, X } from 'lucide-react';

interface Props {
    brand: Brand;
}

export default function BrandEdit({ brand }: Props) {
    const { data, setData, processing, errors } = useForm({
        name: brand.name,
        image: null as File | null,
        remove_image: false,
        is_active: brand.is_active,
        sort_order: String(brand.sort_order),
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('name', data.name);
        formData.append('is_active', data.is_active ? '1' : '0');
        formData.append('sort_order', data.sort_order);
        formData.append('remove_image', data.remove_image ? '1' : '0');
        if (data.image) formData.append('image', data.image);

        router.post(`/admin/brands/${brand.id}`, formData, { forceFormData: true });
    };

    const hasImage = imagePreview || (brand.image && !data.remove_image);

    const inputClass = "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orfarm-blue/20 focus:border-orfarm-blue";
    const labelClass = "block text-sm font-medium text-gray-700 mb-1";
    const errorClass = "text-xs text-red-500 mt-1";

    return (
        <AdminLayout title={`Edit: ${brand.name}`}>
            <form onSubmit={handleSubmit} className="max-w-2xl">
                <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
                    <h2 className="text-lg font-semibold text-green-700 mb-4">Brand Details</h2>

                    <div>
                        <label className={labelClass}>Name *</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className={inputClass}
                        />
                        {errors.name && <p className={errorClass}>{errors.name}</p>}
                    </div>

                    <div>
                        <label className={labelClass}>Brand Logo / Image</label>
                        <div className="flex items-center gap-4">
                            {hasImage && (
                                <div className="relative group">
                                    <img
                                        src={imagePreview || `/storage/${brand.image}`}
                                        alt={brand.name}
                                        className="h-20 w-20 rounded-xl object-contain border border-gray-200 bg-white p-1"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (imagePreview) {
                                                setImagePreview(null);
                                                setData('image', null as any);
                                            } else {
                                                setData('remove_image', true);
                                            }
                                        }}
                                        className="absolute -top-1.5 -right-1.5 p-0.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="size-3" />
                                    </button>
                                </div>
                            )}
                            <label className="inline-flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-orfarm-blue hover:text-orfarm-blue transition-colors cursor-pointer">
                                <Upload className="size-5" />
                                {hasImage ? 'Replace Image' : 'Upload Logo'}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setData('image', file as any);
                                            setData('remove_image', false);
                                            const reader = new FileReader();
                                            reader.onload = (ev) => setImagePreview(ev.target?.result as string);
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />
                            </label>
                        </div>
                        {errors.image && <p className={errorClass}>{errors.image}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Sort Order</label>
                            <input
                                type="number"
                                value={data.sort_order}
                                onChange={(e) => setData('sort_order', e.target.value)}
                                className={inputClass}
                                min="0"
                            />
                        </div>
                        <div className="flex items-end pb-1">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="rounded border-gray-300"
                                />
                                <span className="text-sm text-gray-600">Active</span>
                            </label>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3 bg-orfarm-blue text-white rounded-lg font-medium hover:bg-orfarm-blue/90 disabled:opacity-50 transition-colors"
                        >
                            {processing ? 'Saving...' : 'Update Brand'}
                        </button>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
