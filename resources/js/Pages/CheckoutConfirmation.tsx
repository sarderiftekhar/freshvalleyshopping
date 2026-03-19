import { Head, Link } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

interface OrderItem {
    id: number;
    product_name: string;
    quantity: number;
    price: string;
    total: string;
}

interface Order {
    id: number;
    order_number: string;
    status: string;
    total: string;
    subtotal: string;
    delivery_fee: string;
    created_at: string;
    items: OrderItem[];
    delivery_slot?: {
        date: string;
        start_time: string;
        end_time: string;
    };
}

interface Props {
    order: Order;
}

export default function CheckoutConfirmation({ order }: Props) {
    return (
        <StorefrontLayout>
            <Head title="Order Confirmed" />
            <div className="max-w-2xl mx-auto px-4 py-12">
                <div className="text-center mb-8">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
                    <p className="text-gray-600">Thank you for your order. We've received it and it's being processed.</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-6 space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b">
                        <div>
                            <p className="text-sm text-gray-500">Order Number</p>
                            <p className="text-lg font-semibold">{order.order_number}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Date</p>
                            <p className="text-sm font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-medium mb-3">Items</h3>
                        <div className="space-y-2">
                            {order.items.map(item => (
                                <div key={item.id} className="flex justify-between text-sm">
                                    <span>{item.product_name} x{item.quantity}</span>
                                    <span className="font-medium">£{Number(item.total).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border-t pt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Subtotal</span>
                            <span>£{Number(order.subtotal).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Delivery</span>
                            <span>£{Number(order.delivery_fee).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                            <span>Total</span>
                            <span>£{Number(order.total).toFixed(2)}</span>
                        </div>
                    </div>

                    {order.delivery_slot && (
                        <div className="bg-green-50 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-1">
                                <Package className="w-4 h-4 text-green-600" />
                                <p className="font-medium text-green-800">Delivery Scheduled</p>
                            </div>
                            <p className="text-sm text-green-700">{order.delivery_slot.date} ({order.delivery_slot.start_time} - {order.delivery_slot.end_time})</p>
                        </div>
                    )}
                </div>

                <div className="flex justify-center gap-4 mt-8">
                    <Link href={route('shop')} className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center gap-2">
                        Continue Shopping <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </StorefrontLayout>
    );
}
