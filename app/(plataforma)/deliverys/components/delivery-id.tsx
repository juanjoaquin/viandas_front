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
import { TDelivery } from "@/src/architecture/core/domain/entities/Delivery";
import { getDeliveryByIdAction } from "@/src/architecture/actions/delivery/get-delivery-by-id.action";
import { EditDeliveryDialog } from "./edit-delivery-dialog";
import { DeleteDeliveryDialog } from "./delete-delivery-dialog";

type DeliveryRowActionsProps = {
    delivery: TDelivery;
};

export function DeliveryID({ delivery }: DeliveryRowActionsProps) {
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deliveryToEdit, setDeliveryToEdit] = useState<TDelivery | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    async function handleEdit() {
        setIsLoading(true);

        const result = await getDeliveryByIdAction(delivery.id);

        setIsLoading(false);

        if (!result.success) {
            toast.error(result.error);
            return;
        }

        setDeliveryToEdit(result.data);
        setEditOpen(true);
    }

    function handleEditOpenChange(open: boolean) {
        setEditOpen(open);
        if (!open) setDeliveryToEdit(null);
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
                            aria-label={`Editar ${delivery.name}`}
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
                            aria-label={`Eliminar ${delivery.name}`}
                            className="border-slate-200 text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-red-900/60 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                            onClick={() => setDeleteOpen(true)}
                        >
                            <Trash2 className="size-3.5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Eliminar</TooltipContent>
                </Tooltip>
            </div>

            {deliveryToEdit && (
                <EditDeliveryDialog
                    delivery={deliveryToEdit}
                    open={editOpen}
                    onOpenChange={handleEditOpenChange}
                />
            )}

            <DeleteDeliveryDialog
                delivery={delivery}
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                isDeleting={isDeleting}
                onDeletingChange={setIsDeleting}
            />
        </>
    );
}
