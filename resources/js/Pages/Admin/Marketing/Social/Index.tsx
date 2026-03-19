import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import ConfirmDialog from '@/Components/admin/ConfirmDialog';
import { PaginatedData } from '@/types';
import { Plus, Edit, Trash2, Send, Share2 } from 'lucide-react';

interface SocialPost {
    id: number;
    content: string;
    platforms: string[];
    status: 'draft' | 'scheduled' | 'published' | 'failed';
    image: string | null;
    scheduled_at: string | null;
    published_at: string | null;
    created_at: string;
    creator: { id: number; name: string } | null;
    product: { id: number; name: string } | null;
}

interface Props {
    posts: PaginatedData<SocialPost>;
    filters: {
        status?: string;
    };
}

const platformBadgeColors: Record<string, string> = {
    facebook: 'bg-blue-100 text-blue-700',
    instagram: 'bg-pink-100 text-pink-700',
    whatsapp: 'bg-green-100 text-green-700',
    telegram: 'bg-sky-100 text-sky-700',
};

const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-600',
    scheduled: 'bg-blue-100 text-blue-700',
    published: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700',
};

export default function SocialIndex({ posts, filters }: Props) {
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [publishId, setPublishId] = useState<number | null>(null);

    const applyFilter = (key: string, value: string) => {
        router.get('/admin/marketing/social', { ...filters, [key]: value || undefined }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleDelete = () => {
        if (deleteId === null) return;
        router.delete(`/admin/marketing/social/${deleteId}`, {
            onSuccess: () => setDeleteId(null),
        });
    };

    const handlePublish = () => {
        if (publishId === null) return;
        router.post(`/admin/marketing/social/${publishId}/publish`, {}, {
            onSuccess: () => setPublishId(null),
        });
    };

    return (
        <AdminLayout title="Social Media Posts">
            <Head title="Social Media Posts" />

            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3 flex-wrap">
                    <select
                        value={filters.status || ''}
                        onChange={(e) => applyFilter('status', e.target.value)}
                        className="border border-gray-200 rounded-lg text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orfarm-blue/20"
                    >
                        <option value="">All Statuses</option>
                        <option value="draft">Draft</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="published">Published</option>
                        <option value="failed">Failed</option>
                    </select>
                </div>
                <Link
                    href="/admin/marketing/social/create"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-orfarm-blue text-white rounded-lg text-sm font-medium hover:bg-orfarm-blue/90"
                >
                    <Plus className="size-4" />
                    New Post
                </Link>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Content</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Platforms</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Product</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Created By</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {posts.data.map((post) => (
                                <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 max-w-[280px]">
                                        <div className="flex items-start gap-2">
                                            <Share2 className="size-4 text-gray-400 shrink-0 mt-0.5" />
                                            <p className="text-sm text-gray-900 line-clamp-2">
                                                {post.content}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-wrap gap-1">
                                            {post.platforms.map((platform) => (
                                                <span
                                                    key={platform}
                                                    className={`inline-block px-2 py-0.5 text-[10px] font-medium rounded-full capitalize ${
                                                        platformBadgeColors[platform] || 'bg-gray-100 text-gray-600'
                                                    }`}
                                                >
                                                    {platform}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-full capitalize ${
                                            statusColors[post.status] || 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {post.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        {post.product?.name || '-'}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">
                                        {post.creator?.name || '-'}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">
                                        {new Date(post.created_at).toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1 justify-end">
                                            <Link
                                                href={`/admin/marketing/social/${post.id}/edit`}
                                                className="p-1.5 text-gray-400 hover:text-orfarm-blue rounded-md hover:bg-blue-50"
                                                title="Edit"
                                            >
                                                <Edit className="size-4" />
                                            </Link>
                                            {post.status === 'draft' && (
                                                <button
                                                    onClick={() => setPublishId(post.id)}
                                                    className="p-1.5 text-gray-400 hover:text-green-600 rounded-md hover:bg-green-50"
                                                    title="Publish"
                                                >
                                                    <Send className="size-4" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => setDeleteId(post.id)}
                                                className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50"
                                                title="Delete"
                                            >
                                                <Trash2 className="size-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {posts.data.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-12 text-center text-gray-400 text-sm">
                                        No social media posts found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {posts.last_page > 1 && (
                    <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            Showing {posts.from}-{posts.to} of {posts.total}
                        </p>
                        <div className="flex gap-1">
                            {posts.links.map((link, i) => (
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

            {/* Publish Confirmation */}
            <ConfirmDialog
                open={publishId !== null}
                onClose={() => setPublishId(null)}
                onConfirm={handlePublish}
                title="Publish Post"
                message="Are you sure you want to publish this post now? It will be sent to the selected platforms."
                confirmText="Publish Now"
                variant="warning"
            />

            {/* Delete Confirmation */}
            <ConfirmDialog
                open={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Post"
                message="Are you sure you want to delete this social media post? This action cannot be undone."
                confirmText="Delete"
            />
        </AdminLayout>
    );
}
