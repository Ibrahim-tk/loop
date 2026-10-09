// Route-level loading skeleton for /rentals/[id]
// Shows instantly while the server fetches the property — no more blank white screen
export default function PropertyDetailLoading() {
    return (
        <section className="bg-[var(--surface-variant)] min-h-screen pt-[var(--header-height)]">
            <div className="px-5 sm:px-8 lg:px-10 py-8 sm:py-10 lg:py-12">
                <div className="animate-pulse space-y-8">
                    {/* Breadcrumb skeleton */}
                    <div className="lg:px-8">
                        <div className="flex items-center gap-2">
                            <div className="h-4 bg-gray-200 rounded w-10" />
                            <div className="h-4 bg-gray-200 rounded w-2" />
                            <div className="h-4 bg-gray-200 rounded w-14" />
                            <div className="h-4 bg-gray-200 rounded w-2" />
                            <div className="h-4 bg-gray-200 rounded w-40" />
                        </div>
                    </div>

                    {/* Two-column layout skeleton */}
                    <div className="flex flex-col lg:flex-row gap-6 lg:px-6">
                        {/* Left column */}
                        <div className="bg-white rounded-[4px] flex-1 p-5 space-y-6">
                            {/* Title + price row */}
                            <div className="flex justify-between items-start">
                                <div className="space-y-3 flex-1">
                                    <div className="h-3 bg-gray-200 rounded w-20" />
                                    <div className="h-7 bg-gray-200 rounded w-2/3" />
                                    <div className="h-4 bg-gray-200 rounded w-36" />
                                </div>
                                <div className="h-9 bg-gray-200 rounded w-36" />
                            </div>

                            {/* Image gallery */}
                            <div className="flex gap-4">
                                <div className="flex-1 aspect-[4096/2720] bg-gray-200 rounded" />
                                <div className="hidden sm:flex flex-col gap-4 w-[180px] lg:w-[215px]">
                                    <div className="flex-1 bg-gray-200 rounded" />
                                    <div className="flex-1 bg-gray-200 rounded" />
                                    <div className="flex-1 bg-gray-200 rounded" />
                                </div>
                            </div>

                            {/* Overview stats */}
                            <div className="flex gap-0 w-full border-t border-gray-100 pt-5">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="flex-1 space-y-2 px-3">
                                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                                        <div className="h-8 bg-gray-200 rounded w-1/2" />
                                    </div>
                                ))}
                            </div>

                            {/* Highlights block */}
                            <div className="bg-gray-100 rounded-[4px] p-5 space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-4 bg-gray-200 rounded w-2/3" />
                                ))}
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-full" />
                                <div className="h-4 bg-gray-200 rounded w-5/6" />
                                <div className="h-4 bg-gray-200 rounded w-4/6" />
                            </div>
                        </div>

                        {/* Right column — inquiry form */}
                        <div className="lg:w-[390px] shrink-0">
                            <div className="bg-white rounded-[4px] p-5 space-y-5">
                                <div className="h-6 bg-gray-200 rounded w-36" />
                                <div className="h-4 bg-gray-200 rounded w-52" />
                                <div className="h-px bg-gray-100" />
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-24" />
                                        <div className="h-11 bg-gray-200 rounded" />
                                    </div>
                                ))}
                                <div className="h-11 bg-gray-200 rounded" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
