import { LucideIcon } from 'lucide-react';

interface Props {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: string;
    color?: 'blue' | 'green' | 'orange' | 'red' | 'purple' | 'indigo';
}

const colorMap = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600',
    indigo: 'bg-indigo-50 text-indigo-600',
};

export default function StatCard({ title, value, icon: Icon, trend, color = 'blue' }: Props) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="mt-1.5 text-2xl font-bold text-gray-900">{value}</p>
                    {trend && (
                        <p className="mt-1 text-xs text-gray-500">{trend}</p>
                    )}
                </div>
                <div className={`p-2.5 rounded-lg ${colorMap[color]}`}>
                    <Icon className="size-5" />
                </div>
            </div>
        </div>
    );
}
