import { Head, Link } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import { MailX } from 'lucide-react';

export default function NewsletterUnsubscribed() {
    return (
        <StorefrontLayout>
            <Head title="Unsubscribed" />
            <div className="max-w-md mx-auto px-4 py-16 text-center">
                <MailX className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Unsubscribed</h1>
                <p className="text-gray-600 mb-6">You've been successfully unsubscribed from our newsletter. You won't receive any more marketing emails from us.</p>
                <Link href={route('home')} className="inline-flex px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    Back to Home
                </Link>
            </div>
        </StorefrontLayout>
    );
}
