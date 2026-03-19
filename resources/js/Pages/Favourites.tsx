import { Head, Link, router } from '@inertiajs/react';
import StorefrontLayout from '@/Layouts/StorefrontLayout';
import { Heart, ShoppingCart } from 'lucide-react';

interface ProductImage {
    id: number;
    image_path: string;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    price: string;
    sale_price?: string;
    images: ProductImage[];
}

interface Props {
    favourites: {
        data: Product[];
        links: any[];
    };
}

export default function Favourites({ favourites }: Props) {
    const removeFavourite = (productId: number) => {
        router.post(route('favourites.toggle'), { product_id: productId }, { preserveScroll: true });
    };

    return (
        <StorefrontLayout>
            <Head title="My Favourites" />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">My Favourites</h1>

                {favourites.data.length === 0 ? (
                    <div className="text-center py-16">
                        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-xl font-medium text-gray-600 mb-2">No favourites yet</h2>
                        <p className="text-gray-500 mb-6">Browse our shop and add items to your favourites.</p>
                        <Link href={route('shop')} className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
                            <ShoppingCart className="w-4 h-4" /> Browse Shop
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {favourites.data.map(product => (
                            <div key={product.id} className="bg-white rounded-xl shadow-sm border overflow-hidden group">
                                <Link href={route('product.show', product.slug)} className="block">
                                    <div className="aspect-square bg-gray-100 relative overflow-hidden">
                                        {product.images[0] ? (
                                            <img src={`/storage/${product.images[0].image_path}`} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
                                        )}
                                    </div>
                                </Link>
                                <div className="p-3">
                                    <Link href={route('product.show', product.slug)}>
                                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-green-600">{product.name}</h3>
                                    </Link>
                                    <div className="flex items-center justify-between mt-2">
                                        <div>
                                            {product.sale_price ? (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-green-600 font-semibold">£{Number(product.sale_price).toFixed(2)}</span>
                                                    <span className="text-gray-400 text-xs line-through">£{Number(product.price).toFixed(2)}</span>
                                                </div>
                                            ) : (
                                                <span className="font-semibold">£{Number(product.price).toFixed(2)}</span>
                                            )}
                                        </div>
                                        <button onClick={() => removeFavourite(product.id)} className="text-red-500 hover:text-red-700 p-1">
                                            <Heart className="w-5 h-5 fill-current" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </StorefrontLayout>
    );
}
