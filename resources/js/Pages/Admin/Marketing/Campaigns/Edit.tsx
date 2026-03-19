import { FormEvent } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft, Users } from 'lucide-react';

interface Campaign {
    id: number;
    name: string;
    subject: string;
    body_html: string;
    audience: 'all_customers' | 'subscribers';
    status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
    scheduled_at: string | null;
}

interface Props {
    campaign: Campaign;
    subscriberCount: number;
    customerCount: number;
}

export default function CampaignEdit({ campaign, subscriberCount, customerCount }: Props) {
    const formatDateForInput = (dateStr: string | null) => {
        if (!dateStr) return '';
        return new Date(dateStr).toISOString().slice(0, 16);
    };

    const { data, setData, put, processing, errors } = useForm({
        name: campaign.name,
        subject: campaign.subject,
        body_html: campaign.body_html || '',
        audience: campaign.audience,
        scheduled_at: formatDateForInput(campaign.scheduled_at),
    });

    const recipientCount = data.audience === 'subscribers' ? subscriberCount : customerCount;
    const isEditable = campaign.status === 'draft' || campaign.status === 'scheduled';

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(`/admin/marketing/campaigns/${campaign.id}`);
    };

    const inputClass = "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orfarm-blue/20 focus:border-orfarm-blue";
    const labelClass = "block text-sm font-medium text-gray-700 mb-1";
    const errorClass = "text-xs text-red-500 mt-1";

    return (
        <AdminLayout title={`Edit Campaign: ${campaign.name}`}>
            <Head title={`Edit Campaign: ${campaign.name}`} />

            <div className="mb-6">
                <Link
                    href="/admin/marketing/campaigns"
                    className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-orfarm-blue transition-colors"
                >
                    <ArrowLeft className="size-4" />
                    Back to Campaigns
                </Link>
            </div>

            {!isEditable && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-700">
                        This campaign has already been {campaign.status} and cannot be edited.
                    </p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
                {/* Campaign Details */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Campaign Details</h2>
                    <div className="space-y-4">
                        <div>
                            <label className={labelClass}>Campaign Name *</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className={inputClass}
                                disabled={!isEditable}
                            />
                            {errors.name && <p className={errorClass}>{errors.name}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Email Subject *</label>
                            <input
                                type="text"
                                value={data.subject}
                                onChange={(e) => setData('subject', e.target.value)}
                                className={inputClass}
                                disabled={!isEditable}
                            />
                            {errors.subject && <p className={errorClass}>{errors.subject}</p>}
                        </div>
                    </div>
                </div>

                {/* Audience */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Audience</h2>
                    <div className="space-y-4">
                        <div>
                            <label className={labelClass}>Send To *</label>
                            <select
                                value={data.audience}
                                onChange={(e) => setData('audience', e.target.value as 'all_customers' | 'subscribers')}
                                className={inputClass}
                                disabled={!isEditable}
                            >
                                <option value="all_customers">All Customers ({customerCount})</option>
                                <option value="subscribers">Newsletter Subscribers ({subscriberCount})</option>
                            </select>
                            {errors.audience && <p className={errorClass}>{errors.audience}</p>}
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <Users className="size-4 text-blue-600 shrink-0" />
                            <p className="text-sm text-blue-700">
                                This campaign will be sent to <strong>{recipientCount.toLocaleString()}</strong> recipients.
                            </p>
                        </div>
                        <div>
                            <label className={labelClass}>Schedule (optional)</label>
                            <input
                                type="datetime-local"
                                value={data.scheduled_at}
                                onChange={(e) => setData('scheduled_at', e.target.value)}
                                className={inputClass}
                                disabled={!isEditable}
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                Leave empty to save as draft. Set a date to schedule the campaign.
                            </p>
                            {errors.scheduled_at && <p className={errorClass}>{errors.scheduled_at}</p>}
                        </div>
                    </div>
                </div>

                {/* Email Body */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Email Body (HTML)</h2>
                    <div>
                        <textarea
                            value={data.body_html}
                            onChange={(e) => setData('body_html', e.target.value)}
                            rows={16}
                            className={`${inputClass} font-mono text-xs leading-relaxed`}
                            disabled={!isEditable}
                        />
                        {errors.body_html && <p className={errorClass}>{errors.body_html}</p>}
                        <p className="text-xs text-gray-400 mt-2">
                            You can use HTML tags to format your email. Common tags: &lt;h1&gt;, &lt;p&gt;, &lt;a&gt;, &lt;img&gt;, &lt;strong&gt;, &lt;em&gt;
                        </p>
                    </div>
                </div>

                {/* Actions */}
                {isEditable && (
                    <div className="flex items-center gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-3 bg-orfarm-blue text-white rounded-lg font-medium hover:bg-orfarm-blue/90 disabled:opacity-50"
                        >
                            {processing ? 'Saving...' : 'Update Campaign'}
                        </button>
                        <Link
                            href="/admin/marketing/campaigns"
                            className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </Link>
                    </div>
                )}
            </form>
        </AdminLayout>
    );
}
