import { Head } from '@inertiajs/react';
import SupplierLayout from '@/Layouts/SupplierLayout';
import { Package, FolderOpen, CheckCircle, TrendingUp } from 'lucide-react';
import { SupplierCategory } from '@/types';

interface Props {
    categories: (SupplierCategory & { active_products_count: number })[];
    totalProducts: number;
    activeProducts: number;
}

export default function Dashboard({ categories, totalProducts, activeProducts }: Props) {
    return (
        <SupplierLayout title="Dashboard">
            <Head title="Supplier Dashboard" />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard icon={FolderOpen} label="Categories" value={categories.length} color="bg-blue-500" />
                <StatCard icon={Package} label="Total Products" value={totalProducts} color="bg-orfarm-green" />
                <StatCard icon={CheckCircle} label="Active Products" value={activeProducts} color="bg-emerald-500" />
                <StatCard icon={TrendingUp} label="Inactive" value={totalProducts - activeProducts} color="bg-orange-500" />
            </div>

            {/* Category Overview */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-heading font-bold text-orfarm-blue">Product Categories</h2>
                    <p className="text-sm text-orfarm-body/60 mt-1">Overview of all supplier product categories</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0.5 bg-gray-100">
                    {categories.map((cat) => (
                        <a
                            key={cat.id}
                            href={`/supplier/products?category=${cat.id}`}
                            className="bg-white p-5 hover:bg-orfarm-grey/50 transition-colors group"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{cat.emoji}</span>
                                    <div>
                                        <h3 className="text-sm font-semibold text-orfarm-blue group-hover:text-orfarm-green transition-colors">
                                            {cat.name}
                                        </h3>
                                        <p className="text-xs text-orfarm-body/50 mt-0.5">
                                            {cat.products_count} items &middot; {cat.active_products_count} active
                                        </p>
                                    </div>
                                </div>
                                <span className="text-xs font-bold bg-orfarm-green/10 text-orfarm-green px-2.5 py-1 rounded-full">
                                    {cat.products_count}
                                </span>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </SupplierLayout>
    );
}

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: string }) {
    return (
        <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center`}>
                    <Icon className="size-5 text-white" />
                </div>
                <div>
                    <p className="text-2xl font-bold text-orfarm-blue">{value}</p>
                    <p className="text-xs text-orfarm-body/60 uppercase tracking-wide">{label}</p>
                </div>
            </div>
        </div>
    );
}
