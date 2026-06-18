"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Truck } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import {
    updateDeliveryInputSchema,
    type TDelivery,
    type UpdateDeliveryInput,
} from "@/src/architecture/core/domain/entities/Delivery";
import { updateDeliveryAction } from "@/src/architecture/actions/delivery/update-delivery.action";

function RequiredMark() {
    return (
        <span className="text-destructive" aria-hidden="true">
            {" "}
            *
        </span>
    );
}

type EditDeliveryDialogProps = {
    delivery: TDelivery;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function EditDeliveryDialog({
    delivery,
    open,
    onOpenChange,
}: EditDeliveryDialogProps) {
    const router = useRouter();

    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = useForm<UpdateDeliveryInput>({
        resolver: zodResolver(updateDeliveryInputSchema),
        mode: "onBlur",
        defaultValues: {
            name: delivery.name,
            phone: delivery.phone ?? null,
            active: delivery.active,
        },
    });

    async function onSubmit(data: UpdateDeliveryInput) {
        try {
            const result = await updateDeliveryAction(delivery.id, data);
            if (result.success) {
                toast.success("Delivery actualizado correctamente");
                router.refresh();
                onOpenChange(false);
                return;
            }

            toast.error(result.error);
        } catch (error) {
            console.error(error);
            toast.error("Error inesperado al actualizar el delivery");
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
                        Editar Delivery
                    </DialogTitle>
                    <DialogDescription>
                        Modificá los datos del repartidor para el servicio de viandas.
                    </DialogDescription>
                </DialogHeader>

                <form id="edit-delivery-form" onSubmit={handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>
                                        Nombre completo
                                        <RequiredMark />
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        placeholder="Ej. Juan Pérez"
                                        aria-invalid={fieldState.invalid}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

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
                            name="active"
                            control={control}
                            render={({ field }) => (
                                <Field orientation="horizontal">
                                    <FieldContent>
                                        <FieldLabel htmlFor="delivery-active">
                                            Activo
                                        </FieldLabel>
                                        <FieldDescription>
                                            Los deliveries inactivos no aparecerán disponibles para asignar.
                                        </FieldDescription>
                                    </FieldContent>
                                    <Switch
                                        id="delivery-active"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </Field>
                            )}
                        />
                    </FieldGroup>
                </form>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancelar</Button>
                    </DialogClose>
                    <Button
                        variant="brand"
                        type="submit"
                        form="edit-delivery-form"
                        disabled={isSubmitting}
                    >
                        <Truck data-icon="inline-start" />
                        {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
