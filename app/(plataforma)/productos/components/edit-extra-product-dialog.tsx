"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { PackageCheck } from "lucide-react";
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
import { ProductCategorySearchInput } from "@/components/custom/inputs/product-category-search-input";
import { Switch } from "@/components/ui/switch";
import { updateExtraProductAction } from "@/src/architecture/actions/extra-product/update-extra-product.action";
import {
    TExtraProduct,
    UpdateExtraProductFormInput,
    parseUpdateExtraProductInput,
} from "@/src/architecture/core/domain/entities/ExtraProduct";
import { TProductCategory } from "@/src/architecture/core/domain/entities/ProductCategory";

function RequiredMark() {
    return (
        <span className="text-destructive" aria-hidden="true">
            {" "}
            *
        </span>
    );
}

type EditExtraProductDialogProps = {
    product: TExtraProduct;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function EditExtraProductDialog({
    product,
    open,
    onOpenChange,
}: EditExtraProductDialogProps) {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState<Pick<
        TProductCategory,
        "id" | "name"
    > | null>(
        product.category
            ? { id: product.category.id, name: product.category.name }
            : null,
    );

    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = useForm<UpdateExtraProductFormInput>({
        mode: "onBlur",
        defaultValues: {
            name: product.name,
            category_id: product.category?.id ?? "",
            price: product.price,
            active: product.active,
        },
    });

    async function onSubmit(data: UpdateExtraProductFormInput) {
        const parsed = parseUpdateExtraProductInput(data);
        if (!parsed.success) {
            toast.error(parsed.error.issues[0]?.message ?? "Datos inválidos");
            return;
        }

        try {
            const result = await updateExtraProductAction(product.id, parsed.data);
            if (result.success) {
                toast.success("Producto actualizado correctamente");
                router.refresh();
                onOpenChange(false);
                return;
            }

            toast.error(result.error);
        } catch (error) {
            console.error(error);
            toast.error("Error inesperado al actualizar el producto");
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
                        Editar Producto
                    </DialogTitle>
                    <DialogDescription>
                        Modificá el nombre, la categoría, el precio y el estado del producto extra.
                    </DialogDescription>
                </DialogHeader>

                <form id="edit-extra-product-form" onSubmit={handleSubmit(onSubmit)}>
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
                                        placeholder="Ej. Ensalada César"
                                        aria-invalid={fieldState.invalid}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="category_id"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>
                                        Categoría
                                        <RequiredMark />
                                    </FieldLabel>
                                    <ProductCategorySearchInput
                                        value={field.value}
                                        selectedCategory={selectedCategory}
                                        onValueChange={(categoryId, category) => {
                                            field.onChange(categoryId);
                                            setSelectedCategory(
                                                category
                                                    ? { id: category.id, name: category.name }
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
                            name="price"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>
                                        Precio
                                        <RequiredMark />
                                    </FieldLabel>
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
                                        onChange={(event) => {
                                            const val = event.target.value;
                                            field.onChange(val === "" ? "" : val);
                                        }}
                                        placeholder="Ej. 1200"
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
                                        <FieldLabel htmlFor="extra-product-active">
                                            Activo
                                        </FieldLabel>
                                        <FieldDescription>
                                            Los productos inactivos no deberían ofrecerse
                                            para nuevas producciones.
                                        </FieldDescription>
                                    </FieldContent>
                                    <Switch
                                        id="extra-product-active"
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
                        form="edit-extra-product-form"
                        disabled={isSubmitting}
                    >
                        <PackageCheck data-icon="inline-start" />
                        {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
