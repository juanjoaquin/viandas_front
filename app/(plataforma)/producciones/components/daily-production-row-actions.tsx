"use client";

import { useState } from "react";
import { PackagePlus, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { TDailyProduction } from "@/src/architecture/core/domain/entities/DailyProduction";
import { AddDailyProductionExtraForm } from "./add-daily-production-extra-form";
import { DeleteDailyProductionDialog } from "./delete-daily-production-dialog";
import { EditDailyProductionDialog } from "./edit-daily-production-dialog";

type DailyProductionRowActionsProps = {
    production: TDailyProduction;
};

export function DailyProductionRowActions({
    production,
}: DailyProductionRowActionsProps) {
    const [addExtraOpen, setAddExtraOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const customerName = production.customer?.name ?? "producción";

    return (
        <>
            <div className="inline-flex items-center gap-1.5">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            type="button"
                            variant="outline"
                            size="icon-sm"
                            disabled={isDeleting}
                            aria-label={`Agregar producto a ${customerName}`}
                            className="border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                            onClick={() => setAddExtraOpen(true)}
                        >
                            <PackagePlus className="size-3.5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Agregar producto</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            type="button"
                            variant="outline"
                            size="icon-sm"
                            disabled={isDeleting}
                            aria-label={`Editar ${customerName}`}
                            className="border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                            onClick={() => setEditOpen(true)}
                        >
                            <Pencil className="size-3.5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Editar</TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            type="button"
                            variant="outline"
                            size="icon-sm"
                            disabled={isDeleting}
                            aria-label={`Eliminar ${customerName}`}
                            className="border-slate-200 text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-red-900/60 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                            onClick={() => setDeleteOpen(true)}
                        >
                            <Trash2 className="size-3.5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Eliminar</TooltipContent>
                </Tooltip>
            </div>

            <AddDailyProductionExtraForm
                production={production}
                open={addExtraOpen}
                onOpenChange={setAddExtraOpen}
            />

            <EditDailyProductionDialog
                production={production}
                open={editOpen}
                onOpenChange={setEditOpen}
            />

            <DeleteDailyProductionDialog
                production={production}
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                isDeleting={isDeleting}
                onDeletingChange={setIsDeleting}
            />
        </>
    );
}
