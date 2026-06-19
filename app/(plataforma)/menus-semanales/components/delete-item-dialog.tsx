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
import { TWeekMenuItem } from "@/src/architecture/core/domain/entities/WeekMenu";
import { deleteWeekMenuItemAction } from "@/src/architecture/actions/week-menu/delete-week-menu-item.action";

type DeleteItemDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isDeleting: boolean;
    onDeletingChange: (isDeleting: boolean) => void;
    weekMenuId: string;
    item: TWeekMenuItem;
};

export function DeleteItemDialog({
    open,
    onOpenChange,
    isDeleting,
    onDeletingChange,
    weekMenuId,
    item,
}: DeleteItemDialogProps) {
    const router = useRouter();

    async function handleConfirmDelete() {
        onDeletingChange(true);

        try {
            const result = await deleteWeekMenuItemAction(weekMenuId, item.id);

            if (result.success) {
                toast.success("Plato quitado del menú");
                onOpenChange(false);
                router.refresh();
                return;
            }

            toast.error(result.error);
        } catch (error) {
            console.error(error);
            toast.error("Error inesperado al quitar el plato");
        } finally {
            onDeletingChange(false);
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Quitar plato del menú?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Vas a quitar{" "}
                        <strong>{item.dish?.name ?? "este plato"}</strong> del{" "}
                        {item.menu_type?.name} del {item.menu_date}. La celda quedará
                        vacía.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>
                        Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                        variant="destructive"
                        disabled={isDeleting}
                        onClick={(event) => {
                            event.preventDefault();
                            void handleConfirmDelete();
                        }}
                    >
                        <Trash2 data-icon="inline-start" />
                        {isDeleting ? "Quitando..." : "Quitar plato"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
