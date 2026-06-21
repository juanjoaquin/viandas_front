"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { PackagePlus, Plus } from "lucide-react";
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
import { ProductCategorySearchInput } from "@/components/custom/inputs/product-category-search-input";
import { createExtraProductAction } from "@/src/architecture/actions/extra-product/create-extra-product.action";
import {
    CreateExtraProductFormInput,
    parseCreateExtraProductInput,
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

type CreateExtraProductDialogProps = {};

export function CreateExtraProductDialog(_props: CreateExtraProductDialogProps = {}) {
    const [open, setOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Pick<
        TProductCategory,
        "id" | "name"
    > | null>(null);
    const router = useRouter();

    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = useForm<CreateExtraProductFormInput>({
        mode: "onBlur",
        defaultValues: {
            name: "",
            category_id: "",
            price: "",
        },
    });

    async function onSubmit(data: CreateExtraProductFormInput) {
        const parsed = parseCreateExtraProductInput(data);
        if (!parsed.success) {
            toast.error(parsed.error.issues[0]?.message ?? "Datos inválidos");
            return;
        }

        try {
            const result = await createExtraProductAction(parsed.data);
            if (result.success) {
                toast.success("Producto creado correctamente");
                router.refresh();
                setOpen(false);
                reset();
                return;
            }

            toast.error(result.error);
        } catch (error) {
            console.error(error);
            toast.error("Error inesperado al crear el producto");
        }
    }

    function handleOpenChange(value: boolean) {
        if (!value) {
            reset();
            setSelectedCategory(null);
        }
        setOpen(value);
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="brand">
                    <Plus data-icon="inline-start" />
                    Agregar Producto
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-base font-semibold">
                        Agregar Nuevo Producto
                    </DialogTitle>
                    <DialogDescription>
                        Registrá un producto extra y asocialo a una categoría.
                    </DialogDescription>
                </DialogHeader>

                <form
                    id="create-extra-product-form"
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
                    </FieldGroup>
                </form>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancelar</Button>
                    </DialogClose>
                    <Button
                        variant="brand"
                        type="submit"
                        form="create-extra-product-form"
                        disabled={isSubmitting}
                    >
                        <PackagePlus data-icon="inline-start" />
                        {isSubmitting ? "Guardando..." : "Guardar Producto"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
