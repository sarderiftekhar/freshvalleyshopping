interface Props {
    status: string;
    type?: 'order' | 'payment' | 'product' | 'offer';
}

const colorMaps: Record<string, Record<string, string>> = {
    order: {
        pending: 'bg-yellow-100 text-yellow-700',
        confirmed: 'bg-blue-100 text-blue-700',
        preparing: 'bg-indigo-100 text-indigo-700',
        out_for_delivery: 'bg-purple-100 text-purple-700',
        delivered: 'bg-green-100 text-green-700',
        cancelled: 'bg-red-100 text-red-700',
    },
    payment: {
        pending: 'bg-yellow-100 text-yellow-700',
        paid: 'bg-green-100 text-green-700',
        failed: 'bg-red-100 text-red-700',
        refunded: 'bg-gray-100 text-gray-700',
    },
    product: {
        draft: 'bg-gray-100 text-gray-600',
        published: 'bg-green-100 text-green-700',
        out_of_stock: 'bg-red-100 text-red-700',
    },
    offer: {
        active: 'bg-green-100 text-green-700',
        inactive: 'bg-gray-100 text-gray-600',
        expired: 'bg-red-100 text-red-700',
        scheduled: 'bg-blue-100 text-blue-700',
    },
};

export default function StatusBadge({ status, type = 'order' }: Props) {
    const colors = colorMaps[type]?.[status] || 'bg-gray-100 text-gray-600';
    const label = status.replace(/_/g, ' ');

    return (
        <span className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-full capitalize ${colors}`}>
            {label}
        </span>
    );
}
