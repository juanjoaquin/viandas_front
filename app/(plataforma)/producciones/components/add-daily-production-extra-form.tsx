"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Minus, Plus, Save } from "lucide-react";
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
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { addDailyProductionExtraAction } from "@/src/architecture/actions/daily-production/add-daily-production-extra.action";
import {
    AddDailyProductionExtraInput,
    TDailyProduction,
    addDailyProductionExtraInputSchema,
} from "@/src/architecture/core/domain/entities/DailyProduction";
import { TExtraProduct } from "@/src/architecture/core/domain/entities/ExtraProduct";

type AddDailyProductionExtraFormProps = {
    production: TDailyProduction;
    extraProducts: TExtraProduct[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function AddDailyProductionExtraForm({
    production,
    extraProducts,
    open,
    onOpenChange,
}: AddDailyProductionExtraFormProps) {
    const router = useRouter();
    const usedExtraProductIds = useMemo(
        () =>
            new Set(
                production.extras
                    ?.map((extra) => extra.extra_product?.id)
                    .filter((id): id is string => Boolean(id)),
            ),
        [production.extras],
    );
    const hasAvailableProducts = extraProducts.some(
        (product) => !usedExtraProductIds.has(product.id),
    );

    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = useForm<AddDailyProductionExtraInput>({
        resolver: zodResolver(addDailyProductionExtraInputSchema),
        mode: "onBlur",
        defaultValues: {
            extra_product_id: "",
            quantity: 1,
        },
    });

    function handleOpenChange(value: boolean) {
        if (!value) {
            reset({
                extra_product_id: "",
                quantity: 1,
            });
        }

        onOpenChange(value);
    }

    async function onSubmit(data: AddDailyProductionExtraInput) {
        if (usedExtraProductIds.has(data.extra_product_id)) {
            toast.error("Ese producto ya está cargado en esta producción");
            return;
        }

        try {
            const result = await addDailyProductionExtraAction(
                production.id,
                data,
                production.production_date,
            );

            if (result.success) {
                toast.success("Producto agregado correctamente");
                router.refresh();
                handleOpenChange(false);
                return;
            }

            toast.error(result.error);
        } catch (error) {
            console.error(error);
            toast.error("Error inesperado al agregar el producto");
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-base font-semibold">
                        Agregar producto
                    </DialogTitle>
                    <DialogDescription>
                        Sumá ensaladas o sándwiches para{" "}
                        <strong>{production.customer?.name ?? "esta producción"}</strong>.
                    </DialogDescription>
                </DialogHeader>

                <form
                    id="add-daily-production-extra-form"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <FieldGroup>
                        <Controller
                            name="extra_product_id"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Producto</FieldLabel>
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        disabled={!hasAvailableProducts}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Seleccionar producto" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {extraProducts.map((product) => (
                                                <SelectItem
                                                    key={product.id}
                                                    value={product.id}
                                                    disabled={usedExtraProductIds.has(product.id)}
                                                >
                                                    {product.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {!hasAvailableProducts ? (
                                        <p className="text-sm text-muted-foreground">
                                            No hay productos activos disponibles para agregar.
                                        </p>
                                    ) : null}
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="quantity"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Cantidad</FieldLabel>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon-sm"
                                            onClick={() =>
                                                field.onChange(Math.max(1, Number(field.value) - 1))
                                            }
                                            aria-label="Disminuir cantidad"
                                        >
                                            <Minus className="size-3.5" />
                                        </Button>
                                        <Input
                                            type="number"
                                            min={1}
                                            value={field.value}
                                            onChange={(event) =>
                                                field.onChange(Number(event.target.value || 1))
                                            }
                                            className="h-8 w-20 text-center"
                                            aria-label="Cantidad"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon-sm"
                                            onClick={() => field.onChange(Number(field.value) + 1)}
                                            aria-label="Aumentar cantidad"
                                        >
                                            <Plus className="size-3.5" />
                                        </Button>
                                    </div>
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
                        form="add-daily-production-extra-form"
                        disabled={isSubmitting || !hasAvailableProducts}
                    >
                        <Save data-icon="inline-start" />
                        {isSubmitting ? "Agregando..." : "Agregar producto"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
