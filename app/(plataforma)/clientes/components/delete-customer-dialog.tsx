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
import { TCustomer } from "@/src/architecture/core/domain/entities/Customer";
import { deleteCustomerAction } from "@/src/architecture/actions/customer/delete-customer.action";

type DeleteCustomerDialogProps = {
  customer: TCustomer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isDeleting: boolean;
  onDeletingChange: (isDeleting: boolean) => void;
};

export function DeleteCustomerDialog({
  customer,
  open,
  onOpenChange,
  isDeleting,
  onDeletingChange,
}: DeleteCustomerDialogProps) {
  const router = useRouter();

  async function handleConfirmDelete() {
    onDeletingChange(true);

    try {
      const result = await deleteCustomerAction(customer.id);

      if (result.success) {
        toast.success("Cliente eliminado correctamente");
        onOpenChange(false);
        router.refresh();
        return;
      }

      toast.error(result.error);
    } catch (error) {
      console.error(error);
      toast.error("Error inesperado al eliminar el cliente");
    } finally {
      onDeletingChange(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar cliente?</AlertDialogTitle>
          <AlertDialogDescription>
            Vas a eliminar a <strong>{customer.name}</strong>. Esta acción no se
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
