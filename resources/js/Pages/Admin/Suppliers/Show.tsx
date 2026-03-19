import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import StatusBadge from '@/Components/admin/StatusBadge';
import { User, SupplierProduct, SupplierCategory } from '@/types';
import { ArrowLeft, Mail, Phone, Package, Truck } from 'lucide-react';

interface Supplier extends User {
    supplier_products: (SupplierProduct & { category?: SupplierCategory })[];
    supplier_products_count?: number;
    created_at: string;
}

interface Props {
    supplier: Supplier;
}

export default function SupplierShow({ supplier }: Props) {
    return (
        <AdminLayout title="Supplier Details">
            <Head title={`Supplier: ${supplier.name}`} />

            <Link
                href="/admin/suppliers"
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6"
            >
                <ArrowLeft className="size-4" />
                Back to Suppliers
            </Link>

            {/* Supplier Info Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="size-16 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-2xl font-bold">
                            {supplier.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{supplier.name}</h2>
                            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                    <Mail className="size-3.5" />
                                    {supplier.email}
                                </span>
                                {supplier.phone && (
                                    <span className="flex items-center gap-1">
                                        <Phone className="size-3.5" />
                                        {supplier.phone}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <StatusBadge
                        status={supplier.is_active !== false ? 'active' : 'inactive'}
                        type="offer"
                    />
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
                    <div>
                        <p className="text-xs text-gray-400 uppercase font-semibold">Total Products</p>
                        <p className="text-lg font-bold text-gray-900 mt-1">
                            {supplier.supplier_products?.length || 0}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase font-semibold">Status</p>
                        <p className="text-lg font-bold text-gray-900 mt-1 capitalize">
                            {supplier.is_active !== false ? 'Active' : 'Inactive'}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase font-semibold">Member Since</p>
                        <p className="text-lg font-bold text-gray-900 mt-1">
                            {new Date(supplier.created_at).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                            })}
                        </p>
                    </div>
                </div>
            </div>

            {/* Supplier Products Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Supplier Products</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Product</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Category</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Unit</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Base Price</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Bulk Price</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {supplier.supplier_products?.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="size-9 rounded-lg bg-gray-100 flex items-center justify-center">
                                                <Package className="size-4 text-gray-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{product.name}</p>
                                                {product.pack_size && (
                                                    <p className="text-xs text-gray-400">Pack: {product.pack_size}</p>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">
                                        {product.category?.emoji && (
                                            <span className="mr-1">{product.category.emoji}</span>
                                        )}
                                        {product.category?.name || '-'}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">{product.unit}</td>
                                    <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                                        &pound;{Number(product.base_price).toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3 text-right text-sm text-gray-500">
                                        {product.bulk_price ? (
                                            <span>
                                                &pound;{Number(product.bulk_price).toFixed(2)}
                                                {product.bulk_qty && (
                                                    <span className="text-xs text-gray-400 ml-1">
                                                        ({product.bulk_qty}+ {product.bulk_unit || product.unit})
                                                    </span>
                                                )}
                                            </span>
                                        ) : (
                                            '-'
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <StatusBadge
                                            status={product.is_active ? 'active' : 'inactive'}
                                            type="offer"
                                        />
                                    </td>
                                </tr>
                            ))}
                            {(!supplier.supplier_products || supplier.supplier_products.length === 0) && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12 text-center">
                                        <Truck className="size-10 text-gray-300 mx-auto mb-3" />
                                        <p className="text-sm text-gray-400">No products listed by this supplier.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
