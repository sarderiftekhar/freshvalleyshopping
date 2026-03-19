import { FormEvent } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft } from 'lucide-react';

export default function SupplierCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        phone: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/admin/suppliers');
    };

    const inputClass =
        'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orfarm-blue/20 focus:border-orfarm-blue';
    const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
    const errorClass = 'text-xs text-red-500 mt-1';

    return (
        <AdminLayout title="Add Supplier">
            <Head title="Add Supplier" />

            <Link
                href="/admin/suppliers"
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6"
            >
                <ArrowLeft className="size-4" />
                Back to Suppliers
            </Link>

            <form onSubmit={handleSubmit} className="max-w-lg">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Supplier Details</h2>
                    <div className="space-y-4">
                        <div>
                            <label className={labelClass}>Name *</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className={inputClass}
                                placeholder="Supplier name"
                            />
                            {errors.name && <p className={errorClass}>{errors.name}</p>}
                        </div>

                        <div>
                            <label className={labelClass}>Email *</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className={inputClass}
                                placeholder="supplier@example.com"
                            />
                            {errors.email && <p className={errorClass}>{errors.email}</p>}
                        </div>

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

                        <div>
                            <label className={labelClass}>Phone</label>
                            <input
                                type="text"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                className={inputClass}
                                placeholder="07xxx xxxxxx"
                            />
                            {errors.phone && <p className={errorClass}>{errors.phone}</p>}
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex items-center gap-3">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-6 py-2.5 bg-orfarm-blue text-white rounded-lg text-sm font-medium hover:bg-orfarm-blue/90 disabled:opacity-50 transition-colors"
                    >
                        {processing ? 'Creating...' : 'Create Supplier'}
                    </button>
                    <Link
                        href="/admin/suppliers"
                        className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </AdminLayout>
    );
}
