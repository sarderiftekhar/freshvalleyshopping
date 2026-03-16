import '../css/app.css';
import 'react-toastify/dist/ReactToastify.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { CartProvider } from '@/context/CartContext';
import { ToastContainer } from 'react-toastify';
import CartSidebar from '@/Components/storefront/CartSidebar';
import PageTransition from '@/Components/storefront/PageTransition';

const appName = import.meta.env.VITE_APP_NAME || 'Fresh Valley';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <CartProvider>
                <PageTransition>
                    <App {...props} />
                </PageTransition>
                <CartSidebar />
                <ToastContainer
                    position="top-center"
                    autoClose={2500}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    pauseOnFocusLoss={false}
                    draggable
                    pauseOnHover
                    theme="colored"
                />
            </CartProvider>
        );
    },
    progress: {
        color: '#106207',
    },
});
