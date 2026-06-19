"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TDish } from "@/src/architecture/core/domain/entities/Dish";
import { deleteDishAction } from "@/src/architecture/actions/dish/delete-dish.action";

type DeleteDishDialogProps = {
    dish: TDish;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isDeleting: boolean;
    onDeletingChange: (isDeleting: boolean) => void;
};

export function DeleteDishDialog({
    dish,
    open,
    onOpenChange,
    isDeleting,
    onDeletingChange,
}: DeleteDishDialogProps) {
    const router = useRouter();

    async function handleConfirmDelete() {
        onDeletingChange(true);

        try {
            const result = await deleteDishAction(dish.id);

            if (result.success) {
                toast.success("Plato eliminado correctamente");
                onOpenChange(false);
                router.refresh();
                return;
            }

            toast.error(result.error);
        } catch (error) {
            console.error(error);
            toast.error("Error inesperado al eliminar el plato");
        } finally {
            onDeletingChange(false);
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Eliminar plato?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Vas a eliminar <strong>{dish.name}</strong>. Esta acción no se
                        puede deshacer.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        variant="destructive"
                        disabled={isDeleting}
                        onClick={(event) => {
                            event.preventDefault();
                            void handleConfirmDelete();
                        }}
                    >
                        <Trash2 data-icon="inline-start" />
                        {isDeleting ? "Eliminando..." : "Eliminar"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
