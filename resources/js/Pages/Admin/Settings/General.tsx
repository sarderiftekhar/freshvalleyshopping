import { FormEvent, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Save, Upload, X, Settings } from 'lucide-react';

interface Props {
    settings: {
        site_name: string;
        site_tagline: string;
        contact_email: string;
        contact_phone: string;
        address: string;
        site_logo: string;
    };
}

export default function General({ settings }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        site_name: settings.site_name || '',
        site_tagline: settings.site_tagline || '',
        contact_email: settings.contact_email || '',
        contact_phone: settings.contact_phone || '',
        address: settings.address || '',
        site_logo: null as File | null,
    });

    const [logoPreview, setLogoPreview] = useState<string | null>(
        settings.site_logo ? `/storage/${settings.site_logo}` : null
    );

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/admin/settings/general', {
            forceFormData: true,
        });
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setData('site_logo', file);
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setLogoPreview(ev.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeLogo = () => {
        setData('site_logo', null);
        setLogoPreview(null);
    };

    const inputClass =
        'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orfarm-blue/20 focus:border-orfarm-blue';
    const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
    const errorClass = 'text-xs text-red-500 mt-1';

    return (
        <AdminLayout title="General Settings">
            <Head title="General Settings" />

            {/* Settings Navigation Tabs */}
            <div className="flex gap-1 mb-6 bg-white rounded-lg border border-gray-200 p-1 w-fit">
                {[
                    { label: 'General', href: '/admin/settings/general', active: true },
                    { label: 'Delivery', href: '/admin/settings/delivery', active: false },
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
                        <Settings className="size-5 text-gray-400" />
                        <h2 className="text-lg font-semibold text-gray-900">
                            General Settings
                        </h2>
                    </div>

                    {/* Site Name */}
                    <div>
                        <label className={labelClass}>Site Name</label>
                        <input
                            type="text"
                            value={data.site_name}
                            onChange={(e) => setData('site_name', e.target.value)}
                            className={inputClass}
                            placeholder="Fresh Valley Shopping"
                        />
                        {errors.site_name && <p className={errorClass}>{errors.site_name}</p>}
                    </div>

                    {/* Tagline */}
                    <div>
                        <label className={labelClass}>Site Tagline</label>
                        <input
                            type="text"
                            value={data.site_tagline}
                            onChange={(e) => setData('site_tagline', e.target.value)}
                            className={inputClass}
                            placeholder="Fresh groceries delivered to your door"
                        />
                        {errors.site_tagline && (
                            <p className={errorClass}>{errors.site_tagline}</p>
                        )}
                    </div>

                    {/* Contact Email */}
                    <div>
                        <label className={labelClass}>Contact Email</label>
                        <input
                            type="email"
                            value={data.contact_email}
                            onChange={(e) => setData('contact_email', e.target.value)}
                            className={inputClass}
                            placeholder="info@freshvalley.co.uk"
                        />
                        {errors.contact_email && (
                            <p className={errorClass}>{errors.contact_email}</p>
                        )}
                    </div>

                    {/* Contact Phone */}
                    <div>
                        <label className={labelClass}>Contact Phone</label>
                        <input
                            type="text"
                            value={data.contact_phone}
                            onChange={(e) => setData('contact_phone', e.target.value)}
                            className={inputClass}
                            placeholder="+44 20 1234 5678"
                        />
                        {errors.contact_phone && (
                            <p className={errorClass}>{errors.contact_phone}</p>
                        )}
                    </div>

                    {/* Address */}
                    <div>
                        <label className={labelClass}>Address</label>
                        <textarea
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            rows={3}
                            className={inputClass}
                            placeholder="123 High Street, London, UK"
                        />
                        {errors.address && <p className={errorClass}>{errors.address}</p>}
                    </div>

                    {/* Site Logo */}
                    <div>
                        <label className={labelClass}>Site Logo</label>
                        <div className="flex items-start gap-4">
                            {logoPreview ? (
                                <div className="relative group">
                                    <img
                                        src={logoPreview}
                                        alt="Site logo"
                                        className="h-20 w-auto rounded-lg border border-gray-200 object-contain bg-white p-1"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeLogo}
                                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="size-3" />
                                    </button>
                                </div>
                            ) : null}
                            <label className="flex flex-col items-center justify-center w-40 h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orfarm-blue hover:bg-blue-50/50 transition-colors">
                                <Upload className="size-5 text-gray-400 mb-1" />
                                <span className="text-xs text-gray-500">Upload Logo</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                        {errors.site_logo && <p className={errorClass}>{errors.site_logo}</p>}
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
