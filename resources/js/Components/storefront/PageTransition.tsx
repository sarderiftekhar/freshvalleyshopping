import { ReactNode, useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

export default function PageTransition({ children }: { children: ReactNode }) {
    const [transitioning, setTransitioning] = useState(false);

    useEffect(() => {
        const removeStart = router.on('start', () => setTransitioning(true));
        const removeFinish = router.on('finish', () => {
            setTimeout(() => setTransitioning(false), 50);
        });

        return () => {
            removeStart();
            removeFinish();
        };
    }, []);

    return (
        <div
            className={`transition-all duration-300 ease-in-out ${
                transitioning ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'
            }`}
        >
            {children}
        </div>
    );
}
