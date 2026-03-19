import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import { Search, X } from 'lucide-react';

interface Props {
    value: string;
    route: string;
    placeholder?: string;
    params?: Record<string, any>;
}

export default function SearchInput({ value, route: routeName, placeholder = 'Search...', params = {} }: Props) {
    const [search, setSearch] = useState(value || '');

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (search !== (value || '')) {
                router.get(routeName, { ...params, search: search || undefined }, {
                    preserveState: true,
                    preserveScroll: true,
                });
            }
        }, 300);
        return () => clearTimeout(timeout);
    }, [search]);

    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-9 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orfarm-blue/20 focus:border-orfarm-blue"
            />
            {search && (
                <button
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                    <X className="size-4" />
                </button>
            )}
        </div>
    );
}
