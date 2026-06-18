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
import { TCustomer } from "@/src/architecture/core/domain/entities/Customer";
import { getCustomerByIdAction } from "@/src/architecture/actions/customer/get-customer-by-id.action";
import { EditCustomerDialog } from "./edit-customer-dialog";
import { DeleteCustomerDialog } from "./delete-customer-dialog";

type CustomerRowActionsProps = {
  customer: TCustomer;
};

export function CustomerID({ customer }: CustomerRowActionsProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState<TCustomer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleEdit() {
    setIsLoading(true);

    const result = await getCustomerByIdAction(customer.id);

    setIsLoading(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    setCustomerToEdit(result.data);
    setEditOpen(true);
  }

  function handleEditOpenChange(open: boolean) {
    setEditOpen(open);
    if (!open) setCustomerToEdit(null);
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
              aria-label={`Editar ${customer.name}`}
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
              aria-label={`Eliminar ${customer.name}`}
              className="border-slate-200 text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-red-900/60 dark:hover:bg-red-950/40 dark:hover:text-red-400"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Eliminar</TooltipContent>
        </Tooltip>
      </div>

      {customerToEdit && (
        <EditCustomerDialog
          customer={customerToEdit}
          open={editOpen}
          onOpenChange={handleEditOpenChange}
        />
      )}

      <DeleteCustomerDialog
        customer={customer}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        isDeleting={isDeleting}
        onDeletingChange={setIsDeleting}
      />
    </>
  );
}
