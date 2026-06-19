import { Skeleton } from "@/components/ui/skeleton";

export function DailyProductionsSkeleton() {
    return (
        <div className="space-y-4">
            <div className="rounded-xl border bg-card p-4 shadow-xs">
                <div className="mb-3 flex items-center justify-between">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-3 w-64" />
                    </div>
                    <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <Skeleton key={index} className="h-20 rounded-lg" />
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
