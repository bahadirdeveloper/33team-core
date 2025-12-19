export default function Loading() {
    return (
        <div className="animate-pulse space-y-8">
            {/* Header Skeleton */}
            <div className="border-b border-slate-800 pb-8">
                <div className="h-10 bg-slate-800 w-1/3 rounded mb-4"></div>
                <div className="h-4 bg-slate-800 w-2/3 rounded"></div>

                <div className="flex gap-4 mt-6">
                    <div className="h-10 w-32 bg-slate-800 rounded"></div>
                    <div className="h-10 w-32 bg-slate-800 rounded"></div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Skeleton Blocks */}
                    <div className="h-48 bg-slate-900 rounded-xl border border-slate-800"></div>
                    <div className="h-48 bg-slate-900 rounded-xl border border-slate-800"></div>
                </div>

                <div>
                    <div className="h-64 bg-slate-900 rounded-xl border border-slate-800"></div>
                </div>
            </div>
        </div>
    );
}
