"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Plus, UtensilsCrossed } from "lucide-react";

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
import { MenuTypeSearchInput } from "@/components/custom/inputs/menu-type-search-input";
import {
    createDishInputSchema,
    type CreateDishInput,
} from "@/src/architecture/core/domain/entities/Dish";
import { TMenuType } from "@/src/architecture/core/domain/entities/MenuType";
import { createDishAction } from "@/src/architecture/actions/dish/create-dish.action";

function RequiredMark() {
    return (
        <span className="text-destructive" aria-hidden="true">
            {" "}
            *
        </span>
    );
}

type CreateDishDialogProps = {};

export function CreateDishDialog(_props: CreateDishDialogProps = {}) {
    const [open, setOpen] = useState(false);
    const [selectedMenuType, setSelectedMenuType] = useState<Pick<
        TMenuType,
        "id" | "name"
    > | null>(null);
    const router = useRouter();

    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = useForm<CreateDishInput>({
        resolver: zodResolver(createDishInputSchema),
        mode: "onBlur",
        defaultValues: {
            name: "",
            description: "",
            menu_type_id: "",
        },
    });

    async function onSubmit(data: CreateDishInput) {
        try {
            const result = await createDishAction(data);
            if (result.success) {
                toast.success("Plato creado correctamente");
                router.refresh();
                setOpen(false);
                reset();
                return;
            }

            toast.error(result.error);
        } catch (error) {
            console.error(error);
            toast.error("Error inesperado al crear el plato");
        }
    }

    function handleOpenChange(value: boolean) {
        if (!value) {
            reset();
            setSelectedMenuType(null);
        }
        setOpen(value);
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="brand">
                    <Plus data-icon="inline-start" />
                    Agregar Plato
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-base font-semibold">
                        Agregar Nuevo Plato
                    </DialogTitle>
                    <DialogDescription>
                        Registrá un plato para el menú de viandas.
                    </DialogDescription>
                </DialogHeader>

                <form id="create-dish-form" onSubmit={handleSubmit(onSubmit)}>
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
                    </FieldGroup>
                </form>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancelar</Button>
                    </DialogClose>
                    <Button
                        variant="brand"
                        type="submit"
                        form="create-dish-form"
                        disabled={isSubmitting}
                    >
                        <UtensilsCrossed data-icon="inline-start" />
                        {isSubmitting ? "Guardando..." : "Guardar Plato"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
