'use client';

import { motion } from 'framer-motion';

export const Skeleton = ({ width = '100%', height = '20px', borderRadius = '4px', className = '' }) => {
    return (
        <div className={`skeleton-loader ${className}`} style={{ width, height, borderRadius }}>
            <style jsx>{`
                .skeleton-loader {
                    background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
                    background-size: 200% 100%;
                    animation: shimmer 1.5s infinite;
                }
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>
        </div>
    );
};

export const CardSkeleton = () => (
    <div className="card space-y-4">
        <Skeleton height="24px" width="60%" />
        <Skeleton height="48px" width="100%" />
        <div className="flex gap-2">
            <Skeleton height="32px" width="40%" />
            <Skeleton height="32px" width="40%" />
        </div>
    </div>
);
