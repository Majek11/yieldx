/** Reusable skeleton shimmer blocks */
export function SkeletonLine({ className = "" }: { className?: string }) {
    return <div className={`skeleton rounded-lg ${className}`} />;
}

export function SkeletonCard({ className = "" }: { className?: string }) {
    return <div className={`skeleton rounded-2xl ${className}`} />;
}

/** Full dashboard loading state */
export function DashboardSkeleton() {
    return (
        <div className="space-y-6 max-w-7xl mx-auto animate-pulse">
            {/* Greeting */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <SkeletonLine className="w-24 h-3" />
                    <SkeletonLine className="w-40 h-6" />
                </div>
                <SkeletonLine className="w-32 h-10 rounded-full hidden sm:block" />
            </div>

            {/* Balance card */}
            <SkeletonCard className="h-44" />

            {/* Stats row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => <SkeletonCard key={i} className="h-20" />)}
            </div>

            {/* Chart + alloc */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <SkeletonCard className="xl:col-span-2 h-64" />
                <SkeletonCard className="h-64" />
            </div>

            {/* Holdings + Tx */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <SkeletonCard className="xl:col-span-2 h-48" />
                <SkeletonCard className="h-48" />
            </div>
        </div>
    );
}
