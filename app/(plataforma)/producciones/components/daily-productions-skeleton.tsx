import { Skeleton } from "@/components/ui/skeleton";

export function DailyProductionsSkeleton() {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-40" />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="h-28 rounded-xl" />
                ))}
            </div>

            <div className="rounded-xl border bg-card p-4 shadow-xs">
                <div className="mb-4 space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-56" />
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                    {Array.from({ length: 2 }).map((_, index) => (
                        <div key={index} className="grid gap-2 sm:grid-cols-2">
                            {Array.from({ length: 2 }).map((__, itemIndex) => (
                                <Skeleton
                                    key={itemIndex}
                                    className="h-20 rounded-lg"
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <div className="rounded-xl border bg-card p-4 shadow-xs">
                <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Skeleton key={index} className="h-10 w-full" />
                    ))}
                </div>
            </div>
        </div>
    );
}
