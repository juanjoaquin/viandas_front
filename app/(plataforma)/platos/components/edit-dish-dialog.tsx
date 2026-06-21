"use client";

import { useState } from "react";
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
import { MenuTypeSearchInput } from "@/components/custom/inputs/menu-type-search-input";
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import {
    updateDishInputSchema,
    type TDish,
    type UpdateDishInput,
} from "@/src/architecture/core/domain/entities/Dish";
import { TMenuType } from "@/src/architecture/core/domain/entities/MenuType";
import { updateDishAction } from "@/src/architecture/actions/dish/update-dish.action";

function RequiredMark() {
    return (
        <span className="text-destructive" aria-hidden="true">
            {" "}
            *
        </span>
    );
}

type EditDishDialogProps = {
    dish: TDish;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function EditDishDialog({
    dish,
    open,
    onOpenChange,
}: EditDishDialogProps) {
    const router = useRouter();
    const [selectedMenuType, setSelectedMenuType] = useState<Pick<
        TMenuType,
        "id" | "name"
    > | null>(
        dish.menu_type
            ? { id: dish.menu_type.id, name: dish.menu_type.name }
            : null,
    );

    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = useForm<UpdateDishInput>({
        resolver: zodResolver(updateDishInputSchema),
        mode: "onBlur",
        defaultValues: {
            name: dish.name,
            description: dish.description,
            menu_type_id: dish.menu_type?.id ?? "",
            active: dish.active,
        },
    });

    async function onSubmit(data: UpdateDishInput) {
        try {
            const result = await updateDishAction(dish.id, data);
            if (result.success) {
                toast.success("Plato actualizado correctamente");
                router.refresh();
                onOpenChange(false);
                return;
            }

            toast.error(result.error);
        } catch (error) {
            console.error(error);
            toast.error("Error inesperado al actualizar el plato");
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
                        Editar Plato
                    </DialogTitle>
                    <DialogDescription>
                        Modificá los datos del plato para el servicio de viandas.
                    </DialogDescription>
                </DialogHeader>

                <form id="edit-dish-form" onSubmit={handleSubmit(onSubmit)}>
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
                                        placeholder="Ej. Milanesa con puré"
                                        aria-invalid={fieldState.invalid}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="description"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>
                                        Descripción
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        placeholder="Ej. Milanesa de carne con puré de papa"
                                        aria-invalid={fieldState.invalid}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="menu_type_id"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>
                                        Tipo de menú
                                        <RequiredMark />
                                    </FieldLabel>
                                    <MenuTypeSearchInput
                                        value={field.value}
                                        selectedMenuType={selectedMenuType}
                                        onValueChange={(menuTypeId, menuType) => {
                                            field.onChange(menuTypeId);
                                            setSelectedMenuType(
                                                menuType
                                                    ? { id: menuType.id, name: menuType.name }
                                                    : null,
                                            );
                                        }}
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
                                        <FieldLabel htmlFor="dish-active">
                                            Activo
                                        </FieldLabel>
                                        <FieldDescription>
                                            Los platos inactivos no aparecerán disponibles para asignar en el menú.
                                        </FieldDescription>
                                    </FieldContent>
                                    <Switch
                                        id="dish-active"
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
                        form="edit-dish-form"
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
