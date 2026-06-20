"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FolderCheck } from "lucide-react";
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
} from "@/components/ui/dialog";
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { updateProductCategoryAction } from "@/src/architecture/actions/product-category/update-product-category.action";
import {
    TProductCategory,
    UpdateProductCategoryInput,
    updateProductCategoryInputSchema,
} from "@/src/architecture/core/domain/entities/ProductCategory";

function RequiredMark() {
    return (
        <span className="text-destructive" aria-hidden="true">
            {" "}
            *
        </span>
    );
}

type EditProductCategoryDialogProps = {
    category: TProductCategory;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function EditProductCategoryDialog({
    category,
    open,
    onOpenChange,
}: EditProductCategoryDialogProps) {
    const router = useRouter();

    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = useForm<UpdateProductCategoryInput>({
        resolver: zodResolver(updateProductCategoryInputSchema),
        mode: "onBlur",
        defaultValues: {
            name: category.name,
            active: category.active,
        },
    });

    async function onSubmit(data: UpdateProductCategoryInput) {
        try {
            const result = await updateProductCategoryAction(category.id, data);
            if (result.success) {
                toast.success("Categoría actualizada correctamente");
                router.refresh();
                onOpenChange(false);
                return;
            }

            toast.error(result.error);
        } catch (error) {
            console.error(error);
            toast.error("Error inesperado al actualizar la categoría");
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
                        Editar Categoría
                    </DialogTitle>
                    <DialogDescription>
                        Modificá el nombre y el estado de la categoría.
                    </DialogDescription>
                </DialogHeader>

                <form
                    id="edit-product-category-form"
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

                        <Controller
                            name="active"
                            control={control}
                            render={({ field }) => (
                                <Field orientation="horizontal">
                                    <FieldContent>
                                        <FieldLabel htmlFor="product-category-active">
                                            Activa
                                        </FieldLabel>
                                        <FieldDescription>
                                            Las categorías inactivas no estarán disponibles
                                            para nuevos productos.
                                        </FieldDescription>
                                    </FieldContent>
                                    <Switch
                                        id="product-category-active"
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
                        form="edit-product-category-form"
                        disabled={isSubmitting}
                    >
                        <FolderCheck data-icon="inline-start" />
                        {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
