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
                    className="group flex min-h-[92px] cursor-pointer w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-transparent px-4 py-6 text-sm text-muted-foreground transition-all duration-200 hover:border-border hover:bg-muted/60 hover:text-muted-foreground"
                    aria-label={`Asignar plato para ${menuType.name}`}
                >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors group-hover:bg-accent group-hover:text-foreground">
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
            <div className="flex min-h-[92px] w-full flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card px-4 py-4 dark:border-border dark:bg-card">
                <div className="flex w-full min-w-0 flex-col items-center">
                    <p className="line-clamp-2 text-center text-base font-semibold leading-snug text-foreground">
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
                                className="size-7 rounded-lg border border-border bg-card/90 text-muted-foreground shadow-sm hover:bg-card hover:text-foreground"
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
                                className="size-7 rounded-lg border border-border bg-card/90 text-red-500 shadow-sm hover:bg-card hover:text-red-600"
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
