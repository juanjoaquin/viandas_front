"use client";

import { Fragment, useState } from "react";
import { eachDayOfInterval, format, parseISO } from "date-fns";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TMenuType } from "@/src/architecture/core/domain/entities/MenuType";
import { TWeekMenu, TWeekMenuItem } from "@/src/architecture/core/domain/entities/WeekMenu";
import { cn } from "@/lib/utils";
import { WeekSelector } from "./week-selector";
import { WeekMenuCell } from "./week-menu-cell";
import { DeleteWeekDialog } from "./delete-week-dialog";

const DAY_LABELS: Record<number, string> = {
    0: "Dom",
    1: "Lun",
    2: "Mar",
    3: "Mié",
    4: "Jue",
    5: "Vie",
    6: "Sáb",
};

const FULL_DAY_LABELS: Record<number, string> = {
    0: "Domingo",
    1: "Lunes",
    2: "Martes",
    3: "Miércoles",
    4: "Jueves",
    5: "Viernes",
    6: "Sábado",
};

function generateWeekdays(startDate: string, endDate: string): string[] {
    return eachDayOfInterval({
        start: parseISO(startDate),
        end: parseISO(endDate),
    }).map((day) => format(day, "yyyy-MM-dd"));
}

function buildCellMap(
    items: TWeekMenuItem[],
    days: string[],
    menuTypes: TMenuType[],
): Record<string, TWeekMenuItem | null> {
    const cells: Record<string, TWeekMenuItem | null> = {};

    for (const day of days) {
        for (const type of menuTypes) {
            cells[`${day}:${type.id}`] = null;
        }
    }

    for (const item of items) {
        const typeId = item.menu_type?.id;
        if (typeId) {
            cells[`${item.menu_date}:${typeId}`] = item;
        }
    }

    return cells;
}

function formatDateLabel(dateStr: string): { short: string; full: string } {
    const date = new Date(`${dateStr}T00:00:00`);
    const dayOfWeek = date.getDay();
    const day = date.getDate();
    const months = [
        "ene", "feb", "mar", "abr", "may", "jun",
        "jul", "ago", "sep", "oct", "nov", "dic",
    ];
    return {
        short: `${DAY_LABELS[dayOfWeek]} ${day}`,
        full: `${FULL_DAY_LABELS[dayOfWeek]} ${day} de ${months[date.getMonth()]}`,
    };
}

function formatWeekRange(startDate: string, endDate: string): string {
    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T00:00:00`);
    const months = [
        "enero", "febrero", "marzo", "abril", "mayo", "junio",
        "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
    ];

    const startDay = start.getDate();
    const endDay = end.getDate();
    const startMonth = months[start.getMonth()];
    const endMonth = months[end.getMonth()];
    const year = end.getFullYear();

    if (start.getMonth() === end.getMonth()) {
        return `${startDay} al ${endDay} de ${startMonth} ${year}`;
    }
    return `${startDay} de ${startMonth} al ${endDay} de ${endMonth} ${year}`;
}

type WeekMenuGridProps = {
    weekMenu: TWeekMenu;
    menuTypes: TMenuType[];
    allMenus: TWeekMenu[];
};

export function WeekMenuGrid({ weekMenu, menuTypes, allMenus }: WeekMenuGridProps) {
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [isDeletingWeek, setIsDeletingWeek] = useState(false);
    const days = generateWeekdays(weekMenu.week_start_date, weekMenu.week_end_date);
    const items = weekMenu.items ?? [];
    const cellMap = buildCellMap(items, days, menuTypes);

    const filledCells = Object.values(cellMap).filter(Boolean).length;
    const totalCells = days.length * menuTypes.length;
    const summaryByType = menuTypes.map((type) => {
        const count = Object.values(cellMap).filter(
            (item) => item?.menu_type?.id === type.id,
        ).length;

        return {
            type,
            count,
            subtotal: count * (type.price ?? 0),
        };
    });
    const totalEstimated = summaryByType.reduce(
        (total, summary) => total + summary.subtotal,
        0,
    );
    const gridTemplateColumns = `120px repeat(${menuTypes.length}, minmax(0, 1fr))`;

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                        Semana del {formatWeekRange(weekMenu.week_start_date, weekMenu.week_end_date)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {filledCells} de {totalCells} celdas completadas
                    </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <WeekSelector currentId={weekMenu.id} allMenus={allMenus} />
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isDeletingWeek}
                        onClick={() => setDeleteOpen(true)}
                        className="border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50 hover:text-red-700 dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-950/40"
                    >
                        <Trash2 data-icon="inline-start" />
                        Eliminar semana
                    </Button>
                </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <div
                    className="grid min-w-[820px] w-full text-sm"
                    style={{ gridTemplateColumns }}
                >
                    <div className="border-b border-r border-slate-100 bg-slate-50/70 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-500">
                        DÍA
                    </div>
                    {menuTypes.map((type, typeIdx) => (
                        <div
                            key={type.id}
                            className={cn(
                                "border-b border-slate-100 px-4 py-3 text-center dark:border-slate-800",
                                typeIdx < menuTypes.length - 1 &&
                                    "border-r border-slate-100 dark:border-slate-800",
                            )}
                        >
                            <div className="flex flex-col items-center gap-0.5 leading-tight">
                                <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                                    {type.name}
                                </span>
                                {type.price != null && (
                                    <span className="text-xs font-medium text-slate-400">
                                        ${type.price.toLocaleString("es-AR")}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}

                    {days.map((day, rowIdx) => {
                        const { short, full } = formatDateLabel(day);
                        const isLastRow = rowIdx === days.length - 1;

                        return (
                            <Fragment key={day}>
                                <div
                                    className={cn(
                                        "flex min-w-0 flex-col justify-center gap-0.5 border-r border-slate-100 bg-slate-50/70 px-4 py-5 dark:border-slate-800 dark:bg-slate-900/50",
                                        !isLastRow &&
                                            "border-b border-slate-100 dark:border-slate-800",
                                    )}
                                >
                                    <span className="text-sm font-bold text-slate-900 dark:text-slate-50">
                                        {short}
                                    </span>
                                    <span className="hidden text-xs leading-tight text-slate-500 sm:block dark:text-slate-400">
                                        {full}
                                    </span>
                                </div>
                                {menuTypes.map((type, typeIdx) => {
                                    const cellKey = `${day}:${type.id}`;
                                    const item = cellMap[cellKey] ?? null;

                                    return (
                                        <div
                                            key={type.id}
                                            className={cn(
                                                "min-w-0 px-3 py-2.5",
                                                typeIdx < menuTypes.length - 1 &&
                                                    "border-r border-slate-100 dark:border-slate-800",
                                                !isLastRow &&
                                                    "border-b border-slate-100 dark:border-slate-800",
                                            )}
                                        >
                                            <WeekMenuCell
                                                weekMenuId={weekMenu.id}
                                                menuDate={day}
                                                menuType={type}
                                                item={item}
                                            />
                                        </div>
                                    );
                                })}
                            </Fragment>
                        );
                    })}
                </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-800 dark:bg-slate-900/60">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                    {summaryByType.map(({ type, count }) => (
                        <span
                            key={type.id}
                            className="text-sm text-slate-600 dark:text-slate-300"
                        >
                            <span className="font-semibold text-slate-900 dark:text-slate-50">
                                {count}
                            </span>{" "}
                            {type.name}
                        </span>
                    ))}
                </div>

                <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-500 dark:text-slate-400">
                        Total estimado
                    </span>
                    <span className="font-bold text-slate-900 dark:text-slate-50">
                        ${totalEstimated.toLocaleString("es-AR")}
                    </span>
                </div>
            </div>

            <DeleteWeekDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                isDeleting={isDeletingWeek}
                onDeletingChange={setIsDeletingWeek}
                weekMenu={weekMenu}
                allMenus={allMenus}
            />
        </div>
    );
}
