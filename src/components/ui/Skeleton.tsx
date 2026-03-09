export function CardSkeleton() {
    return (
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            <div className="skeleton h-52 w-full" />
            <div className="p-4 space-y-3">
                <div className="skeleton h-7 w-2/3 rounded-lg" />
                <div className="skeleton h-4 w-1/2 rounded-lg" />
                <div className="skeleton h-4 w-3/4 rounded-lg" />
                <div className="flex gap-2 mt-2">
                    <div className="skeleton h-6 w-16 rounded-full" />
                    <div className="skeleton h-6 w-20 rounded-full" />
                </div>
            </div>
        </div>
    );
}

export function GridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: count }).map((_, i) => (
                <CardSkeleton key={i} />
            ))}
        </div>
    );
}

export function DetailSkeleton() {
    return (
        <div className="space-y-6">
            <div className="skeleton h-72 w-full rounded-2xl" />
            <div className="skeleton h-8 w-1/2 rounded-lg" />
            <div className="skeleton h-4 w-full rounded-lg" />
            <div className="skeleton h-4 w-3/4 rounded-lg" />
            <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="skeleton h-16 rounded-xl" />
                ))}
            </div>
        </div>
    );
}
