"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Plus, Building2, User } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
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
  createCustomerInputSchema,
  type CreateCustomerInput,
} from "@/src/architecture/core/domain/entities/Customer";
import { createCustomerAction } from "@/src/architecture/actions/customer/create-customer.action";
import { zodResolver } from "@hookform/resolvers/zod";

function RequiredMark() {
  return (
    <span className="text-destructive" aria-hidden="true">
      {" "}
      *
    </span>
  );
}

export function CreateCustomerDialog() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<CreateCustomerInput>({
    resolver: zodResolver(createCustomerInputSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      type: "COMPANY",
      phone: null,
      address: null,
    },
  });

  async function onSubmit(data: CreateCustomerInput) {
    try {
      const result = await createCustomerAction(data);
      if (result.success) {
        toast.success("Cliente creado correctamente");
        router.push("/clientes");
        setOpen(false);
        reset();
        return;
      }

      toast.error(result.error);
    } catch (error) {
      console.error(error);
      toast.error("Error inesperado al crear el cliente");
    }
  }

  function handleOpenChange(value: boolean) {
    if (!value) reset();
    setOpen(value);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="brand">
          <Plus data-icon="inline-start" />
          Agregar Cliente
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            Agregar Nuevo Cliente
          </DialogTitle>
          <DialogDescription>
            Registrá un cliente para el reparto de viandas.
          </DialogDescription>
        </DialogHeader>

        <form
          id="create-customer-form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FieldGroup>
            {/* Nombre */}
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

            {/* Tipo de cliente */}
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

            {/* Teléfono + Dirección */}
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
            form="create-customer-form"
            disabled={isSubmitting}
          >
            <Building2 data-icon="inline-start" />
            {isSubmitting ? "Guardando..." : "Guardar Cliente"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
