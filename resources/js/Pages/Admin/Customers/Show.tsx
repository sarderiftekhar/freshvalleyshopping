import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import StatusBadge from '@/Components/admin/StatusBadge';
import ConfirmDialog from '@/Components/admin/ConfirmDialog';
import { User, Order, Address, Product } from '@/types';
import {
    ArrowLeft,
    Mail,
    Phone,
    MapPin,
    ShoppingCart,
    Heart,
    History,
    UserCircle,
    ToggleLeft,
    ToggleRight,
    Package,
    Calendar,
    Eye,
} from 'lucide-react';

interface Customer extends User {
    orders_count: number;
    orders_sum_total: string | null;
    orders: Order[];
    addresses: Address[];
    created_at: string;
    updated_at: string;
}

interface Props {
    customer: Customer;
    favourites: Product[];
    browsingHistory: Product[];
}

type Tab = 'profile' | 'orders' | 'favourites' | 'history';

export default function CustomerShow({ customer, favourites, browsingHistory }: Props) {
    const [activeTab, setActiveTab] = useState<Tab>('profile');
    const [confirmToggle, setConfirmToggle] = useState(false);
    const [toggling, setToggling] = useState(false);

    const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
        { key: 'profile', label: 'Profile', icon: UserCircle },
        { key: 'orders', label: 'Orders', icon: ShoppingCart },
        { key: 'favourites', label: 'Favourites', icon: Heart },
        { key: 'history', label: 'History', icon: History },
    ];

    const handleToggleStatus = () => {
        setToggling(true);
        router.patch(`/admin/customers/${customer.id}/toggle-status`, {}, {
            onFinish: () => {
                setToggling(false);
                setConfirmToggle(false);
            },
        });
    };

    return (
        <AdminLayout title="Customer Details">
            <Head title={`Customer: ${customer.name}`} />

            {/* Back link */}
            <Link
                href="/admin/customers"
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6"
            >
                <ArrowLeft className="size-4" />
                Back to Customers
            </Link>

            {/* Customer Header */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="size-16 rounded-full bg-orfarm-blue/10 text-orfarm-blue flex items-center justify-center text-2xl font-bold">
                            {customer.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{customer.name}</h2>
                            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                    <Mail className="size-3.5" />
                                    {customer.email}
                                </span>
                                {customer.phone && (
                                    <span className="flex items-center gap-1">
                                        <Phone className="size-3.5" />
                                        {customer.phone}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <StatusBadge
                            status={customer.is_active !== false ? 'active' : 'inactive'}
                            type="offer"
                        />
                        <button
                            onClick={() => setConfirmToggle(true)}
                            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                customer.is_active !== false
                                    ? 'bg-red-50 text-red-700 hover:bg-red-100'
                                    : 'bg-green-50 text-green-700 hover:bg-green-100'
                            }`}
                        >
                            {customer.is_active !== false ? (
                                <>
                                    <ToggleLeft className="size-4" />
                                    Deactivate
                                </>
                            ) : (
                                <>
                                    <ToggleRight className="size-4" />
                                    Activate
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
                    <div>
                        <p className="text-xs text-gray-400 uppercase font-semibold">Total Orders</p>
                        <p className="text-lg font-bold text-gray-900 mt-1">{customer.orders_count}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase font-semibold">Total Spent</p>
                        <p className="text-lg font-bold text-gray-900 mt-1">
                            &pound;{Number(customer.orders_sum_total || 0).toFixed(2)}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase font-semibold">Addresses</p>
                        <p className="text-lg font-bold text-gray-900 mt-1">{customer.addresses?.length || 0}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase font-semibold">Member Since</p>
                        <p className="text-lg font-bold text-gray-900 mt-1">
                            {new Date(customer.created_at).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                            })}
                        </p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="flex gap-6">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-colors ${
                                    activeTab === tab.key
                                        ? 'border-orfarm-blue text-orfarm-blue'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                <Icon className="size-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'profile' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Customer Details */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Details</h3>
                        <dl className="space-y-3">
                            <div className="flex justify-between">
                                <dt className="text-sm text-gray-500">Full Name</dt>
                                <dd className="text-sm font-medium text-gray-900">{customer.name}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-sm text-gray-500">Email</dt>
                                <dd className="text-sm font-medium text-gray-900">{customer.email}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-sm text-gray-500">Phone</dt>
                                <dd className="text-sm font-medium text-gray-900">{customer.phone || '-'}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-sm text-gray-500">Email Verified</dt>
                                <dd className="text-sm font-medium text-gray-900">
                                    {customer.email_verified_at
                                        ? new Date(customer.email_verified_at).toLocaleDateString('en-GB')
                                        : 'Not verified'}
                                </dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-sm text-gray-500">Last Login</dt>
                                <dd className="text-sm font-medium text-gray-900">
                                    {customer.last_login_at
                                        ? new Date(customer.last_login_at).toLocaleDateString('en-GB', {
                                              day: 'numeric',
                                              month: 'short',
                                              year: 'numeric',
                                              hour: '2-digit',
                                              minute: '2-digit',
                                          })
                                        : 'Never'}
                                </dd>
                            </div>
                        </dl>
                    </div>

                    {/* Addresses */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Addresses</h3>
                        {customer.addresses && customer.addresses.length > 0 ? (
                            <div className="space-y-4">
                                {customer.addresses.map((address) => (
                                    <div
                                        key={address.id}
                                        className={`p-4 rounded-lg border ${
                                            address.is_default ? 'border-orfarm-blue bg-blue-50/50' : 'border-gray-200'
                                        }`}
                                    >
                                        {address.is_default && (
                                            <span className="text-[10px] font-semibold text-orfarm-blue uppercase tracking-wider">
                                                Default Address
                                            </span>
                                        )}
                                        <p className="text-sm font-medium text-gray-900 mt-1">
                                            {address.first_name} {address.last_name}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-0.5">
                                            {address.address_line_1}
                                            {address.address_line_2 && `, ${address.address_line_2}`}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {address.city}, {address.postcode}
                                        </p>
                                        {address.phone && (
                                            <p className="text-sm text-gray-500 mt-1">
                                                <Phone className="size-3 inline mr-1" />
                                                {address.phone}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <MapPin className="size-8 text-gray-300 mx-auto mb-2" />
                                <p className="text-sm text-gray-400">No addresses saved.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'orders' && (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Order</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Status</th>
                                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Payment</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Total</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {customer.orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3">
                                            <span className="text-sm font-medium text-gray-900">
                                                #{order.order_number}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500">
                                            {new Date(order.created_at).toLocaleDateString('en-GB', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <StatusBadge status={order.status} type="order" />
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <StatusBadge status={order.payment_status} type="payment" />
                                        </td>
                                        <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                                            &pound;{Number(order.total).toFixed(2)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end">
                                                <Link
                                                    href={`/admin/orders/${order.id}`}
                                                    className="p-1.5 text-gray-400 hover:text-blue-600 rounded-md hover:bg-blue-50"
                                                    title="View Order"
                                                >
                                                    <Eye className="size-4" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {customer.orders.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-12 text-center">
                                            <ShoppingCart className="size-10 text-gray-300 mx-auto mb-3" />
                                            <p className="text-sm text-gray-400">No orders yet.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'favourites' && (
                <div>
                    {favourites.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {favourites.map((product) => (
                                <div
                                    key={product.id}
                                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                                >
                                    {product.primary_image ? (
                                        <img
                                            src={product.primary_image.path.startsWith('/') ? product.primary_image.path : `/storage/${product.primary_image.path}`}
                                            alt={product.title}
                                            className="w-full aspect-square object-cover"
                                        />
                                    ) : (
                                        <div className="w-full aspect-square bg-gray-100 flex items-center justify-center">
                                            <Package className="size-10 text-gray-300" />
                                        </div>
                                    )}
                                    <div className="p-3">
                                        <p className="text-sm font-medium text-gray-900 line-clamp-2">
                                            {product.title}
                                        </p>
                                        <p className="text-sm text-orfarm-blue font-semibold mt-1">
                                            &pound;{product.price}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                            <Heart className="size-10 text-gray-300 mx-auto mb-3" />
                            <p className="text-sm text-gray-400">No favourite products.</p>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'history' && (
                <div>
                    {browsingHistory.length > 0 ? (
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <div className="divide-y divide-gray-100">
                                {browsingHistory.map((product) => (
                                    <div
                                        key={product.id}
                                        className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                                    >
                                        {product.primary_image ? (
                                            <img
                                                src={product.primary_image.path.startsWith('/') ? product.primary_image.path : `/storage/${product.primary_image.path}`}
                                                alt={product.title}
                                                className="size-12 rounded-lg object-cover border"
                                            />
                                        ) : (
                                            <div className="size-12 rounded-lg bg-gray-100 flex items-center justify-center">
                                                <Package className="size-5 text-gray-400" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {product.title}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {product.category?.name || 'Uncategorized'}
                                            </p>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-900">
                                            &pound;{product.price}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                            <History className="size-10 text-gray-300 mx-auto mb-3" />
                            <p className="text-sm text-gray-400">No browsing history recorded.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Toggle Status Confirmation */}
            <ConfirmDialog
                open={confirmToggle}
                onClose={() => setConfirmToggle(false)}
                onConfirm={handleToggleStatus}
                title={customer.is_active !== false ? 'Deactivate Customer' : 'Activate Customer'}
                message={
                    customer.is_active !== false
                        ? `Are you sure you want to deactivate ${customer.name}? They will no longer be able to log in or place orders.`
                        : `Are you sure you want to reactivate ${customer.name}? They will be able to log in and place orders again.`
                }
                confirmText={customer.is_active !== false ? 'Deactivate' : 'Activate'}
                variant={customer.is_active !== false ? 'danger' : 'warning'}
                loading={toggling}
            />
        </AdminLayout>
    );
}
