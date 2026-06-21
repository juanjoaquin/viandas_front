"use client";

import { useState } from "react";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { TDish } from "@/src/architecture/core/domain/entities/Dish";
import { getDishByIdAction } from "@/src/architecture/actions/dish/get-dish-by-id.action";
import { EditDishDialog } from "./edit-dish-dialog";
import { DeleteDishDialog } from "./delete-dish-dialog";

type DishRowActionsProps = {
    dish: TDish;
};

export function DishID({ dish }: DishRowActionsProps) {
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [dishToEdit, setDishToEdit] = useState<TDish | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    async function handleEdit() {
        setIsLoading(true);

        const result = await getDishByIdAction(dish.id);

        setIsLoading(false);

        if (!result.success) {
            toast.error(result.error);
            return;
        }

        setDishToEdit(result.data);
        setEditOpen(true);
    }

    function handleEditOpenChange(open: boolean) {
        setEditOpen(open);
        if (!open) setDishToEdit(null);
    }

    return (
        <>
            <div className="inline-flex items-center gap-1.5">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            type="button"
                            variant="outline"
                            size="icon-sm"
                            disabled={isLoading || isDeleting}
                            aria-label={`Editar ${dish.name}`}
                            className="border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                            onClick={() => void handleEdit()}
                        >
                            {isLoading ? (
                                <Loader2 className="size-3.5 animate-spin" />
                            ) : (
                                <Pencil className="size-3.5" />
                            )}
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
                            disabled={isLoading || isDeleting}
                            aria-label={`Eliminar ${dish.name}`}
                            className="border-slate-200 text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-red-900/60 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                            onClick={() => setDeleteOpen(true)}
                        >
                            <Trash2 className="size-3.5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Eliminar</TooltipContent>
                </Tooltip>
            </div>

            {dishToEdit && (
                <EditDishDialog
                    dish={dishToEdit}
                    open={editOpen}
                    onOpenChange={handleEditOpenChange}
                />
            )}

            <DeleteDishDialog
                dish={dish}
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                isDeleting={isDeleting}
                onDeletingChange={setIsDeleting}
            />
        </>
    );
}
