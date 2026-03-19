import { useState, FormEvent } from 'react';
import { router, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import ConfirmDialog from '@/Components/admin/ConfirmDialog';
import { Category } from '@/types';
import { Plus, Edit, Trash2, ChevronRight, FolderOpen } from 'lucide-react';

interface Props {
    categories: (Category & { products_count: number; children: (Category & { products_count: number })[] })[];
}

export default function CategoriesIndex({ categories }: Props) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [showCreate, setShowCreate] = useState(false);
    const [expanded, setExpanded] = useState<number[]>(categories.map((c) => c.id));

    const createForm = useForm({ name: '', parent_id: '', is_active: true, image: null as File | null });
    const editForm = useForm({ name: '', parent_id: '', is_active: true, image: null as File | null });

    const handleCreate = (e: FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', createForm.data.name);
        if (createForm.data.parent_id) formData.append('parent_id', createForm.data.parent_id);
        formData.append('is_active', createForm.data.is_active ? '1' : '0');
        if (createForm.data.image) formData.append('image', createForm.data.image);

        router.post('/admin/categories', formData, {
            forceFormData: true,
            onSuccess: () => {
                setShowCreate(false);
                createForm.reset();
            },
        });
    };

    const startEdit = (cat: Category) => {
        setEditingId(cat.id);
        editForm.setData({
            name: cat.name,
            parent_id: String(cat.parent_id || ''),
            is_active: cat.is_active,
            image: null,
        });
    };

    const handleUpdate = (e: FormEvent) => {
        e.preventDefault();
        if (!editingId) return;
        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('name', editForm.data.name);
        if (editForm.data.parent_id) formData.append('parent_id', editForm.data.parent_id);
        formData.append('is_active', editForm.data.is_active ? '1' : '0');
        if (editForm.data.image) formData.append('image', editForm.data.image);

        router.post(`/admin/categories/${editingId}`, formData, {
            forceFormData: true,
            onSuccess: () => setEditingId(null),
        });
    };

    const handleDelete = () => {
        if (!deleteId) return;
        router.delete(`/admin/categories/${deleteId}`, {
            onSuccess: () => setDeleteId(null),
        });
    };

    const toggleExpand = (id: number) => {
        setExpanded((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const inputClass = "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orfarm-blue/20 focus:border-orfarm-blue";

    const renderCategory = (cat: Category & { products_count: number; children?: any[] }, depth = 0) => (
        <div key={cat.id}>
            <div className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${depth > 0 ? 'pl-' + (4 + depth * 8) : ''}`} style={{ paddingLeft: `${16 + depth * 32}px` }}>
                {cat.children && cat.children.length > 0 ? (
                    <button onClick={() => toggleExpand(cat.id)} className="text-gray-400 hover:text-gray-600">
                        <ChevronRight className={`size-4 transition-transform ${expanded.includes(cat.id) ? 'rotate-90' : ''}`} />
                    </button>
                ) : (
                    <span className="w-4" />
                )}

                {cat.image ? (
                    <img src={`/storage/${cat.image}`} alt="" className="size-8 rounded-md object-cover border" />
                ) : (
                    <div className="size-8 rounded-md bg-gray-100 flex items-center justify-center">
                        <FolderOpen className="size-4 text-gray-400" />
                    </div>
                )}

                {editingId === cat.id ? (
                    <form onSubmit={handleUpdate} className="flex items-center gap-2 flex-1">
                        <input type="text" value={editForm.data.name} onChange={(e) => editForm.setData('name', e.target.value)} className={inputClass} autoFocus />
                        <label className="flex items-center gap-1">
                            <input type="checkbox" checked={editForm.data.is_active} onChange={(e) => editForm.setData('is_active', e.target.checked)} className="rounded border-gray-300" />
                            <span className="text-xs text-gray-500">Active</span>
                        </label>
                        <button type="submit" className="px-3 py-1.5 bg-orfarm-blue text-white rounded-md text-xs">Save</button>
                        <button type="button" onClick={() => setEditingId(null)} className="px-3 py-1.5 bg-gray-100 rounded-md text-xs">Cancel</button>
                    </form>
                ) : (
                    <>
                        <div className="flex-1">
                            <span className="text-sm font-medium text-gray-900">{cat.name}</span>
                            <span className="ml-2 text-xs text-gray-400">({cat.products_count} products)</span>
                            {!cat.is_active && <span className="ml-2 text-xs text-red-500 font-medium">Inactive</span>}
                        </div>
                        <div className="flex items-center gap-1">
                            <button onClick={() => startEdit(cat)} className="p-1.5 text-gray-400 hover:text-orfarm-blue rounded-md hover:bg-blue-50">
                                <Edit className="size-4" />
                            </button>
                            <button onClick={() => setDeleteId(cat.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-red-50">
                                <Trash2 className="size-4" />
                            </button>
                        </div>
                    </>
                )}
            </div>
            {cat.children && expanded.includes(cat.id) &&
                cat.children.map((child: any) => renderCategory(child, depth + 1))
            }
        </div>
    );

    return (
        <AdminLayout title="Categories">
            <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-gray-500">{categories.length} top-level categories</p>
                <button
                    onClick={() => setShowCreate(!showCreate)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-orfarm-blue text-white rounded-lg text-sm font-medium hover:bg-orfarm-blue/90"
                >
                    <Plus className="size-4" />
                    Add Category
                </button>
            </div>

            {showCreate && (
                <form onSubmit={handleCreate} className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                    <div className="flex items-end gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                            <input type="text" value={createForm.data.name} onChange={(e) => createForm.setData('name', e.target.value)} className={inputClass} placeholder="e.g. Fresh Vegetables" autoFocus />
                        </div>
                        <div className="w-48">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Parent</label>
                            <select value={createForm.data.parent_id} onChange={(e) => createForm.setData('parent_id', e.target.value)} className={inputClass}>
                                <option value="">None (top-level)</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <label className="flex items-center gap-1 pb-2">
                            <input type="checkbox" checked={createForm.data.is_active} onChange={(e) => createForm.setData('is_active', e.target.checked)} className="rounded border-gray-300" />
                            <span className="text-xs text-gray-500">Active</span>
                        </label>
                        <button type="submit" disabled={createForm.processing} className="px-4 py-2 bg-orfarm-blue text-white rounded-lg text-sm font-medium hover:bg-orfarm-blue/90 disabled:opacity-50">
                            Create
                        </button>
                        <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200">
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
                {categories.length === 0 ? (
                    <div className="px-4 py-12 text-center text-gray-400 text-sm">
                        No categories yet. Create your first category above.
                    </div>
                ) : (
                    categories.map((cat) => renderCategory(cat))
                )}
            </div>

            <ConfirmDialog
                open={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Category"
                message="Are you sure? Categories with products cannot be deleted. Move products first."
                confirmText="Delete"
            />
        </AdminLayout>
    );
}
