"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FolderPlus, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createProductCategoryAction } from "@/src/architecture/actions/product-category/create-product-category.action";
import {
    CreateProductCategoryInput,
    createProductCategoryInputSchema,
} from "@/src/architecture/core/domain/entities/ProductCategory";

function RequiredMark() {
    return (
        <span className="text-destructive" aria-hidden="true">
            {" "}
            *
        </span>
    );
}

export function CreateProductCategoryDialog() {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = useForm<CreateProductCategoryInput>({
        resolver: zodResolver(createProductCategoryInputSchema),
        mode: "onBlur",
        defaultValues: {
            name: "",
        },
    });

    async function onSubmit(data: CreateProductCategoryInput) {
        try {
            const result = await createProductCategoryAction(data);
            if (result.success) {
                toast.success("Categoría creada correctamente");
                router.refresh();
                setOpen(false);
                reset();
                return;
            }

            toast.error(result.error);
        } catch (error) {
            console.error(error);
            toast.error("Error inesperado al crear la categoría");
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
                    Agregar Categoría
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-base font-semibold">
                        Agregar Nueva Categoría
                    </DialogTitle>
                    <DialogDescription>
                        Registrá una categoría para organizar productos.
                    </DialogDescription>
                </DialogHeader>

                <form
                    id="create-product-category-form"
                    onSubmit={handleSubmit(onSubmit)}
                >
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
                                        placeholder="Ej. Gaseosas"
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
                        form="create-product-category-form"
                        disabled={isSubmitting}
                    >
                        <FolderPlus data-icon="inline-start" />
                        {isSubmitting ? "Guardando..." : "Guardar Categoría"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
