import { FormEvent } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Save, Truck } from 'lucide-react';

interface Props {
    settings: {
        default_delivery_fee: string;
        free_delivery_threshold: string;
        minimum_order: string;
        delivery_zones: string;
    };
}

export default function Delivery({ settings }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        default_delivery_fee: settings.default_delivery_fee || '',
        free_delivery_threshold: settings.free_delivery_threshold || '',
        minimum_order: settings.minimum_order || '',
        delivery_zones: settings.delivery_zones || '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/admin/settings/delivery');
    };

    const inputClass =
        'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orfarm-blue/20 focus:border-orfarm-blue';
    const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
    const errorClass = 'text-xs text-red-500 mt-1';

    return (
        <AdminLayout title="Delivery Settings">
            <Head title="Delivery Settings" />

            {/* Settings Navigation Tabs */}
            <div className="flex gap-1 mb-6 bg-white rounded-lg border border-gray-200 p-1 w-fit">
                {[
                    { label: 'General', href: '/admin/settings/general', active: false },
                    { label: 'Delivery', href: '/admin/settings/delivery', active: true },
                    { label: 'Payment', href: '/admin/settings/payment', active: false },
                    { label: 'Email', href: '/admin/settings/email', active: false },
                ].map((tab) => (
                    <a
                        key={tab.label}
                        href={tab.href}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            tab.active
                                ? 'bg-orfarm-blue text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        {tab.label}
                    </a>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="max-w-2xl">
                <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
                    <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
                        <Truck className="size-5 text-gray-400" />
                        <h2 className="text-lg font-semibold text-gray-900">
                            Delivery Settings
                        </h2>
                    </div>

                    {/* Default Delivery Fee */}
                    <div>
                        <label className={labelClass}>Default Delivery Fee (&pound;)</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={data.default_delivery_fee}
                            onChange={(e) => setData('default_delivery_fee', e.target.value)}
                            className={inputClass}
                            placeholder="3.99"
                        />
                        {errors.default_delivery_fee && (
                            <p className={errorClass}>{errors.default_delivery_fee}</p>
                        )}
                    </div>

                    {/* Free Delivery Threshold */}
                    <div>
                        <label className={labelClass}>
                            Free Delivery Threshold (&pound;)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={data.free_delivery_threshold}
                            onChange={(e) =>
                                setData('free_delivery_threshold', e.target.value)
                            }
                            className={inputClass}
                            placeholder="40.00"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            Orders above this amount qualify for free delivery. Leave empty to
                            disable.
                        </p>
                        {errors.free_delivery_threshold && (
                            <p className={errorClass}>{errors.free_delivery_threshold}</p>
                        )}
                    </div>

                    {/* Minimum Order */}
                    <div>
                        <label className={labelClass}>Minimum Order Amount (&pound;)</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={data.minimum_order}
                            onChange={(e) => setData('minimum_order', e.target.value)}
                            className={inputClass}
                            placeholder="10.00"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            Customers must meet this minimum to place an order.
                        </p>
                        {errors.minimum_order && (
                            <p className={errorClass}>{errors.minimum_order}</p>
                        )}
                    </div>

                    {/* Delivery Zones */}
                    <div>
                        <label className={labelClass}>Delivery Zones / Postcodes</label>
                        <textarea
                            value={data.delivery_zones}
                            onChange={(e) => setData('delivery_zones', e.target.value)}
                            rows={5}
                            className={inputClass}
                            placeholder="E1, E2, E3, N1, N4, SW1..."
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            Enter postcode areas or zones you deliver to, separated by commas.
                        </p>
                        {errors.delivery_zones && (
                            <p className={errorClass}>{errors.delivery_zones}</p>
                        )}
                    </div>

                    {/* Submit */}
                    <div className="pt-4 border-t border-gray-100">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-orfarm-blue text-white rounded-lg text-sm font-medium hover:bg-orfarm-blue/90 disabled:opacity-50 transition-colors"
                        >
                            <Save className="size-4" />
                            {processing ? 'Saving...' : 'Save Settings'}
                        </button>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
