"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Building2, User } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  updateCustomerInputSchema,
  type TCustomer,
  type UpdateCustomerInput,
} from "@/src/architecture/core/domain/entities/Customer";
import { updateCustomerAction } from "@/src/architecture/actions/customer/update-customer.action";

function RequiredMark() {
  return (
    <span className="text-destructive" aria-hidden="true">
      {" "}
      *
    </span>
  );
}

type EditCustomerDialogProps = {
  customer: TCustomer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EditCustomerDialog({
  customer,
  open,
  onOpenChange,
}: EditCustomerDialogProps) {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<UpdateCustomerInput>({
    resolver: zodResolver(updateCustomerInputSchema),
    mode: "onBlur",
    defaultValues: {
      name: customer.name,
      type: customer.type,
      phone: customer.phone ?? null,
      address: customer.address ?? null,
    },
  });

  async function onSubmit(data: UpdateCustomerInput) {
    try {
      const result = await updateCustomerAction(customer.id, data);
      if (result.success) {
        toast.success("Cliente actualizado correctamente");
        router.refresh();
        onOpenChange(false);
        return;
      }

      toast.error(result.error);
    } catch (error) {
      console.error(error);
      toast.error("Error inesperado al actualizar el cliente");
    }
  }

  function handleOpenChange(value: boolean) {
    if (!value) reset();
    onOpenChange(value);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            Editar Cliente
          </DialogTitle>
          <DialogDescription>
            Modificá los datos del cliente para el reparto de viandas.
          </DialogDescription>
        </DialogHeader>

        <form id="edit-customer-form" onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Nombre Completo / Razón Social
                    <RequiredMark />
                  </FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    placeholder="Ej. Aluar o Juan Pérez"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="type"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    Tipo de Cliente
                    <RequiredMark />
                  </FieldLabel>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => field.onChange("COMPANY")}
                      className={`flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-colors ${
                        field.value === "COMPANY"
                          ? "border-brand bg-brand/10 text-foreground"
                          : "border-border bg-background text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <div className="flex w-full items-center gap-2">
                        <Building2 className="size-4 shrink-0" />
                        <span className="text-sm font-semibold">Empresa</span>
                        {field.value === "COMPANY" && (
                          <span className="ml-auto flex size-4 items-center justify-center rounded-full bg-brand text-brand-foreground">
                            <svg
                              viewBox="0 0 12 12"
                              className="size-2.5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M2 6l3 3 5-5" />
                            </svg>
                          </span>
                        )}
                      </div>
                      <span className="text-xs">Instituciones o Negocio</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => field.onChange("PERSON")}
                      className={`flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-colors ${
                        field.value === "PERSON"
                          ? "border-brand bg-brand/10 text-foreground"
                          : "border-border bg-background text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <div className="flex w-full items-center gap-2">
                        <User className="size-4 shrink-0" />
                        <span className="text-sm font-semibold">Particular</span>
                        {field.value === "PERSON" && (
                          <span className="ml-auto flex size-4 items-center justify-center rounded-full bg-brand text-brand-foreground">
                            <svg
                              viewBox="0 0 12 12"
                              className="size-2.5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M2 6l3 3 5-5" />
                            </svg>
                          </span>
                        )}
                      </div>
                      <span className="text-xs">Hogares o Personas</span>
                    </button>
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <Controller
                name="phone"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Teléfono</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      value={field.value ?? ""}
                      placeholder="Ej. 111222333"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="address"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Dirección de Entrega
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      value={field.value ?? ""}
                      placeholder="Calle, Número, Localidad"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          </FieldGroup>
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button
            variant="brand"
            type="submit"
            form="edit-customer-form"
            disabled={isSubmitting}
          >
            <Building2 data-icon="inline-start" />
            {isSubmitting ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
