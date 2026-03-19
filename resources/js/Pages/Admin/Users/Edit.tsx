import { FormEvent } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { User } from '@/types';
import { Save, ArrowLeft } from 'lucide-react';

interface Props {
    user: User;
}

export default function UserEdit({ user }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        password: '',
        role: user.role || 'customer',
        phone: user.phone || '',
        is_active: user.is_active !== false,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(`/admin/users/${user.id}`);
    };

    const inputClass =
        'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orfarm-blue/20 focus:border-orfarm-blue';
    const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
    const errorClass = 'text-xs text-red-500 mt-1';

    return (
        <AdminLayout title="Edit User">
            <Head title={`Edit User - ${user.name}`} />

            <div className="mb-6">
                <Link
                    href="/admin/users"
                    className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-orfarm-blue transition-colors"
                >
                    <ArrowLeft className="size-4" />
                    Back to Users
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="max-w-2xl">
                <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Edit User
                        </h2>
                        <div className="flex items-center gap-2">
                            <div className="size-10 rounded-full bg-orfarm-blue/10 text-orfarm-blue flex items-center justify-center text-sm font-bold">
                                {user.name?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">
                                    {user.name}
                                </p>
                                <p className="text-xs text-gray-400">{user.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Name */}
                    <div>
                        <label className={labelClass}>Full Name *</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className={inputClass}
                        />
                        {errors.name && <p className={errorClass}>{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label className={labelClass}>Email Address *</label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className={inputClass}
                        />
                        {errors.email && <p className={errorClass}>{errors.email}</p>}
                    </div>

                    {/* Password */}
                    <div>
                        <label className={labelClass}>Password</label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className={inputClass}
                            placeholder="Leave blank to keep current password"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            Only fill this in if you want to change the user's password.
                        </p>
                        {errors.password && <p className={errorClass}>{errors.password}</p>}
                    </div>

                    {/* Role */}
                    <div>
                        <label className={labelClass}>Role *</label>
                        <select
                            value={data.role}
                            onChange={(e) => setData('role', e.target.value as any)}
                            className={inputClass}
                        >
                            <option value="customer">Customer</option>
                            <option value="supplier">Supplier</option>
                            <option value="editor">Editor</option>
                            <option value="admin">Admin</option>
                            <option value="super_admin">Super Admin</option>
                        </select>
                        {errors.role && <p className={errorClass}>{errors.role}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className={labelClass}>Phone Number</label>
                        <input
                            type="text"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            className={inputClass}
                            placeholder="+44 7700 900000"
                        />
                        {errors.phone && <p className={errorClass}>{errors.phone}</p>}
                    </div>

                    {/* Active Status */}
                    <div>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="rounded border-gray-300 text-orfarm-blue focus:ring-orfarm-blue"
                            />
                            <span className="text-sm text-gray-700">
                                Account is active
                            </span>
                        </label>
                    </div>

                    {/* Submit */}
                    <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-orfarm-blue text-white rounded-lg text-sm font-medium hover:bg-orfarm-blue/90 disabled:opacity-50 transition-colors"
                        >
                            <Save className="size-4" />
                            {processing ? 'Updating...' : 'Update User'}
                        </button>
                        <Link
                            href="/admin/users"
                            className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            Cancel
                        </Link>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
