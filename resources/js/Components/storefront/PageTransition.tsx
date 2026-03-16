import { ReactNode, useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Wraps the content area of a layout to animate only the page content
 * (not the header/nav) on navigation. Also shows a slim top loading bar.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
    const { url } = usePage();
    // Strip query params so filtering/search doesn't trigger full page animation
    const pageKey = url.split('?')[0];

    return (
        <>
            <NavigationProgress />
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

/** Slim animated progress bar at the very top of the viewport */
function NavigationProgress() {
    const [progress, setProgress] = useState(0);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;

        const removeStart = router.on('start', () => {
            setProgress(15);
            setVisible(true);
            interval = setInterval(() => {
                setProgress((p) => {
                    if (p >= 90) { clearInterval(interval); return 90; }
                    // Slow down as we approach 90
                    return p + (90 - p) * 0.1;
                });
            }, 100);
        });

        const removeFinish = router.on('finish', () => {
            clearInterval(interval);
            setProgress(100);
            setTimeout(() => {
                setVisible(false);
                setProgress(0);
            }, 300);
        });

        return () => {
            removeStart();
            removeFinish();
            clearInterval(interval);
        };
    }, []);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    className="fixed top-0 left-0 right-0 z-[9999] h-[3px]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <motion.div
                        className="h-full bg-gradient-to-r from-orfarm-green via-emerald-400 to-orfarm-green rounded-r-full shadow-[0_0_10px_rgba(16,98,7,0.5)]"
                        initial={{ width: '0%' }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
