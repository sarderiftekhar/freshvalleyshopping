import { FormEvent, useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Save, Mail, Send } from 'lucide-react';

interface Props {
    settings: {
        mail_from_name: string;
        mail_from_address: string;
        mail_reply_to: string;
    };
}

export default function Email({ settings }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        mail_from_name: settings.mail_from_name || '',
        mail_from_address: settings.mail_from_address || '',
        mail_reply_to: settings.mail_reply_to || '',
    });

    const [testEmail, setTestEmail] = useState('');
    const [sendingTest, setSendingTest] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/admin/settings/email');
    };

    const handleTestEmail = (e: FormEvent) => {
        e.preventDefault();
        if (!testEmail) return;

        setSendingTest(true);
        router.post(
            '/admin/settings/email/test',
            { email: testEmail },
            {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => setSendingTest(false),
            }
        );
    };

    const inputClass =
        'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orfarm-blue/20 focus:border-orfarm-blue';
    const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
    const errorClass = 'text-xs text-red-500 mt-1';

    return (
        <AdminLayout title="Email Settings">
            <Head title="Email Settings" />

            {/* Settings Navigation Tabs */}
            <div className="flex gap-1 mb-6 bg-white rounded-lg border border-gray-200 p-1 w-fit">
                {[
                    { label: 'General', href: '/admin/settings/general', active: false },
                    { label: 'Delivery', href: '/admin/settings/delivery', active: false },
                    { label: 'Payment', href: '/admin/settings/payment', active: false },
                    { label: 'Email', href: '/admin/settings/email', active: true },
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

            <div className="max-w-2xl space-y-6">
                {/* Email Settings Form */}
                <form onSubmit={handleSubmit}>
                    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
                        <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
                            <Mail className="size-5 text-gray-400" />
                            <h2 className="text-lg font-semibold text-gray-900">
                                Email Settings
                            </h2>
                        </div>

                        {/* From Name */}
                        <div>
                            <label className={labelClass}>From Name</label>
                            <input
                                type="text"
                                value={data.mail_from_name}
                                onChange={(e) => setData('mail_from_name', e.target.value)}
                                className={inputClass}
                                placeholder="Fresh Valley Shopping"
                            />
                            {errors.mail_from_name && (
                                <p className={errorClass}>{errors.mail_from_name}</p>
                            )}
                        </div>

                        {/* From Address */}
                        <div>
                            <label className={labelClass}>From Email Address</label>
                            <input
                                type="email"
                                value={data.mail_from_address}
                                onChange={(e) =>
                                    setData('mail_from_address', e.target.value)
                                }
                                className={inputClass}
                                placeholder="noreply@freshvalley.co.uk"
                            />
                            {errors.mail_from_address && (
                                <p className={errorClass}>{errors.mail_from_address}</p>
                            )}
                        </div>

                        {/* Reply To */}
                        <div>
                            <label className={labelClass}>Reply-To Address</label>
                            <input
                                type="email"
                                value={data.mail_reply_to}
                                onChange={(e) => setData('mail_reply_to', e.target.value)}
                                className={inputClass}
                                placeholder="support@freshvalley.co.uk"
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                Replies from customers will be sent to this address.
                            </p>
                            {errors.mail_reply_to && (
                                <p className={errorClass}>{errors.mail_reply_to}</p>
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

                {/* Test Email Section */}
                <form onSubmit={handleTestEmail}>
                    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
                        <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
                            <Send className="size-5 text-gray-400" />
                            <h2 className="text-lg font-semibold text-gray-900">
                                Send Test Email
                            </h2>
                        </div>

                        <p className="text-sm text-gray-500">
                            Send a test email to verify your email configuration is working
                            correctly.
                        </p>

                        <div className="flex gap-3">
                            <input
                                type="email"
                                value={testEmail}
                                onChange={(e) => setTestEmail(e.target.value)}
                                className={inputClass}
                                placeholder="test@example.com"
                                required
                            />
                            <button
                                type="submit"
                                disabled={sendingTest || !testEmail}
                                className="inline-flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors whitespace-nowrap"
                            >
                                <Send className="size-4" />
                                {sendingTest ? 'Sending...' : 'Send Test'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
