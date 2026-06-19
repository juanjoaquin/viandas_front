"use client";

import { useRouter, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { TWeekMenu } from "@/src/architecture/core/domain/entities/WeekMenu";

function formatWeekLabel(startDate: string, endDate: string): string {
    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T00:00:00`);
    const months = [
        "ene", "feb", "mar", "abr", "may", "jun",
        "jul", "ago", "sep", "oct", "nov", "dic",
    ];
    return `${start.getDate()} ${months[start.getMonth()]} – ${end.getDate()} ${months[end.getMonth()]} ${end.getFullYear()}`;
}

type WeekSelectorProps = {
    currentId: string;
    allMenus: TWeekMenu[];
};

export function WeekSelector({ currentId, allMenus }: WeekSelectorProps) {
    const router = useRouter();
    const pathname = usePathname();

    const currentIndex = allMenus.findIndex((m) => m.id === currentId);
    const hasPrev = currentIndex < allMenus.length - 1;
    const hasNext = currentIndex > 0;

    function navigate(id: string) {
        router.push(`${pathname}?weekMenuId=${id}`, { scroll: false });
    }

    function handlePrev() {
        const prev = allMenus[currentIndex + 1];
        if (prev) navigate(prev.id);
    }

    function handleNext() {
        const next = allMenus[currentIndex - 1];
        if (next) navigate(next.id);
    }

    if (allMenus.length === 0) return null;

    return (
        <div className="flex items-center gap-2">
            <Button
                type="button"
                variant="outline"
                size="icon-sm"
                disabled={!hasPrev}
                onClick={handlePrev}
                aria-label="Semana anterior"
                className="border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            >
                <ChevronLeft className="size-4" />
            </Button>

            <Select value={currentId} onValueChange={navigate}>
                <SelectTrigger
                    size="sm"
                    className="h-8 w-52 border-slate-200/70 bg-slate-100 text-sm dark:border-slate-700 dark:bg-slate-800/60"
                >
                    <SelectValue placeholder="Seleccionar semana" />
                </SelectTrigger>
                <SelectContent>
                    {allMenus.map((menu) => (
                        <SelectItem key={menu.id} value={menu.id}>
                            {formatWeekLabel(menu.week_start_date, menu.week_end_date)}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Button
                type="button"
                variant="outline"
                size="icon-sm"
                disabled={!hasNext}
                onClick={handleNext}
                aria-label="Semana siguiente"
                className="border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            >
                <ChevronRight className="size-4" />
            </Button>
        </div>
    );
}
