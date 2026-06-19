"use client";

import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
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
import { TWeekMenu } from "@/src/architecture/core/domain/entities/WeekMenu";
import { deleteWeekMenuAction } from "@/src/architecture/actions/week-menu/delete-week-menu.action";

type DeleteWeekDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isDeleting: boolean;
    onDeletingChange: (isDeleting: boolean) => void;
    weekMenu: TWeekMenu;
    allMenus: TWeekMenu[];
};

function formatWeekRange(startDate: string, endDate: string): string {
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    return `${format(start, "dd/MM/yyyy", { locale: es })} al ${format(end, "dd/MM/yyyy", { locale: es })}`;
}

export function DeleteWeekDialog({
    open,
    onOpenChange,
    isDeleting,
    onDeletingChange,
    weekMenu,
    allMenus,
}: DeleteWeekDialogProps) {
    const router = useRouter();
    const nextWeekMenu = allMenus.find((menu) => menu.id !== weekMenu.id);
    const weekLabel = formatWeekRange(
        weekMenu.week_start_date,
        weekMenu.week_end_date,
    );

    async function handleConfirmDelete() {
        onDeletingChange(true);

        try {
            const result = await deleteWeekMenuAction(weekMenu.id);

            if (result.success) {
                toast.success("Semana eliminada correctamente");
                onOpenChange(false);

                if (nextWeekMenu) {
                    router.push(`/menus-semanales?weekMenuId=${nextWeekMenu.id}`);
                } else {
                    router.push("/menus-semanales");
                }

                router.refresh();
                return;
            }

            toast.error(result.error);
        } catch (error) {
            console.error(error);
            toast.error("Error inesperado al eliminar la semana");
        } finally {
            onDeletingChange(false);
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Eliminar semana?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Vas a eliminar la semana del <strong>{weekLabel}</strong>.
                        También se van a borrar todos los platos asignados a esa
                        semana. Las demás semanas no se modifican.
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
                        {isDeleting ? "Eliminando..." : "Eliminar semana"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
