import { FormEvent } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Save, ArrowLeft } from 'lucide-react';

export default function UserCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        role: 'customer' as string,
        phone: '',
        is_active: true,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/admin/users');
    };

    const inputClass =
        'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orfarm-blue/20 focus:border-orfarm-blue';
    const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
    const errorClass = 'text-xs text-red-500 mt-1';

    return (
        <AdminLayout title="Create User">
            <Head title="Create User" />

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
                    <h2 className="text-lg font-semibold text-gray-900 pb-4 border-b border-gray-100">
                        New User
                    </h2>

                    {/* Name */}
                    <div>
                        <label className={labelClass}>Full Name *</label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className={inputClass}
                            placeholder="John Smith"
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
                            placeholder="john@example.com"
                        />
                        {errors.email && <p className={errorClass}>{errors.email}</p>}
                    </div>

                    {/* Password */}
                    <div>
                        <label className={labelClass}>Password *</label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className={inputClass}
                            placeholder="Minimum 8 characters"
                        />
                        {errors.password && <p className={errorClass}>{errors.password}</p>}
                    </div>

                    {/* Role */}
                    <div>
                        <label className={labelClass}>Role *</label>
                        <select
                            value={data.role}
                            onChange={(e) => setData('role', e.target.value)}
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
                            {processing ? 'Creating...' : 'Create User'}
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
