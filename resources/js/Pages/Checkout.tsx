import { Head, useForm } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import { useState } from 'react';
import { MapPin, Truck, CreditCard, Check } from 'lucide-react';

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    options?: any;
}

interface Address {
    id: number;
    line_1: string;
    line_2?: string;
    city: string;
    postcode: string;
}

interface DeliverySlot {
    id: number;
    date: string;
    start_time: string;
    end_time: string;
    delivery_fee: string;
    max_orders: number;
    current_orders: number;
}

interface Props {
    cart: CartItem[];
    addresses: Address[];
    deliverySlots: DeliverySlot[];
    stripeKey: string;
}

export default function Checkout({ cart, addresses, deliverySlots, stripeKey }: Props) {
    const [step, setStep] = useState(1);
    const [clientSecret, setClientSecret] = useState('');
    const [paymentError, setPaymentError] = useState('');

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const form = useForm({
        address_id: addresses[0]?.id || '',
        delivery_slot_id: '',
        payment_intent_id: '',
        delivery_address: {
            line_1: '',
            line_2: '',
            city: '',
            postcode: '',
        },
    });

    const selectedSlot = deliverySlots.find(s => s.id === Number(form.data.delivery_slot_id));
    const deliveryFee = selectedSlot ? Number(selectedSlot.delivery_fee) : 0;
    const total = subtotal + deliveryFee;

    const steps = [
        { num: 1, label: 'Address', icon: MapPin },
        { num: 2, label: 'Delivery', icon: Truck },
        { num: 3, label: 'Payment', icon: CreditCard },
        { num: 4, label: 'Confirm', icon: Check },
    ];

    const handlePayment = async () => {
        try {
            const res = await fetch(route('checkout.payment-intent'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '',
                },
                body: JSON.stringify({ delivery_fee: deliveryFee }),
            });
            const data = await res.json();
            if (data.clientSecret) {
                setClientSecret(data.clientSecret);
                // In production, integrate Stripe Elements here
                // For now, simulate by storing the payment intent id
                form.setData('payment_intent_id', data.clientSecret.split('_secret_')[0]);
                setStep(4);
            } else {
                setPaymentError(data.error || 'Payment setup failed');
            }
        } catch {
            setPaymentError('Payment setup failed. Please try again.');
        }
    };

    const handleSubmit = () => {
        form.post(route('checkout.store'));
    };

    return (
        <StorefrontLayout>
            <Head title="Checkout" />
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Steps */}
                <div className="flex items-center justify-center mb-8">
                    {steps.map((s, i) => (
                        <div key={s.num} className="flex items-center">
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${step >= s.num ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                <s.icon className="w-4 h-4" />
                                {s.label}
                            </div>
                            {i < steps.length - 1 && <div className={`w-8 h-0.5 mx-1 ${step > s.num ? 'bg-green-600' : 'bg-gray-200'}`} />}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        {/* Step 1: Address */}
                        {step === 1 && (
                            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
                                <h2 className="text-lg font-semibold">Delivery Address</h2>
                                {addresses.length > 0 && (
                                    <div className="space-y-3">
                                        <p className="text-sm text-gray-600">Select an existing address:</p>
                                        {addresses.map(addr => (
                                            <label key={addr.id} className={`block p-4 border rounded-lg cursor-pointer ${Number(form.data.address_id) === addr.id ? 'border-green-600 bg-green-50' : 'hover:border-gray-400'}`}>
                                                <input type="radio" name="address" value={addr.id} checked={Number(form.data.address_id) === addr.id} onChange={() => form.setData('address_id', addr.id)} className="sr-only" />
                                                <p className="font-medium">{addr.line_1}</p>
                                                {addr.line_2 && <p className="text-sm text-gray-600">{addr.line_2}</p>}
                                                <p className="text-sm text-gray-600">{addr.city}, {addr.postcode}</p>
                                            </label>
                                        ))}
                                    </div>
                                )}
                                <div className="border-t pt-4">
                                    <p className="text-sm font-medium text-gray-700 mb-3">Or enter a new address:</p>
                                    <div className="space-y-3">
                                        <input type="text" placeholder="Address Line 1" value={form.data.delivery_address.line_1} onChange={e => form.setData('delivery_address', { ...form.data.delivery_address, line_1: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
                                        <input type="text" placeholder="Address Line 2" value={form.data.delivery_address.line_2} onChange={e => form.setData('delivery_address', { ...form.data.delivery_address, line_2: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
                                        <div className="grid grid-cols-2 gap-3">
                                            <input type="text" placeholder="City" value={form.data.delivery_address.city} onChange={e => form.setData('delivery_address', { ...form.data.delivery_address, city: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
                                            <input type="text" placeholder="Postcode" value={form.data.delivery_address.postcode} onChange={e => form.setData('delivery_address', { ...form.data.delivery_address, postcode: e.target.value })} className="w-full border rounded-lg px-3 py-2" />
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setStep(2)} className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700">Continue to Delivery</button>
                            </div>
                        )}

                        {/* Step 2: Delivery Slot */}
                        {step === 2 && (
                            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
                                <h2 className="text-lg font-semibold">Choose Delivery Slot</h2>
                                <div className="space-y-3">
                                    {deliverySlots.map(slot => (
                                        <label key={slot.id} className={`block p-4 border rounded-lg cursor-pointer ${Number(form.data.delivery_slot_id) === slot.id ? 'border-green-600 bg-green-50' : 'hover:border-gray-400'}`}>
                                            <input type="radio" name="slot" value={slot.id} checked={Number(form.data.delivery_slot_id) === slot.id} onChange={() => form.setData('delivery_slot_id', String(slot.id))} className="sr-only" />
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="font-medium">{slot.date}</p>
                                                    <p className="text-sm text-gray-600">{slot.start_time} - {slot.end_time}</p>
                                                </div>
                                                <p className="font-medium text-green-600">£{Number(slot.delivery_fee).toFixed(2)}</p>
                                            </div>
                                        </label>
                                    ))}
                                    {deliverySlots.length === 0 && (
                                        <p className="text-gray-500 text-center py-8">No delivery slots available at the moment.</p>
                                    )}
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => setStep(1)} className="flex-1 py-3 border rounded-lg font-medium hover:bg-gray-50">Back</button>
                                    <button onClick={() => setStep(3)} className="flex-1 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700">Continue to Payment</button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Payment */}
                        {step === 3 && (
                            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
                                <h2 className="text-lg font-semibold">Payment</h2>
                                <p className="text-sm text-gray-600">Your payment will be processed securely via Stripe.</p>
                                {/* Stripe Elements would be mounted here in production */}
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
                                    <CreditCard className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                                    <p className="font-medium">Stripe Payment Form</p>
                                    <p className="text-sm">Card details will be collected securely by Stripe</p>
                                </div>
                                {paymentError && <p className="text-red-600 text-sm">{paymentError}</p>}
                                <div className="flex gap-3">
                                    <button onClick={() => setStep(2)} className="flex-1 py-3 border rounded-lg font-medium hover:bg-gray-50">Back</button>
                                    <button onClick={handlePayment} className="flex-1 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700">Pay £{total.toFixed(2)}</button>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Confirm */}
                        {step === 4 && (
                            <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
                                <h2 className="text-lg font-semibold">Confirm Order</h2>
                                <p className="text-sm text-gray-600">Please review your order details before placing.</p>
                                <div className="border rounded-lg p-4 bg-green-50">
                                    <p className="text-green-700 font-medium flex items-center gap-2"><Check className="w-5 h-5" /> Payment authorized</p>
                                </div>
                                <button onClick={handleSubmit} disabled={form.processing} className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50">
                                    {form.processing ? 'Placing Order...' : 'Place Order'}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-4">
                            <h3 className="font-semibold mb-4">Order Summary</h3>
                            <div className="space-y-3 mb-4">
                                {cart.map(item => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <span className="text-gray-600">{item.name} x{item.quantity}</span>
                                        <span className="font-medium">£{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t pt-3 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span>£{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Delivery</span>
                                    <span>£{deliveryFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                                    <span>Total</span>
                                    <span>£{total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </StorefrontLayout>
    );
}
