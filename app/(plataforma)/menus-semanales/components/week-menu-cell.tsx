"use client";

import { useState } from "react";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { TMenuType } from "@/src/architecture/core/domain/entities/MenuType";
import { TWeekMenuItem } from "@/src/architecture/core/domain/entities/WeekMenu";
import { AddItemDialog } from "./add-item-dialog";
import { EditItemDialog } from "./edit-item-dialog";
import { DeleteItemDialog } from "./delete-item-dialog";

type WeekMenuCellProps = {
    weekMenuId: string;
    menuDate: string;
    menuType: TMenuType;
    item: TWeekMenuItem | null;
};

export function WeekMenuCell({
    weekMenuId,
    menuDate,
    menuType,
    item,
}: WeekMenuCellProps) {
    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    if (!item) {
        return (
            <>
                <button
                    type="button"
                    onClick={() => setAddOpen(true)}
                    className="group flex min-h-[92px] cursor-pointer w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-transparent px-4 py-6 text-sm text-slate-400 transition-all duration-200 hover:border-slate-300 hover:bg-slate-100/60 hover:text-slate-500 dark:border-slate-800 dark:text-slate-500 dark:hover:border-slate-700 dark:hover:bg-slate-800/50 dark:hover:text-slate-400"
                    aria-label={`Asignar plato para ${menuType.name}`}
                >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition-colors group-hover:bg-slate-200 group-hover:text-slate-600 dark:bg-slate-800 dark:group-hover:bg-slate-700">
                        <Plus className="size-4" />
                    </span>
                    <span className="text-xs font-medium">Agregar</span>
                </button>

                <AddItemDialog
                    open={addOpen}
                    onOpenChange={setAddOpen}
                    weekMenuId={weekMenuId}
                    menuDate={menuDate}
                    menuType={menuType}
                />
            </>
        );
    }

    return (
        <>
            <div className="flex min-h-[92px] w-full flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-4 dark:border-slate-700 dark:bg-slate-900">
                <div className="flex w-full min-w-0 flex-col items-center">
                    <p className="line-clamp-2 text-center text-base font-semibold leading-snug text-slate-900 dark:text-slate-100">
                        {item.dish?.name ?? (
                            <span className="italic text-muted-foreground">Sin nombre</span>
                        )}
                    </p>
                </div>

                <div className="flex items-center justify-center gap-1.5">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                aria-label="Cambiar plato"
                                disabled={isDeleting}
                                onClick={() => setEditOpen(true)}
                                className="size-7 rounded-lg border border-slate-200 bg-white/90 text-slate-600 shadow-sm hover:bg-white hover:text-slate-900 dark:border-slate-700 dark:bg-slate-950/90 dark:text-slate-300 dark:hover:bg-slate-950"
                            >
                                <Pencil className="size-3" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">Cambiar plato</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                aria-label="Quitar plato"
                                disabled={isDeleting}
                                onClick={() => setDeleteOpen(true)}
                                className="size-7 rounded-lg border border-slate-200 bg-white/90 text-red-500 shadow-sm hover:bg-white hover:text-red-600 dark:border-slate-700 dark:bg-slate-950/90 dark:hover:bg-slate-950"
                            >
                                {isDeleting ? (
                                    <Loader2 className="size-3 animate-spin" />
                                ) : (
                                    <Trash2 className="size-3" />
                                )}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="top">Quitar plato</TooltipContent>
                    </Tooltip>
                </div>
            </div>

            <EditItemDialog
                open={editOpen}
                onOpenChange={setEditOpen}
                weekMenuId={weekMenuId}
                item={item}
            />

            <DeleteItemDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                isDeleting={isDeleting}
                onDeletingChange={setIsDeleting}
                weekMenuId={weekMenuId}
                item={item}
            />
        </>
    );
}
