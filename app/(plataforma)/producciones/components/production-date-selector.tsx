"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function addDays(date: string, days: number): string {
    const current = new Date(`${date}T00:00:00`);
    current.setDate(current.getDate() + days);
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, "0");
    const day = String(current.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

type ProductionDateSelectorProps = {
    date: string;
};

export function ProductionDateSelector({ date }: ProductionDateSelectorProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    function navigate(nextDate: string) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("date", nextDate);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }

    return (
        <div className="flex items-center gap-2">
            <Button
                type="button"
                variant="outline"
                size="icon-sm"
                onClick={() => navigate(addDays(date, -1))}
                aria-label="Día anterior"
            >
                <ChevronLeft className="size-4" />
            </Button>

            <Input
                type="date"
                value={date}
                onChange={(event) => navigate(event.target.value)}
                className="h-8 w-40"
                aria-label="Filtrar por fecha"
            />

            <Button
                type="button"
                variant="outline"
                size="icon-sm"
                onClick={() => navigate(addDays(date, 1))}
                aria-label="Día siguiente"
            >
                <ChevronRight className="size-4" />
            </Button>
        </div>
    );
}
