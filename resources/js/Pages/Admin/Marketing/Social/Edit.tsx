import { FormEvent, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft, Image, X } from 'lucide-react';

interface SocialPost {
    id: number;
    content: string;
    platforms: string[];
    status: 'draft' | 'scheduled' | 'published' | 'failed';
    product_id: number | null;
    image: string | null;
    scheduled_at: string | null;
}

interface Props {
    post: SocialPost;
    products: { id: number; name: string }[];
}

const platforms = [
    { value: 'facebook', label: 'Facebook', color: 'bg-blue-100 text-blue-700 border-blue-300' },
    { value: 'instagram', label: 'Instagram', color: 'bg-pink-100 text-pink-700 border-pink-300' },
    { value: 'whatsapp', label: 'WhatsApp', color: 'bg-green-100 text-green-700 border-green-300' },
    { value: 'telegram', label: 'Telegram', color: 'bg-sky-100 text-sky-700 border-sky-300' },
];

export default function SocialEdit({ post, products }: Props) {
    const formatDateForInput = (dateStr: string | null) => {
        if (!dateStr) return '';
        return new Date(dateStr).toISOString().slice(0, 16);
    };

    const { data, setData, processing, errors } = useForm({
        content: post.content,
        platforms: post.platforms || [],
        product_id: post.product_id ? String(post.product_id) : '',
        image: null as File | null,
        scheduled_at: formatDateForInput(post.scheduled_at),
    });

    const [imagePreview, setImagePreview] = useState<string | null>(
        post.image ? `/storage/${post.image}` : null
    );
    const [removeExistingImage, setRemoveExistingImage] = useState(false);

    const isEditable = post.status === 'draft' || post.status === 'scheduled';

    const togglePlatform = (platform: string) => {
        setData('platforms',
            data.platforms.includes(platform)
                ? data.platforms.filter((p) => p !== platform)
                : [...data.platforms, platform]
        );
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setData('image', file);
        setRemoveExistingImage(false);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    const removeImage = () => {
        setData('image', null);
        setImagePreview(null);
        setRemoveExistingImage(true);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('content', data.content);
        data.platforms.forEach((p, i) => formData.append(`platforms[${i}]`, p));
        if (data.product_id) formData.append('product_id', data.product_id);
        if (data.image) formData.append('image', data.image);
        if (data.scheduled_at) formData.append('scheduled_at', data.scheduled_at);
        if (removeExistingImage) formData.append('remove_image', '1');

        router.post(`/admin/marketing/social/${post.id}`, formData, { forceFormData: true });
    };

    const inputClass = "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orfarm-blue/20 focus:border-orfarm-blue";
    const labelClass = "block text-sm font-medium text-gray-700 mb-1";
    const errorClass = "text-xs text-red-500 mt-1";

    return (
        <AdminLayout title="Edit Social Post">
            <Head title="Edit Social Post" />

            <div className="mb-6">
                <Link
                    href="/admin/marketing/social"
                    className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-orfarm-blue transition-colors"
                >
                    <ArrowLeft className="size-4" />
                    Back to Social Media
                </Link>
            </div>

            {!isEditable && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-700">
                        This post has already been {post.status} and cannot be edited.
                    </p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
                {/* Content */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Post Content</h2>
                    <div className="space-y-4">
                        <div>
                            <label className={labelClass}>Content *</label>
                            <textarea
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                rows={6}
                                placeholder="Write your social media post content..."
                                className={inputClass}
                                disabled={!isEditable}
                            />
                            <div className="flex justify-between mt-1">
                                {errors.content && <p className={errorClass}>{errors.content}</p>}
                                <p className="text-xs text-gray-400 ml-auto">{data.content.length} characters</p>
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className={labelClass}>Image (optional)</label>
                            {imagePreview ? (
                                <div className="relative inline-block">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-40 h-40 object-cover rounded-lg border border-gray-200"
                                    />
                                    {isEditable && (
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                        >
                                            <X className="size-3" />
                                        </button>
                                    )}
                                </div>
                            ) : (
                                isEditable && (
                                    <label className="flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orfarm-blue hover:bg-gray-50 transition-colors">
                                        <Image className="size-8 text-gray-400 mb-2" />
                                        <span className="text-xs text-gray-500">Upload Image</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                )
                            )}
                            {errors.image && <p className={errorClass}>{errors.image}</p>}
                        </div>
                    </div>
                </div>

                {/* Platforms & Settings */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Platforms & Settings</h2>
                    <div className="space-y-4">
                        {/* Platform Checkboxes */}
                        <div>
                            <label className={labelClass}>Platforms *</label>
                            <div className="flex flex-wrap gap-3">
                                {platforms.map((platform) => (
                                    <label
                                        key={platform.value}
                                        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                                            data.platforms.includes(platform.value)
                                                ? platform.color
                                                : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                                        } ${!isEditable ? 'opacity-60 pointer-events-none' : ''}`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={data.platforms.includes(platform.value)}
                                            onChange={() => togglePlatform(platform.value)}
                                            className="rounded border-gray-300"
                                            disabled={!isEditable}
                                        />
                                        <span className="text-sm font-medium">{platform.label}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.platforms && <p className={errorClass}>{errors.platforms}</p>}
                        </div>

                        {/* Product Link */}
                        <div>
                            <label className={labelClass}>Link Product (optional)</label>
                            <select
                                value={data.product_id}
                                onChange={(e) => setData('product_id', e.target.value)}
                                className={inputClass}
                                disabled={!isEditable}
                            >
                                <option value="">No product linked</option>
                                {products.map((product) => (
                                    <option key={product.id} value={product.id}>{product.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Schedule */}
                        <div>
                            <label className={labelClass}>Schedule (optional)</label>
                            <input
                                type="datetime-local"
                                value={data.scheduled_at}
                                onChange={(e) => setData('scheduled_at', e.target.value)}
                                className={inputClass}
                                disabled={!isEditable}
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                Leave empty to save as draft. Set a date to schedule publishing.
                            </p>
                            {errors.scheduled_at && <p className={errorClass}>{errors.scheduled_at}</p>}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                {isEditable && (
                    <div className="flex items-center gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-3 bg-orfarm-blue text-white rounded-lg font-medium hover:bg-orfarm-blue/90 disabled:opacity-50"
                        >
                            {processing ? 'Saving...' : 'Update Post'}
                        </button>
                        <Link
                            href="/admin/marketing/social"
                            className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </Link>
                    </div>
                )}
            </form>
        </AdminLayout>
    );
}
