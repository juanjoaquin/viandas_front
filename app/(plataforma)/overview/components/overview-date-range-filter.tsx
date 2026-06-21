"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CalendarDays } from "lucide-react";
import { Input } from "@/components/ui/input";
import { buildPageHref } from "@/lib/pagination-params";

type OverviewDateRangeFilterProps = {
    from: string;
    to: string;
};

export function OverviewDateRangeFilter({ from, to }: OverviewDateRangeFilterProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    function updateDate(name: "from" | "to", value: string) {
        const params = new URLSearchParams(searchParams.toString());
        params.set(name, value);
        router.replace(buildPageHref(pathname, params), { scroll: false });
    }

    return (
        <div className="flex flex-col gap-3 rounded-xl border bg-card px-4 py-3 shadow-xs md:flex-row md:flex-wrap md:items-center">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <CalendarDays className="size-4" />
                <span>Rango</span>
            </div>

            <label className="flex w-full items-center gap-2 text-sm md:w-auto">
                <span className="shrink-0 text-muted-foreground">Desde</span>
                <Input
                    type="date"
                    value={from}
                    max={to}
                    onChange={(event) => updateDate("from", event.target.value)}
                    className="w-full flex-1 bg-slate-100 md:w-40 md:flex-none dark:bg-slate-800/60"
                />
            </label>

            <label className="flex w-full items-center gap-2 text-sm md:w-auto">
                <span className="shrink-0 text-muted-foreground">Hasta</span>
                <Input
                    type="date"
                    value={to}
                    min={from}
                    onChange={(event) => updateDate("to", event.target.value)}
                    className="w-full flex-1 bg-slate-100 md:w-40 md:flex-none dark:bg-slate-800/60"
                />
            </label>
        </div>
    );
}
