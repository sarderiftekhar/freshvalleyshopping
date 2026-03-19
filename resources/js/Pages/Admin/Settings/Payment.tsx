import { FormEvent } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Save, CreditCard } from 'lucide-react';

interface Props {
    settings: {
        stripe_public_key: string;
        stripe_secret_key: string;
        stripe_webhook_secret: string;
        currency: string;
    };
}

export default function Payment({ settings }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        stripe_public_key: settings.stripe_public_key || '',
        stripe_secret_key: settings.stripe_secret_key || '',
        stripe_webhook_secret: settings.stripe_webhook_secret || '',
        currency: settings.currency || 'GBP',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/admin/settings/payment');
    };

    const inputClass =
        'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orfarm-blue/20 focus:border-orfarm-blue';
    const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
    const errorClass = 'text-xs text-red-500 mt-1';

    return (
        <AdminLayout title="Payment Settings">
            <Head title="Payment Settings" />

            {/* Settings Navigation Tabs */}
            <div className="flex gap-1 mb-6 bg-white rounded-lg border border-gray-200 p-1 w-fit">
                {[
                    { label: 'General', href: '/admin/settings/general', active: false },
                    { label: 'Delivery', href: '/admin/settings/delivery', active: false },
                    { label: 'Payment', href: '/admin/settings/payment', active: true },
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
                        <CreditCard className="size-5 text-gray-400" />
                        <h2 className="text-lg font-semibold text-gray-900">
                            Payment Settings
                        </h2>
                    </div>

                    {/* Info Banner */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <p className="text-sm text-amber-800">
                            Stripe API keys are sensitive. The secret key is masked for security.
                            Enter a new value to update it.
                        </p>
                    </div>

                    {/* Stripe Public Key */}
                    <div>
                        <label className={labelClass}>Stripe Publishable Key</label>
                        <input
                            type="text"
                            value={data.stripe_public_key}
                            onChange={(e) => setData('stripe_public_key', e.target.value)}
                            className={inputClass}
                            placeholder="pk_live_..."
                        />
                        {errors.stripe_public_key && (
                            <p className={errorClass}>{errors.stripe_public_key}</p>
                        )}
                    </div>

                    {/* Stripe Secret Key */}
                    <div>
                        <label className={labelClass}>Stripe Secret Key</label>
                        <input
                            type="password"
                            value={data.stripe_secret_key}
                            onChange={(e) => setData('stripe_secret_key', e.target.value)}
                            className={inputClass}
                            placeholder="sk_live_..."
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            Leave blank to keep the current key unchanged.
                        </p>
                        {errors.stripe_secret_key && (
                            <p className={errorClass}>{errors.stripe_secret_key}</p>
                        )}
                    </div>

                    {/* Stripe Webhook Secret */}
                    <div>
                        <label className={labelClass}>Stripe Webhook Secret</label>
                        <input
                            type="password"
                            value={data.stripe_webhook_secret}
                            onChange={(e) =>
                                setData('stripe_webhook_secret', e.target.value)
                            }
                            className={inputClass}
                            placeholder="whsec_..."
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            Leave blank to keep the current secret unchanged.
                        </p>
                        {errors.stripe_webhook_secret && (
                            <p className={errorClass}>{errors.stripe_webhook_secret}</p>
                        )}
                    </div>

                    {/* Currency */}
                    <div>
                        <label className={labelClass}>Currency</label>
                        <select
                            value={data.currency}
                            onChange={(e) => setData('currency', e.target.value)}
                            className={inputClass}
                        >
                            <option value="GBP">GBP - British Pound</option>
                            <option value="USD">USD - US Dollar</option>
                            <option value="EUR">EUR - Euro</option>
                        </select>
                        {errors.currency && <p className={errorClass}>{errors.currency}</p>}
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
