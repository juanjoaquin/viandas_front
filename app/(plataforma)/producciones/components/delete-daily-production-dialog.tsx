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
import { deleteDailyProductionAction } from "@/src/architecture/actions/daily-production/delete-daily-production.action";
import { TDailyProduction } from "@/src/architecture/core/domain/entities/DailyProduction";

type DeleteDailyProductionDialogProps = {
    production: TDailyProduction;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isDeleting: boolean;
    onDeletingChange: (isDeleting: boolean) => void;
};

export function DeleteDailyProductionDialog({
    production,
    open,
    onOpenChange,
    isDeleting,
    onDeletingChange,
}: DeleteDailyProductionDialogProps) {
    const router = useRouter();

    async function handleConfirmDelete() {
        onDeletingChange(true);

        try {
            const result = await deleteDailyProductionAction(
                production.id,
                production.production_date,
            );

            if (result.success) {
                toast.success("Producción eliminada correctamente");
                onOpenChange(false);
                router.refresh();
                return;
            }

            toast.error(result.error);
        } catch (error) {
            console.error(error);
            toast.error("Error inesperado al eliminar la producción");
        } finally {
            onDeletingChange(false);
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Eliminar producción?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Vas a eliminar la producción de{" "}
                        <strong>{production.customer?.name ?? "este cliente"}</strong>. Se
                        borrarán también sus líneas y productos asociados. Esta acción no se
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
