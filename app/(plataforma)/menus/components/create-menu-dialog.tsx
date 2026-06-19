"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
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
import {
    parseCreateMenuTypeInput,
    type CreateMenuTypeFormInput,
} from "@/src/architecture/core/domain/entities/MenuType";
import { createMenuTypeAction } from "@/src/architecture/actions/menu-type/create-menu-type.action";

function RequiredMark() {
    return (
        <span className="text-destructive" aria-hidden="true">
            {" "}
            *
        </span>
    );
}

export function CreateMenuDialog() {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = useForm<CreateMenuTypeFormInput>({
        mode: "onBlur",
        defaultValues: {
            name: "",
            price: null,
        },
    });

    async function onSubmit(data: CreateMenuTypeFormInput) {
        try {
            const parsed = parseCreateMenuTypeInput(data);
            if (!parsed.success) {
                toast.error(parsed.error.issues[0]?.message ?? "Datos inválidos");
                return;
            }

            const result = await createMenuTypeAction(parsed.data);
            if (result.success) {
                toast.success("Menú creado correctamente");
                router.refresh();
                setOpen(false);
                reset();
                return;
            }

            toast.error(result.error);
        } catch (error) {
            console.error(error);
            toast.error("Error inesperado al crear el menú");
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
                    Agregar Menú
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-base font-semibold">
                        Agregar Nuevo Menú
                    </DialogTitle>
                    <DialogDescription>
                        Registrá un tipo de menú con nombre y precio opcional.
                    </DialogDescription>
                </DialogHeader>

                <form id="create-menu-form" onSubmit={handleSubmit(onSubmit)}>
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
                                            field.value == null || field.value === ""
                                                ? ""
                                                : String(field.value)
                                        }
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            field.onChange(val === "" ? null : val);
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
                    </FieldGroup>
                </form>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancelar</Button>
                    </DialogClose>
                    <Button
                        variant="brand"
                        type="submit"
                        form="create-menu-form"
                        disabled={isSubmitting}
                    >
                        <UtensilsCrossed data-icon="inline-start" />
                        {isSubmitting ? "Guardando..." : "Guardar Menú"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
