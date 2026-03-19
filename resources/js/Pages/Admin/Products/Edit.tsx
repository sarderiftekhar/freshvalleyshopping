import { FormEvent, useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import axios from 'axios';
import AdminLayout from '@/Layouts/AdminLayout';
import { Brand, Category, Product, ProductImage } from '@/types';
import { Upload, X, RefreshCw } from 'lucide-react';

interface Props {
    product: Product & { variants?: any[] };
    categories: Pick<Category, 'id' | 'name' | 'parent_id'>[];
    brands: Pick<Brand, 'id' | 'name'>[];
}

export default function ProductEdit({ product, categories, brands }: Props) {
    const { data, setData, processing, errors } = useForm({
        title: product.title,
        sku: product.sku,
        barcode: (product as any).barcode || '',
        price: product.price,
        sale_price: product.sale_price || '',
        cost_price: (product as any).cost_price || '',
        category_id: String(product.category_id),
        brand_id: String(product.brand_id || ''),
        quantity: String(product.quantity),
        low_stock_threshold: String((product as any).low_stock_threshold || 10),
        track_stock: (product as any).track_stock ?? true,
        unit: product.unit,
        weight: (product as any).weight || '',
        weight_unit: (product as any).weight_unit || 'kg',
        expiry_date: (product as any).expiry_date ? (product as any).expiry_date.split('T')[0] : '',
        description: product.description,
        tags: product.tags || [],
        is_halal_certified: product.is_halal_certified,
        halal_certification_body: product.halal_certification_body || '',
        status: product.status,
        is_featured: product.is_featured,
        images: [] as File[],
        remove_images: [] as number[],
        barcode_image: null as File | null,
        remove_barcode_image: false,
    });

    const [barcodePreview, setBarcodePreview] = useState<string | null>(null);
    const [tagInput, setTagInput] = useState('');
    const [newImagePreview, setNewImagePreview] = useState<string[]>([]);
    const [skuGenerating, setSkuGenerating] = useState(false);

    const generateSku = () => {
        if (!data.title.trim()) return;
        setSkuGenerating(true);
        axios.post('/admin/products/generate-sku', { title: data.title })
            .then((res) => setData('sku', res.data.sku))
            .catch(() => {})
            .finally(() => setSkuGenerating(false));
    };

    const existingImages = (product.images || []).filter(
        (img) => !data.remove_images.includes(img.id)
    );

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('_method', 'PUT');

        Object.entries(data).forEach(([key, value]) => {
            if (key === 'images') {
                (value as File[]).forEach((file, i) => {
                    formData.append(`images[${i}]`, file);
                });
            } else if (key === 'tags') {
                (value as string[]).forEach((tag, i) => {
                    formData.append(`tags[${i}]`, tag);
                });
            } else if (key === 'remove_images') {
                (value as number[]).forEach((id, i) => {
                    formData.append(`remove_images[${i}]`, String(id));
                });
            } else if (key === 'barcode_image') {
                if (value instanceof File) {
                    formData.append('barcode_image', value);
                }
            } else if (typeof value === 'boolean') {
                formData.append(key, value ? '1' : '0');
            } else {
                formData.append(key, String(value ?? ''));
            }
        });

        router.post(`/admin/products/${product.id}`, formData, {
            forceFormData: true,
        });
    };

    const addTag = () => {
        const tag = tagInput.trim();
        if (tag && !data.tags.includes(tag)) {
            setData('tags', [...data.tags, tag]);
            setTagInput('');
        }
    };

    const removeTag = (tag: string) => {
        setData('tags', data.tags.filter((t) => t !== tag));
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setData('images', [...data.images, ...files]);
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setNewImagePreview((prev) => [...prev, ev.target?.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const markImageForRemoval = (imageId: number) => {
        setData('remove_images', [...data.remove_images, imageId]);
    };

    const removeNewImage = (index: number) => {
        setData('images', data.images.filter((_, i) => i !== index));
        setNewImagePreview((prev) => prev.filter((_, i) => i !== index));
    };

    const inputClass = "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orfarm-blue/20 focus:border-orfarm-blue";
    const labelClass = "block text-sm font-medium text-gray-700 mb-1";
    const errorClass = "text-xs text-red-500 mt-1";

    return (
        <AdminLayout title={`Edit: ${product.title}`}>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                    {/* Main Content - spans 3 cols */}
                    <div className="xl:col-span-3 space-y-6">
                        {/* Basic Info */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-green-700 mb-4">Basic Information</h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div className="lg:col-span-2">
                                    <label className={labelClass}>Title *</label>
                                    <input type="text" value={data.title} onChange={(e) => setData('title', e.target.value)} className={inputClass} />
                                    {errors.title && <p className={errorClass}>{errors.title}</p>}
                                </div>
                                <div>
                                    <label className={labelClass}>SKU *</label>
                                    <div className="relative">
                                        <input type="text" value={data.sku} onChange={(e) => setData('sku', e.target.value)} className={`${inputClass} pr-10`} />
                                        <button
                                            type="button"
                                            onClick={generateSku}
                                            disabled={skuGenerating || !data.title.trim()}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-orfarm-blue disabled:opacity-30 transition-colors"
                                            title="Regenerate SKU"
                                        >
                                            <RefreshCw className={`size-4 ${skuGenerating ? 'animate-spin' : ''}`} />
                                        </button>
                                    </div>
                                    {errors.sku && <p className={errorClass}>{errors.sku}</p>}
                                </div>
                                <div>
                                    <label className={labelClass}>Barcode</label>
                                    <input type="text" value={data.barcode} onChange={(e) => setData('barcode', e.target.value)} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Brand</label>
                                    <select value={data.brand_id} onChange={(e) => setData('brand_id', e.target.value)} className={inputClass}>
                                        <option value="">No brand</option>
                                        {brands.map((b) => (
                                            <option key={b.id} value={b.id}>{b.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Category *</label>
                                    <select value={data.category_id} onChange={(e) => setData('category_id', e.target.value)} className={inputClass}>
                                        <option value="">Select category</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    {errors.category_id && <p className={errorClass}>{errors.category_id}</p>}
                                </div>
                                {/* Barcode Image */}
                                <div className="lg:col-span-2">
                                    <label className={labelClass}>Barcode Image</label>
                                    <div className="flex items-center gap-4">
                                        {(barcodePreview || ((product as any).barcode_image && !data.remove_barcode_image)) && (
                                            <div className="relative group">
                                                <img
                                                    src={barcodePreview || `/storage/${(product as any).barcode_image}`}
                                                    alt="Barcode"
                                                    className="h-16 rounded-lg border border-gray-200 object-contain bg-white px-2"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (barcodePreview) {
                                                            setBarcodePreview(null);
                                                            setData('barcode_image', null as any);
                                                        } else {
                                                            setData('remove_barcode_image', true);
                                                        }
                                                    }}
                                                    className="absolute -top-1.5 -right-1.5 p-0.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="size-3" />
                                                </button>
                                            </div>
                                        )}
                                        <label className="inline-flex items-center gap-2 px-3 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-orfarm-blue hover:text-orfarm-blue transition-colors">
                                            <Upload className="size-4" />
                                            {(barcodePreview || ((product as any).barcode_image && !data.remove_barcode_image)) ? 'Replace' : 'Upload Barcode'}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        setData('barcode_image', file as any);
                                                        setData('remove_barcode_image', false);
                                                        const reader = new FileReader();
                                                        reader.onload = (ev) => setBarcodePreview(ev.target?.result as string);
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                            />
                                        </label>
                                    </div>
                                    {errors.barcode_image && <p className={errorClass}>{errors.barcode_image}</p>}
                                </div>
                                <div className="lg:col-span-2">
                                    <label className={labelClass}>Description *</label>
                                    <textarea value={data.description} onChange={(e) => setData('description', e.target.value)} rows={4} className={inputClass} />
                                    {errors.description && <p className={errorClass}>{errors.description}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Pricing & Inventory - side by side */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-green-700 mb-4">Pricing</h2>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className={labelClass}>Price (&pound;) *</label>
                                        <input type="number" step="0.01" value={data.price} onChange={(e) => setData('price', e.target.value)} className={inputClass} />
                                        {errors.price && <p className={errorClass}>{errors.price}</p>}
                                    </div>
                                    <div>
                                        <label className={labelClass}>Sale Price (&pound;)</label>
                                        <input type="number" step="0.01" value={data.sale_price} onChange={(e) => setData('sale_price', e.target.value)} className={inputClass} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Cost Price (&pound;)</label>
                                        <input type="number" step="0.01" value={data.cost_price} onChange={(e) => setData('cost_price', e.target.value)} className={inputClass} />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-green-700 mb-4">Inventory</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>Quantity *</label>
                                        <input type="number" value={data.quantity} onChange={(e) => setData('quantity', e.target.value)} className={inputClass} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Low Stock Alert</label>
                                        <input type="number" value={data.low_stock_threshold} onChange={(e) => setData('low_stock_threshold', e.target.value)} className={inputClass} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Sold By *</label>
                                        <select value={data.unit} onChange={(e) => setData('unit', e.target.value)} className={inputClass}>
                                            <option value="each">Per Piece (each)</option>
                                            <option value="kg">Per Kilogram (kg)</option>
                                            <option value="500g">Per 500g</option>
                                            <option value="250g">Per 250g</option>
                                            <option value="100g">Per 100g</option>
                                            <option value="lb">Per Pound (lb)</option>
                                            <option value="pack">Per Pack</option>
                                            <option value="box">Per Box</option>
                                            <option value="dozen">Per Dozen (12)</option>
                                            <option value="half_dozen">Per Half Dozen (6)</option>
                                            <option value="bunch">Per Bunch</option>
                                            <option value="bag">Per Bag</option>
                                            <option value="tray">Per Tray</option>
                                            <option value="litre">Per Litre</option>
                                            <option value="500ml">Per 500ml</option>
                                            <option value="jar">Per Jar</option>
                                            <option value="tin">Per Tin</option>
                                            <option value="bottle">Per Bottle</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelClass}>Weight</label>
                                        <div className="flex gap-2">
                                            <input type="number" step="0.001" value={data.weight} onChange={(e) => setData('weight', e.target.value)} className={inputClass} />
                                            <select value={data.weight_unit} onChange={(e) => setData('weight_unit', e.target.value)} className="w-24 shrink-0 px-2 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orfarm-blue/20 focus:border-orfarm-blue">
                                                <option value="g">g</option>
                                                <option value="kg">kg</option>
                                                <option value="ml">ml</option>
                                                <option value="l">litre</option>
                                                <option value="oz">oz</option>
                                                <option value="lb">lb</option>
                                                <option value="pcs">pcs</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <label className="flex items-center gap-2 mt-4">
                                    <input type="checkbox" checked={data.track_stock} onChange={(e) => setData('track_stock', e.target.checked)} className="rounded border-gray-300" />
                                    <span className="text-sm text-gray-600">Track stock quantity</span>
                                </label>
                            </div>
                        </div>

                        {/* Images & Tags - side by side */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-green-700 mb-4">Images</h2>
                                <div className="grid grid-cols-3 gap-3 mb-4">
                                    {existingImages.map((img) => (
                                        <div key={img.id} className="relative group">
                                            <img src={img.path.startsWith('/') ? img.path : `/storage/${img.path}`} alt="" className="w-full aspect-square object-cover rounded-lg border" />
                                            <button
                                                type="button"
                                                onClick={() => markImageForRemoval(img.id)}
                                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="size-3" />
                                            </button>
                                            {img.is_primary && <span className="absolute bottom-1 left-1 text-[10px] bg-orfarm-blue text-white px-1.5 py-0.5 rounded">Primary</span>}
                                        </div>
                                    ))}
                                    {newImagePreview.map((src, i) => (
                                        <div key={`new-${i}`} className="relative group">
                                            <img src={src} alt="" className="w-full aspect-square object-cover rounded-lg border border-green-300" />
                                            <button
                                                type="button"
                                                onClick={() => removeNewImage(i)}
                                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="size-3" />
                                            </button>
                                            <span className="absolute bottom-1 left-1 text-[10px] bg-green-500 text-white px-1.5 py-0.5 rounded">New</span>
                                        </div>
                                    ))}
                                    <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orfarm-blue hover:bg-blue-50/50 transition-colors">
                                        <Upload className="size-6 text-gray-400 mb-1" />
                                        <span className="text-xs text-gray-500">Add Image</span>
                                        <input type="file" accept="image/*" multiple onChange={handleImageSelect} className="hidden" />
                                    </label>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-green-700 mb-4">Tags</h2>
                                <div className="flex gap-2 mb-3 flex-wrap">
                                    {data.tags.map((tag) => (
                                        <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orfarm-blue text-white rounded-full text-sm font-medium shadow-sm hover:bg-orfarm-blue/80 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                                            {tag}
                                            <button type="button" onClick={() => removeTag(tag)} className="text-white/70 hover:text-white hover:bg-white/20 rounded-full p-0.5 transition-colors"><X className="size-3" /></button>
                                        </span>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} placeholder="Add tag..." className={inputClass} />
                                    <button type="button" onClick={addTag} className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200">Add</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-green-700 mb-4">Publish</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className={labelClass}>Status</label>
                                    <select value={data.status} onChange={(e) => setData('status', e.target.value as any)} className={inputClass}>
                                        <option value="draft">Draft</option>
                                        <option value="published">Published</option>
                                        <option value="out_of_stock">Out of Stock</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Expiry Date</label>
                                    <input type="date" value={data.expiry_date} onChange={(e) => setData('expiry_date', e.target.value)} className={inputClass} />
                                    {errors.expiry_date && <p className={errorClass}>{errors.expiry_date}</p>}
                                </div>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" checked={data.is_featured} onChange={(e) => setData('is_featured', e.target.checked)} className="rounded border-gray-300" />
                                    <span className="text-sm text-gray-600">Featured product</span>
                                </label>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-green-700 mb-4">Halal Certification</h2>
                            <div className="space-y-4">
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" checked={data.is_halal_certified} onChange={(e) => setData('is_halal_certified', e.target.checked)} className="rounded border-gray-300" />
                                    <span className="text-sm text-gray-600">Halal certified</span>
                                </label>
                                {data.is_halal_certified && (
                                    <div>
                                        <label className={labelClass}>Certification Body</label>
                                        <input type="text" value={data.halal_certification_body} onChange={(e) => setData('halal_certification_body', e.target.value)} className={inputClass} />
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3 bg-orfarm-blue text-white rounded-lg font-medium hover:bg-orfarm-blue/90 disabled:opacity-50 transition-colors"
                        >
                            {processing ? 'Saving...' : 'Update Product'}
                        </button>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
