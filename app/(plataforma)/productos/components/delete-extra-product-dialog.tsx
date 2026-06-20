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
import { deleteExtraProductAction } from "@/src/architecture/actions/extra-product/delete-extra-product.action";
import { TExtraProduct } from "@/src/architecture/core/domain/entities/ExtraProduct";

type DeleteExtraProductDialogProps = {
    product: TExtraProduct;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isDeleting: boolean;
    onDeletingChange: (isDeleting: boolean) => void;
};

export function DeleteExtraProductDialog({
    product,
    open,
    onOpenChange,
    isDeleting,
    onDeletingChange,
}: DeleteExtraProductDialogProps) {
    const router = useRouter();

    async function handleConfirmDelete() {
        onDeletingChange(true);

        try {
            const result = await deleteExtraProductAction(product.id);

            if (result.success) {
                toast.success("Producto eliminado correctamente");
                onOpenChange(false);
                router.refresh();
                return;
            }

            toast.error(result.error);
        } catch (error) {
            console.error(error);
            toast.error("Error inesperado al eliminar el producto");
        } finally {
            onDeletingChange(false);
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Vas a eliminar <strong>{product.name}</strong>. Esta acción no
                        se puede deshacer.
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
