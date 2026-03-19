import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import StatusBadge from '@/Components/admin/StatusBadge';
import ConfirmDialog from '@/Components/admin/ConfirmDialog';
import { Order, OrderItem, User, DeliverySlot } from '@/types';
import {
    ArrowLeft,
    Package,
    MapPin,
    CreditCard,
    Clock,
    Send,
    MessageSquare,
    RefreshCw,
    ChevronDown,
    ChevronUp,
    User as UserIcon,
    Mail,
    Phone,
    CalendarDays,
    FileText,
    CircleDot,
} from 'lucide-react';

interface StatusHistoryEntry {
    id: number;
    from_status: string | null;
    to_status: string;
    note: string | null;
    created_at: string;
    changed_by?: User;
}

interface AdminNote {
    id: number;
    note: string;
    created_at: string;
    user?: User;
}

interface OrderDetail extends Order {
    user?: User;
    items: (OrderItem & { product?: { id: number; title: string; slug: string; primary_image?: { path: string } } })[];
    status_history: StatusHistoryEntry[];
    assigned_to?: User;
    delivery_slot?: DeliverySlot;
    stripe_charge_id?: string | null;
    refunded_amount?: string;
    admin_notes?: AdminNote[];
}

interface Props {
    order: OrderDetail;
}

const ORDER_STATUSES = [
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'dispatched', label: 'Dispatched' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
];

export default function OrderShow({ order }: Props) {
    const [showTimeline, setShowTimeline] = useState(true);
    const [showRefundConfirm, setShowRefundConfirm] = useState(false);

    // Status update form
    const statusForm = useForm({
        status: order.status,
        note: '',
    });

    // Refund form
    const refundForm = useForm({
        amount: '',
        reason: '',
    });

    // Admin note form
    const noteForm = useForm({
        note: '',
    });

    const handleStatusUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        statusForm.patch(route('admin.orders.status', order.id), {
            preserveScroll: true,
            onSuccess: () => {
                statusForm.reset('note');
            },
        });
    };

    const handleRefund = () => {
        refundForm.post(route('admin.orders.refund', order.id), {
            preserveScroll: true,
            onSuccess: () => {
                refundForm.reset();
                setShowRefundConfirm(false);
            },
        });
    };

    const handleAddNote = (e: React.FormEvent) => {
        e.preventDefault();
        noteForm.post(route('admin.orders.note', order.id), {
            preserveScroll: true,
            onSuccess: () => {
                noteForm.reset('note');
            },
        });
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    const formatDateTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const subtotal = parseFloat(order.subtotal);
    const deliveryFee = parseFloat(order.delivery_fee);
    const total = parseFloat(order.total);
    const refundedAmount = order.refunded_amount ? parseFloat(order.refunded_amount) : 0;

    return (
        <AdminLayout title={`Order ${order.order_number}`}>
            <Head title={`Order ${order.order_number}`} />

            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                    <Link
                        href={route('admin.orders.index')}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="size-5" />
                    </Link>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            Order {order.order_number}
                        </h2>
                        <p className="text-sm text-gray-500">
                            Placed on {formatDateTime(order.created_at)}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <StatusBadge status={order.status} type="order" />
                    <StatusBadge status={order.payment_status} type="payment" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Items */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                <Package className="size-4" />
                                Order Items
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                                            Product
                                        </th>
                                        <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                                            Qty
                                        </th>
                                        <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                                            Price
                                        </th>
                                        <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                                            Total
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {order.items.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-3">
                                                    {item.product?.primary_image ? (
                                                        <img
                                                            src={item.product.primary_image.path.startsWith('/') ? item.product.primary_image.path : `/storage/${item.product.primary_image.path}`}
                                                            alt=""
                                                            className="size-10 rounded-lg object-cover border"
                                                        />
                                                    ) : (
                                                        <div className="size-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                                            <Package className="size-5 text-gray-400" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {item.product_title}
                                                        </p>
                                                        {item.product && (
                                                            <Link
                                                                href={`/product/${item.product.slug}`}
                                                                className="text-xs text-orfarm-blue hover:underline"
                                                            >
                                                                View product
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3 text-center text-sm text-gray-700">
                                                {item.quantity}
                                            </td>
                                            <td className="px-5 py-3 text-right text-sm text-gray-700">
                                                &pound;{parseFloat(item.price).toFixed(2)}
                                            </td>
                                            <td className="px-5 py-3 text-right text-sm font-medium text-gray-900">
                                                &pound;{parseFloat(item.total).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Totals */}
                        <div className="border-t border-gray-200 px-5 py-4 bg-gray-50">
                            <div className="max-w-xs ml-auto space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="text-gray-900">
                                        &pound;{subtotal.toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Delivery Fee</span>
                                    <span className="text-gray-900">
                                        {deliveryFee > 0
                                            ? `\u00A3${deliveryFee.toFixed(2)}`
                                            : 'Free'}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm font-semibold border-t border-gray-200 pt-2">
                                    <span className="text-gray-900">Total</span>
                                    <span className="text-gray-900">
                                        &pound;{total.toFixed(2)}
                                    </span>
                                </div>
                                {refundedAmount > 0 && (
                                    <div className="flex justify-between text-sm text-red-600">
                                        <span>Refunded</span>
                                        <span>
                                            -&pound;{refundedAmount.toFixed(2)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Status Timeline */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <button
                            onClick={() => setShowTimeline(!showTimeline)}
                            className="w-full px-5 py-4 border-b border-gray-200 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                <Clock className="size-4" />
                                Status Timeline
                            </h3>
                            {showTimeline ? (
                                <ChevronUp className="size-4 text-gray-400" />
                            ) : (
                                <ChevronDown className="size-4 text-gray-400" />
                            )}
                        </button>
                        {showTimeline && (
                            <div className="px-5 py-4">
                                {order.status_history && order.status_history.length > 0 ? (
                                    <div className="relative">
                                        <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-gray-200" />
                                        <div className="space-y-6">
                                            {order.status_history.map((entry, index) => (
                                                <div
                                                    key={entry.id}
                                                    className="relative flex gap-4"
                                                >
                                                    <div
                                                        className={`relative z-10 size-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                                                            index === 0
                                                                ? 'bg-orfarm-blue text-white'
                                                                : 'bg-gray-200 text-gray-500'
                                                        }`}
                                                    >
                                                        <CircleDot className="size-3" />
                                                    </div>
                                                    <div className="flex-1 min-w-0 pb-1">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <StatusBadge
                                                                status={entry.to_status}
                                                                type="order"
                                                            />
                                                            {entry.from_status && (
                                                                <span className="text-xs text-gray-400">
                                                                    from{' '}
                                                                    <span className="capitalize">
                                                                        {entry.from_status.replace(/_/g, ' ')}
                                                                    </span>
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {formatDateTime(entry.created_at)}
                                                            {entry.changed_by && (
                                                                <span>
                                                                    {' '}
                                                                    by {entry.changed_by.name}
                                                                </span>
                                                            )}
                                                        </p>
                                                        {entry.note && (
                                                            <p className="text-sm text-gray-600 mt-1 bg-gray-50 rounded-lg p-2">
                                                                {entry.note}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400 text-center py-4">
                                        No status history available.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Status Update Form */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                <RefreshCw className="size-4" />
                                Update Status
                            </h3>
                        </div>
                        <form onSubmit={handleStatusUpdate} className="px-5 py-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        New Status
                                    </label>
                                    <select
                                        value={statusForm.data.status}
                                        onChange={(e) =>
                                            statusForm.setData('status', e.target.value as any)
                                        }
                                        className="w-full border border-gray-200 rounded-lg text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orfarm-blue/20 focus:border-orfarm-blue"
                                    >
                                        {ORDER_STATUSES.map((s) => (
                                            <option key={s.value} value={s.value}>
                                                {s.label}
                                            </option>
                                        ))}
                                    </select>
                                    {statusForm.errors.status && (
                                        <p className="text-xs text-red-600 mt-1">
                                            {statusForm.errors.status}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Note (optional)
                                </label>
                                <textarea
                                    value={statusForm.data.note}
                                    onChange={(e) =>
                                        statusForm.setData('note', e.target.value)
                                    }
                                    rows={2}
                                    placeholder="Add a note about this status change..."
                                    className="w-full border border-gray-200 rounded-lg text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orfarm-blue/20 focus:border-orfarm-blue resize-none"
                                />
                                {statusForm.errors.note && (
                                    <p className="text-xs text-red-600 mt-1">
                                        {statusForm.errors.note}
                                    </p>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={statusForm.processing}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-orfarm-blue text-white rounded-lg text-sm font-medium hover:bg-orfarm-blue/90 transition-colors disabled:opacity-50"
                            >
                                <Send className="size-4" />
                                {statusForm.processing
                                    ? 'Updating...'
                                    : 'Update Status'}
                            </button>
                        </form>
                    </div>

                    {/* Refund Form */}
                    {order.stripe_charge_id && (
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <div className="px-5 py-4 border-b border-gray-200">
                                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                    <CreditCard className="size-4" />
                                    Issue Refund
                                </h3>
                            </div>
                            <div className="px-5 py-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Refund Amount (&pound;)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0.01"
                                            max={total - refundedAmount}
                                            value={refundForm.data.amount}
                                            onChange={(e) =>
                                                refundForm.setData(
                                                    'amount',
                                                    e.target.value
                                                )
                                            }
                                            placeholder={`Max: ${(total - refundedAmount).toFixed(2)}`}
                                            className="w-full border border-gray-200 rounded-lg text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orfarm-blue/20 focus:border-orfarm-blue"
                                        />
                                        {refundForm.errors.amount && (
                                            <p className="text-xs text-red-600 mt-1">
                                                {refundForm.errors.amount}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Reason
                                    </label>
                                    <textarea
                                        value={refundForm.data.reason}
                                        onChange={(e) =>
                                            refundForm.setData(
                                                'reason',
                                                e.target.value
                                            )
                                        }
                                        rows={2}
                                        placeholder="Reason for refund..."
                                        className="w-full border border-gray-200 rounded-lg text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orfarm-blue/20 focus:border-orfarm-blue resize-none"
                                    />
                                    {refundForm.errors.reason && (
                                        <p className="text-xs text-red-600 mt-1">
                                            {refundForm.errors.reason}
                                        </p>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowRefundConfirm(true)}
                                    disabled={
                                        refundForm.processing ||
                                        !refundForm.data.amount ||
                                        !refundForm.data.reason
                                    }
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                                >
                                    <CreditCard className="size-4" />
                                    Issue Refund
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Admin Notes */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                <MessageSquare className="size-4" />
                                Admin Notes
                            </h3>
                        </div>
                        <div className="px-5 py-4">
                            {/* Existing notes */}
                            {order.admin_notes && order.admin_notes.length > 0 && (
                                <div className="space-y-3 mb-4">
                                    {order.admin_notes.map((note) => (
                                        <div
                                            key={note.id}
                                            className="bg-gray-50 rounded-lg p-3"
                                        >
                                            <p className="text-sm text-gray-700">
                                                {note.note}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {note.user?.name || 'System'} &middot;{' '}
                                                {formatDateTime(note.created_at)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Add note form */}
                            <form onSubmit={handleAddNote}>
                                <textarea
                                    value={noteForm.data.note}
                                    onChange={(e) =>
                                        noteForm.setData('note', e.target.value)
                                    }
                                    rows={2}
                                    placeholder="Add an internal note..."
                                    className="w-full border border-gray-200 rounded-lg text-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orfarm-blue/20 focus:border-orfarm-blue resize-none mb-3"
                                />
                                {noteForm.errors.note && (
                                    <p className="text-xs text-red-600 mb-2">
                                        {noteForm.errors.note}
                                    </p>
                                )}
                                <button
                                    type="submit"
                                    disabled={
                                        noteForm.processing || !noteForm.data.note.trim()
                                    }
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors disabled:opacity-50"
                                >
                                    <Send className="size-4" />
                                    {noteForm.processing ? 'Adding...' : 'Add Note'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-6">
                    {/* Customer Info */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                <UserIcon className="size-4" />
                                Customer
                            </h3>
                        </div>
                        <div className="px-5 py-4 space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-full bg-orfarm-blue text-white flex items-center justify-center text-sm font-medium flex-shrink-0">
                                    {order.user?.name?.charAt(0)?.toUpperCase() || 'G'}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {order.user?.name || 'Guest Customer'}
                                    </p>
                                    {order.user && (
                                        <Link
                                            href={`/admin/customers/${order.user.id}`}
                                            className="text-xs text-orfarm-blue hover:underline"
                                        >
                                            View profile
                                        </Link>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Mail className="size-4 text-gray-400 flex-shrink-0" />
                                    <span className="truncate">{order.email}</span>
                                </div>
                                {order.phone && (
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Phone className="size-4 text-gray-400 flex-shrink-0" />
                                        <span>{order.phone}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Delivery Info */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                <MapPin className="size-4" />
                                Delivery Details
                            </h3>
                        </div>
                        <div className="px-5 py-4 space-y-3">
                            <div>
                                <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                                    Address
                                </p>
                                <p className="text-sm text-gray-900">
                                    {order.delivery_address}
                                </p>
                                <p className="text-sm text-gray-900">
                                    {order.city}, {order.postcode}
                                </p>
                            </div>
                            {order.delivery_slot && (
                                <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                                        Delivery Slot
                                    </p>
                                    <div className="flex items-center gap-2 text-sm text-gray-900">
                                        <CalendarDays className="size-4 text-gray-400" />
                                        <span>
                                            {formatDate(order.delivery_slot.delivery_date)}{' '}
                                            &mdash; {order.delivery_slot.label}
                                        </span>
                                    </div>
                                </div>
                            )}
                            {order.assigned_to && (
                                <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                                        Assigned To
                                    </p>
                                    <p className="text-sm text-gray-900">
                                        {order.assigned_to.name}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                <CreditCard className="size-4" />
                                Payment
                            </h3>
                        </div>
                        <div className="px-5 py-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">Status</span>
                                <StatusBadge
                                    status={order.payment_status}
                                    type="payment"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">Method</span>
                                <span className="text-sm text-gray-900 capitalize">
                                    {order.stripe_payment_intent_id
                                        ? 'Stripe'
                                        : 'Cash on Delivery'}
                                </span>
                            </div>
                            {order.stripe_charge_id && (
                                <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                                        Stripe Charge ID
                                    </p>
                                    <p className="text-xs font-mono text-gray-600 bg-gray-50 rounded px-2 py-1 break-all">
                                        {order.stripe_charge_id}
                                    </p>
                                </div>
                            )}
                            {order.stripe_payment_intent_id && (
                                <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                                        Payment Intent
                                    </p>
                                    <p className="text-xs font-mono text-gray-600 bg-gray-50 rounded px-2 py-1 break-all">
                                        {order.stripe_payment_intent_id}
                                    </p>
                                </div>
                            )}
                            <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                                <span className="text-sm font-medium text-gray-900">
                                    Amount Paid
                                </span>
                                <span className="text-sm font-bold text-gray-900">
                                    &pound;{total.toFixed(2)}
                                </span>
                            </div>
                            {refundedAmount > 0 && (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-red-600">
                                        Refunded
                                    </span>
                                    <span className="text-sm font-medium text-red-600">
                                        -&pound;{refundedAmount.toFixed(2)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Notes */}
                    {order.notes && (
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <div className="px-5 py-4 border-b border-gray-200">
                                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                    <FileText className="size-4" />
                                    Customer Notes
                                </h3>
                            </div>
                            <div className="px-5 py-4">
                                <p className="text-sm text-gray-700">{order.notes}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Refund Confirmation Dialog */}
            <ConfirmDialog
                open={showRefundConfirm}
                onClose={() => setShowRefundConfirm(false)}
                onConfirm={handleRefund}
                title="Confirm Refund"
                message={
                    <span>
                        Are you sure you want to refund{' '}
                        <strong>
                            &pound;
                            {refundForm.data.amount
                                ? parseFloat(refundForm.data.amount).toFixed(2)
                                : '0.00'}
                        </strong>{' '}
                        to the customer? This action cannot be undone.
                    </span>
                }
                confirmText="Issue Refund"
                variant="warning"
                loading={refundForm.processing}
            />
        </AdminLayout>
    );
}
