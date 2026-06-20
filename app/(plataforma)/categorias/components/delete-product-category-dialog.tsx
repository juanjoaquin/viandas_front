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
import { deleteProductCategoryAction } from "@/src/architecture/actions/product-category/delete-product-category.action";
import { TProductCategory } from "@/src/architecture/core/domain/entities/ProductCategory";

type DeleteProductCategoryDialogProps = {
    category: TProductCategory;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isDeleting: boolean;
    onDeletingChange: (isDeleting: boolean) => void;
};

export function DeleteProductCategoryDialog({
    category,
    open,
    onOpenChange,
    isDeleting,
    onDeletingChange,
}: DeleteProductCategoryDialogProps) {
    const router = useRouter();

    async function handleConfirmDelete() {
        onDeletingChange(true);

        try {
            const result = await deleteProductCategoryAction(category.id);

            if (result.success) {
                toast.success("Categoría eliminada correctamente");
                onOpenChange(false);
                router.refresh();
                return;
            }

            toast.error(result.error);
        } catch (error) {
            console.error(error);
            toast.error("Error inesperado al eliminar la categoría");
        } finally {
            onDeletingChange(false);
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Eliminar categoría?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Vas a eliminar <strong>{category.name}</strong>. Esta acción no
                        se puede deshacer si no tiene productos asociados.
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
                        {isDeleting ? "Eliminando..." : "Eliminar"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
