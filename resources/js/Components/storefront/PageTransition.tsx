import { ReactNode, useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Wraps the content area of a layout to animate only the page content
 * (not the header/nav) on navigation. Also shows a branded loading overlay.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
    const { url } = usePage();
    const pageKey = url.split('?')[0];

    return (
        <>
            <LoadingOverlay />
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={pageKey}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{
                        duration: 0.2,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                >
                    {children}
                </motion.div>
            </AnimatePresence>
        </>
    );
}

function LoadingOverlay() {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const removeStart = router.on('start', () => setLoading(true));
        const removeFinish = router.on('finish', () => setLoading(false));
        return () => { removeStart(); removeFinish(); };
    }, []);

    return (
        <AnimatePresence>
            {loading && (
                <>
                    {/* Top progress bar */}
                    <motion.div
                        className="fixed top-0 left-0 right-0 z-[9999] h-[3px]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                    >
                        <motion.div
                            className="h-full bg-gradient-to-r from-orfarm-green via-emerald-400 to-orfarm-green rounded-r-full shadow-[0_0_10px_rgba(16,98,7,0.5)]"
                            initial={{ width: '0%' }}
                            animate={{ width: '90%' }}
                            transition={{ duration: 8, ease: 'easeOut' }}
                        />
                    </motion.div>

                    {/* Overlay with spinner */}
                    <motion.div
                        className="fixed inset-0 z-[9998] flex items-center justify-center bg-white/60 backdrop-blur-[2px]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                    >
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative overflow-hidden w-40 h-20 flex items-center justify-center">
                                {/* Cart icon driving across */}
                                <div className="relative spinner-drive">
                                    {/* Speed lines */}
                                    <span className="speed-line" />
                                    <span className="speed-line" />
                                    <span className="speed-line" />
                                    <img
                                        src="/assets/img/spinner.png"
                                        alt="Loading..."
                                        className="w-16 h-16 object-contain"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-sm font-medium text-orfarm-green tracking-wide">Loading</span>
                                <span className="flex gap-0.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-orfarm-green animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-1.5 h-1.5 rounded-full bg-orfarm-green animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-1.5 h-1.5 rounded-full bg-orfarm-green animate-bounce" style={{ animationDelay: '300ms' }} />
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
