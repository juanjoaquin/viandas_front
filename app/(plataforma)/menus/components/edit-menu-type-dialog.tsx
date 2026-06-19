"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { UtensilsCrossed } from "lucide-react";
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
    updateMenuTypeInputSchema,
    type TMenuType,
    type UpdateMenuTypeInput,
} from "@/src/architecture/core/domain/entities/MenuType";
import { updateMenuTypeAction } from "@/src/architecture/actions/menu-type/update-menu-type.action";

function RequiredMark() {
    return (
        <span className="text-destructive" aria-hidden="true">
            {" "}
            *
        </span>
    );
}

type EditMenuTypeDialogProps = {
    menuType: TMenuType;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function EditMenuTypeDialog({
    menuType,
    open,
    onOpenChange,
}: EditMenuTypeDialogProps) {
    const router = useRouter();

    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = useForm<UpdateMenuTypeInput>({
        resolver: zodResolver(updateMenuTypeInputSchema),
        mode: "onBlur",
        defaultValues: {
            name: menuType.name,
            price: menuType.price ?? null,
            active: menuType.active,
        },
    });

    async function onSubmit(data: UpdateMenuTypeInput) {
        try {
            const result = await updateMenuTypeAction(menuType.id, data);
            if (result.success) {
                toast.success("Menú actualizado correctamente");
                router.refresh();
                onOpenChange(false);
                return;
            }

            toast.error(result.error);
        } catch (error) {
            console.error(error);
            toast.error("Error inesperado al actualizar el menú");
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
                        Editar Menú
                    </DialogTitle>
                    <DialogDescription>
                        Modificá los datos del tipo de menú.
                    </DialogDescription>
                </DialogHeader>

                <form id="edit-menu-type-form" onSubmit={handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>
                                        Nombre
                                        <RequiredMark />
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        placeholder="Ej. Menú Tradicional"
                                        aria-invalid={fieldState.invalid}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="price"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Precio</FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        type="number"
                                        min={0}
                                        step="0.01"
                                        value={
                                            field.value == null
                                                ? ""
                                                : String(field.value)
                                        }
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            field.onChange(val === "" ? null : Number(val));
                                        }}
                                        placeholder="Ej. 10000"
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
                                        <FieldLabel htmlFor="menu-type-active">
                                            Activo
                                        </FieldLabel>
                                        <FieldDescription>
                                            Los menús inactivos no estarán disponibles para asignar.
                                        </FieldDescription>
                                    </FieldContent>
                                    <Switch
                                        id="menu-type-active"
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
                        form="edit-menu-type-form"
                        disabled={isSubmitting}
                    >
                        <UtensilsCrossed data-icon="inline-start" />
                        {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
