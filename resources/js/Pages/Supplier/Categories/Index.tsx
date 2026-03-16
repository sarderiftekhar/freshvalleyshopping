import { Head, useForm, router } from '@inertiajs/react';
import SupplierLayout from '@/Layouts/SupplierLayout';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import { SupplierCategory } from '@/types';
import { useState } from 'react';

interface Props {
    categories: (SupplierCategory & { products_count: number })[];
}

export default function CategoriesIndex({ categories }: Props) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showCreate, setShowCreate] = useState(false);

    return (
        <SupplierLayout title="Categories">
            <Head title="Supplier Categories" />

            <div className="bg-white rounded-xl shadow-sm overflow-hidden max-w-3xl">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-heading font-bold text-orfarm-blue">Product Categories</h2>
                        <p className="text-sm text-orfarm-body/50 mt-0.5">{categories.length} categories</p>
                    </div>
                    <button
                        onClick={() => setShowCreate(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-orfarm-green text-white text-sm font-semibold rounded-lg hover:bg-orfarm-green-dark transition-colors"
                    >
                        <Plus className="size-4" />
                        Add Category
                    </button>
                </div>

                {/* Create Form */}
                {showCreate && (
                    <CreateCategoryRow onClose={() => setShowCreate(false)} />
                )}

                {/* Category List */}
                <div className="divide-y divide-gray-50">
                    {categories.map((cat) => (
                        editingId === cat.id ? (
                            <EditCategoryRow key={cat.id} category={cat} onClose={() => setEditingId(null)} />
                        ) : (
                            <div key={cat.id} className="px-6 py-4 flex items-center justify-between hover:bg-orfarm-grey/30 transition-colors">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl w-10 text-center">{cat.emoji}</span>
                                    <div>
                                        <h3 className="text-sm font-semibold text-orfarm-blue">{cat.name}</h3>
                                        <p className="text-xs text-orfarm-body/50">
                                            {cat.products_count} products &middot; Sort: {cat.sort_order}
                                            {!cat.is_active && (
                                                <span className="ml-2 text-orfarm-red font-medium">Inactive</span>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => setEditingId(cat.id)}
                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-orfarm-body/50 hover:bg-orfarm-green/10 hover:text-orfarm-green transition-colors"
                                    >
                                        <Pencil className="size-3.5" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (cat.products_count > 0) {
                                                alert(`Cannot delete "${cat.name}" — it has ${cat.products_count} products. Remove products first.`);
                                                return;
                                            }
                                            if (confirm(`Delete "${cat.name}"?`)) {
                                                router.delete(`/supplier/categories/${cat.id}`);
                                            }
                                        }}
                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-orfarm-body/50 hover:bg-red-50 hover:text-orfarm-red transition-colors"
                                    >
                                        <Trash2 className="size-3.5" />
                                    </button>
                                </div>
                            </div>
                        )
                    ))}
                </div>

                {categories.length === 0 && (
                    <div className="px-6 py-12 text-center text-orfarm-body/50">
                        No categories yet. Create one to get started.
                    </div>
                )}
            </div>
        </SupplierLayout>
    );
}

function CreateCategoryRow({ onClose }: { onClose: () => void }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        emoji: '',
        sort_order: 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/supplier/categories', { onSuccess: () => onClose() });
    };

    return (
        <form onSubmit={handleSubmit} className="px-6 py-4 bg-orfarm-green/5 border-b border-orfarm-green/20">
            <div className="flex items-center gap-3">
                <input
                    type="text"
                    placeholder="Emoji"
                    value={data.emoji}
                    onChange={(e) => setData('emoji', e.target.value)}
                    className="w-16 h-9 px-2 text-center rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orfarm-green/30"
                />
                <input
                    type="text"
                    placeholder="Category name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className="flex-1 h-9 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orfarm-green/30"
                />
                <input
                    type="number"
                    placeholder="Order"
                    value={data.sort_order}
                    onChange={(e) => setData('sort_order', parseInt(e.target.value) || 0)}
                    className="w-20 h-9 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orfarm-green/30"
                />
                <button
                    type="submit"
                    disabled={processing}
                    className="w-9 h-9 bg-orfarm-green rounded-lg flex items-center justify-center text-white hover:bg-orfarm-green-dark transition-colors"
                >
                    <Save className="size-4" />
                </button>
                <button
                    type="button"
                    onClick={onClose}
                    className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                >
                    <X className="size-4" />
                </button>
            </div>
            {errors.name && <p className="text-xs text-orfarm-red mt-1">{errors.name}</p>}
        </form>
    );
}

function EditCategoryRow({ category, onClose }: { category: SupplierCategory; onClose: () => void }) {
    const { data, setData, put, processing } = useForm({
        name: category.name,
        emoji: category.emoji || '',
        sort_order: category.sort_order,
        is_active: category.is_active,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/supplier/categories/${category.id}`, { onSuccess: () => onClose() });
    };

    return (
        <form onSubmit={handleSubmit} className="px-6 py-4 bg-blue-50/50 border-b border-blue-100">
            <div className="flex items-center gap-3">
                <input
                    type="text"
                    value={data.emoji}
                    onChange={(e) => setData('emoji', e.target.value)}
                    className="w-16 h-9 px-2 text-center rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orfarm-green/30"
                />
                <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className="flex-1 h-9 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orfarm-green/30"
                />
                <input
                    type="number"
                    value={data.sort_order}
                    onChange={(e) => setData('sort_order', parseInt(e.target.value) || 0)}
                    className="w-20 h-9 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orfarm-green/30"
                />
                <label className="flex items-center gap-1 text-xs whitespace-nowrap">
                    <input
                        type="checkbox"
                        checked={data.is_active}
                        onChange={(e) => setData('is_active', e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-gray-300 text-orfarm-green focus:ring-orfarm-green"
                    />
                    Active
                </label>
                <button
                    type="submit"
                    disabled={processing}
                    className="w-9 h-9 bg-orfarm-green rounded-lg flex items-center justify-center text-white hover:bg-orfarm-green-dark transition-colors"
                >
                    <Save className="size-4" />
                </button>
                <button
                    type="button"
                    onClick={onClose}
                    className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                >
                    <X className="size-4" />
                </button>
            </div>
        </form>
    );
}
