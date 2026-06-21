"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
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
import { DeliverySearchInput } from "@/components/custom/inputs/delivery-search-input";
import { ExtraProductSearchInput } from "@/components/custom/inputs/extra-product-search-input";
import { MenuTypeSearchInput } from "@/components/custom/inputs/menu-type-search-input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { addDailyProductionExtraAction } from "@/src/architecture/actions/daily-production/add-daily-production-extra.action";
import { deleteDailyProductionExtraAction } from "@/src/architecture/actions/daily-production/delete-daily-production-extra.action";
import { deleteDailyProductionLineAction } from "@/src/architecture/actions/daily-production/delete-daily-production-line.action";
import { updateDailyProductionAction } from "@/src/architecture/actions/daily-production/update-daily-production.action";
import { updateDailyProductionExtraAction } from "@/src/architecture/actions/daily-production/update-daily-production-extra.action";
import { upsertDailyProductionLineAction } from "@/src/architecture/actions/daily-production/upsert-daily-production-line.action";
import {
    TDailyProduction,
    TFulfillmentType,
} from "@/src/architecture/core/domain/entities/DailyProduction";
import { TDelivery } from "@/src/architecture/core/domain/entities/Delivery";
import { TExtraProduct } from "@/src/architecture/core/domain/entities/ExtraProduct";
import { TMenuType } from "@/src/architecture/core/domain/entities/MenuType";

type EditLineForm = {
    line_id?: string;
    menu_type_id: string;
    quantity: number;
};

type EditExtraForm = {
    extra_id?: string;
    extra_product_id: string;
    quantity: number;
};

type EditDailyProductionForm = {
    fulfillment_type: TFulfillmentType;
    delivery_id: string;
    notes: string;
    lines: EditLineForm[];
    extras: EditExtraForm[];
};

const fulfillmentLabels: Record<TFulfillmentType, string> = {
    PENDING: "Pendiente",
    DELIVERY: "Delivery",
    PICKUP: "Retiro en local",
};

function emptyLine(): EditLineForm {
    return {
        menu_type_id: "",
        quantity: 1,
    };
}

function emptyExtra(): EditExtraForm {
    return {
        extra_product_id: "",
        quantity: 1,
    };
}

function getDefaultLines(production: TDailyProduction): EditLineForm[] {
    const lines = production.lines
        ?.filter((line) => line.menu_type?.id)
        .map((line) => ({
            line_id: line.id,
            menu_type_id: line.menu_type?.id ?? "",
            quantity: line.quantity,
        }));

    return lines && lines.length > 0 ? lines : [emptyLine()];
}

function getDefaultExtras(production: TDailyProduction): EditExtraForm[] {
    const extras = production.extras
        ?.filter((extra) => extra.extra_product?.id)
        .map((extra) => ({
            extra_id: extra.id,
            extra_product_id: extra.extra_product?.id ?? "",
            quantity: extra.quantity,
        }));

    return extras && extras.length > 0 ? extras : [emptyExtra()];
}

function completeExtrasCount(extras?: EditExtraForm[]) {
    return extras?.filter((extra) => extra.extra_product_id).length ?? 0;
}

type EditDailyProductionDialogProps = {
    production: TDailyProduction;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function EditDailyProductionDialog({
    production,
    open,
    onOpenChange,
}: EditDailyProductionDialogProps) {
    const router = useRouter();
    const [selectedDelivery, setSelectedDelivery] = useState<Pick<
        TDelivery,
        "id" | "name"
    > | null>(
        production.delivery
            ? { id: production.delivery.id, name: production.delivery.name }
            : null,
    );
    const [selectedMenuTypes, setSelectedMenuTypes] = useState<
        Record<number, Pick<TMenuType, "id" | "name">>
    >(() => {
        const initial: Record<number, Pick<TMenuType, "id" | "name">> = {};
        production.lines?.forEach((line, index) => {
            if (line.menu_type?.id) {
                initial[index] = { id: line.menu_type.id, name: line.menu_type.name };
            }
        });
        return initial;
    });
    const [selectedExtraProducts, setSelectedExtraProducts] = useState<
        Record<number, Pick<TExtraProduct, "id" | "name">>
    >(() => {
        const initial: Record<number, Pick<TExtraProduct, "id" | "name">> = {};
        production.extras?.forEach((extra, index) => {
            if (extra.extra_product?.id) {
                initial[index] = {
                    id: extra.extra_product.id,
                    name: extra.extra_product.name,
                };
            }
        });
        return initial;
    });

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { isSubmitting },
    } = useForm<EditDailyProductionForm>({
        mode: "onBlur",
        defaultValues: {
            fulfillment_type: production.fulfillment_type,
            delivery_id: production.delivery?.id ?? "",
            notes: production.notes ?? "",
            lines: getDefaultLines(production),
            extras: getDefaultExtras(production),
        },
    });

    const {
        fields: lineFields,
        append: appendLine,
        remove: removeLine,
    } = useFieldArray({
        control,
        name: "lines",
    });

    const {
        fields: extraFields,
        append: appendExtra,
        remove: removeExtra,
    } = useFieldArray({
        control,
        name: "extras",
    });

    const fulfillmentType = useWatch({
        control,
        name: "fulfillment_type",
    });
    const lines = useWatch({
        control,
        name: "lines",
    });
    const extras = useWatch({
        control,
        name: "extras",
    });

    function handleOpenChange(value: boolean) {
        if (!value) {
            reset();
        }
        onOpenChange(value);
    }

    function usedMenuTypeIds(currentIndex: number) {
        return new Set(
            lines
                ?.map((line, index) => (index === currentIndex ? "" : line.menu_type_id))
                .filter(Boolean),
        );
    }

    function usedExtraProductIds(currentIndex: number) {
        return new Set(
            extras
                ?.map((extra, index) =>
                    index === currentIndex ? "" : extra.extra_product_id,
                )
                .filter(Boolean),
        );
    }

    async function onSubmit(data: EditDailyProductionForm) {
        if (data.fulfillment_type === "DELIVERY" && !data.delivery_id) {
            toast.error("Seleccioná un repartidor para el delivery");
            return;
        }

        const completeLines = data.lines.filter((line) => line.menu_type_id);
        const completeExtras = data.extras.filter((extra) => extra.extra_product_id);
        if (completeLines.length === 0 && completeExtras.length === 0) {
            toast.error("Debe quedar al menos un menú o un producto");
            return;
        }
        if (
            new Set(completeExtras.map((extra) => extra.extra_product_id)).size !==
            completeExtras.length
        ) {
            toast.error("No repitas productos en la misma producción");
            return;
        }

        try {
            const updateResult = await updateDailyProductionAction(
                {
                    id: production.id,
                    fulfillment_type: data.fulfillment_type,
                    delivery_id:
                        data.fulfillment_type === "DELIVERY" ? data.delivery_id : "",
                    notes: data.notes,
                },
                production.production_date,
            );

            if (!updateResult.success) {
                toast.error(updateResult.error);
                return;
            }

            const originalLines = production.lines ?? [];
            const submittedLineIds = new Set(
                completeLines
                    .map((line) => line.line_id)
                    .filter((lineId): lineId is string => Boolean(lineId)),
            );

            for (const originalLine of originalLines) {
                if (submittedLineIds.has(originalLine.id)) {
                    continue;
                }

                const deleteResult = await deleteDailyProductionLineAction(
                    production.id,
                    originalLine.id,
                    production.production_date,
                );

                if (!deleteResult.success) {
                    toast.error(deleteResult.error);
                    return;
                }
            }

            for (const line of completeLines) {
                const originalLine = line.line_id
                    ? originalLines.find((item) => item.id === line.line_id)
                    : undefined;
                const originalMenuTypeId = originalLine?.menu_type?.id;

                if (
                    line.line_id &&
                    originalMenuTypeId &&
                    originalMenuTypeId !== line.menu_type_id
                ) {
                    const deleteResult = await deleteDailyProductionLineAction(
                        production.id,
                        line.line_id,
                        production.production_date,
                    );

                    if (!deleteResult.success) {
                        toast.error(deleteResult.error);
                        return;
                    }
                }

                const lineResult = await upsertDailyProductionLineAction(
                    production.id,
                    {
                        menu_type_id: line.menu_type_id,
                        quantity: Number(line.quantity),
                    },
                    production.production_date,
                );

                if (!lineResult.success) {
                    toast.error(lineResult.error);
                    return;
                }
            }

            const originalExtras = production.extras ?? [];
            const submittedExtraIds = new Set(
                completeExtras
                    .map((extra) => extra.extra_id)
                    .filter((extraId): extraId is string => Boolean(extraId)),
            );

            for (const originalExtra of originalExtras) {
                if (submittedExtraIds.has(originalExtra.id)) {
                    continue;
                }

                const deleteResult = await deleteDailyProductionExtraAction(
                    production.id,
                    originalExtra.id,
                    production.production_date,
                );

                if (!deleteResult.success) {
                    toast.error(deleteResult.error);
                    return;
                }
            }

            for (const extra of completeExtras) {
                const payload = {
                    extra_product_id: extra.extra_product_id,
                    quantity: Number(extra.quantity),
                };

                const extraResult = extra.extra_id
                    ? await updateDailyProductionExtraAction(
                          production.id,
                          extra.extra_id,
                          payload,
                          production.production_date,
                      )
                    : await addDailyProductionExtraAction(
                          production.id,
                          payload,
                          production.production_date,
                      );

                if (!extraResult.success) {
                    toast.error(extraResult.error);
                    return;
                }
            }

            toast.success("Producción actualizada correctamente");
            router.refresh();
            onOpenChange(false);
        } catch (error) {
            console.error(error);
            toast.error("Error inesperado al actualizar la producción");
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-base font-semibold">
                        Editar Producción
                    </DialogTitle>
                    <DialogDescription>
                        Corregí la entrega, notas o cantidades cargadas para{" "}
                        <strong>{production.customer?.name ?? "este cliente"}</strong>.
                    </DialogDescription>
                </DialogHeader>

                <form id="edit-daily-production-form" onSubmit={handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <Controller
                                name="fulfillment_type"
                                control={control}
                                render={({ field }) => (
                                    <Field>
                                        <FieldLabel>Tipo de entrega</FieldLabel>
                                        <Select
                                            value={field.value}
                                            onValueChange={(value) => {
                                                field.onChange(value as TFulfillmentType);
                                                if (value !== "DELIVERY") {
                                                    setValue("delivery_id", "");
                                                }
                                            }}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Seleccionar tipo" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.entries(fulfillmentLabels).map(
                                                    ([value, label]) => (
                                                        <SelectItem key={value} value={value}>
                                                            {label}
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </Field>
                                )}
                            />

                            {fulfillmentType === "DELIVERY" ? (
                                <Controller
                                    name="delivery_id"
                                    control={control}
                                    render={({ field }) => (
                                        <Field>
                                            <FieldLabel>Repartidor</FieldLabel>
                                            <DeliverySearchInput
                                                value={field.value}
                                                selectedDelivery={selectedDelivery}
                                                onValueChange={(deliveryId, delivery) => {
                                                    field.onChange(deliveryId);
                                                    setSelectedDelivery(
                                                        delivery
                                                            ? { id: delivery.id, name: delivery.name }
                                                            : null,
                                                    );
                                                }}
                                            />
                                        </Field>
                                    )}
                                />
                            ) : null}
                        </div>

                        <Controller
                            name="notes"
                            control={control}
                            render={({ field }) => (
                                <Field>
                                    <FieldLabel htmlFor={field.name}>Notas</FieldLabel>
                                    <textarea
                                        id={field.name}
                                        name={field.name}
                                        value={field.value ?? ""}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                        placeholder="Observaciones de producción o entrega..."
                                        className="min-h-20 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                                    />
                                </Field>
                            )}
                        />

                        <Field>
                            <div className="flex items-center justify-between gap-3">
                                <FieldLabel>Menús y cantidades</FieldLabel>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => appendLine(emptyLine())}
                                >
                                    <Plus data-icon="inline-start" />
                                    Agregar menú
                                </Button>
                            </div>

                            <div className="space-y-2">
                                {lineFields.map((line, index) => {
                                    const disabledIds = usedMenuTypeIds(index);

                                    return (
                                        <div
                                            key={line.id}
                                            className="grid gap-2 rounded-lg border bg-background p-3 sm:grid-cols-[1fr_auto_auto]"
                                        >
                                            <Controller
                                                name={`lines.${index}.menu_type_id`}
                                                control={control}
                                                render={({ field, fieldState }) => (
                                                    <Field data-invalid={fieldState.invalid}>
                                                        <MenuTypeSearchInput
                                                            value={field.value}
                                                            selectedMenuType={
                                                                selectedMenuTypes[index] ??
                                                                (field.value &&
                                                                production.lines?.[index]
                                                                    ?.menu_type
                                                                    ? {
                                                                          id: production.lines[index]
                                                                              .menu_type!.id,
                                                                          name: production.lines[
                                                                              index
                                                                          ].menu_type!.name,
                                                                      }
                                                                    : null)
                                                            }
                                                            disabledIds={disabledIds}
                                                            activeOnly
                                                            onValueChange={(
                                                                menuTypeId,
                                                                menuType,
                                                            ) => {
                                                                field.onChange(menuTypeId);
                                                                setSelectedMenuTypes((prev) => {
                                                                    const next = { ...prev };
                                                                    if (menuType) {
                                                                        next[index] = {
                                                                            id: menuType.id,
                                                                            name: menuType.name,
                                                                        };
                                                                    } else {
                                                                        delete next[index];
                                                                    }
                                                                    return next;
                                                                });
                                                            }}
                                                        />
                                                        {fieldState.invalid && (
                                                            <FieldError errors={[fieldState.error]} />
                                                        )}
                                                    </Field>
                                                )}
                                            />

                                            <Controller
                                                name={`lines.${index}.quantity`}
                                                control={control}
                                                render={({ field }) => (
                                                    <Field>
                                                        <div className="flex items-center gap-1">
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="icon-sm"
                                                                onClick={() =>
                                                                    field.onChange(
                                                                        Math.max(1, Number(field.value) - 1),
                                                                    )
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
                                                                    field.onChange(
                                                                        Number(event.target.value || 1),
                                                                    )
                                                                }
                                                                className="h-8 w-16 text-center"
                                                                aria-label="Cantidad"
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="icon-sm"
                                                                onClick={() =>
                                                                    field.onChange(Number(field.value) + 1)
                                                                }
                                                                aria-label="Aumentar cantidad"
                                                            >
                                                                <Plus className="size-3.5" />
                                                            </Button>
                                                        </div>
                                                    </Field>
                                                )}
                                            />

                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                disabled={
                                                    lineFields.length === 1 &&
                                                    completeExtrasCount(extras) === 0
                                                }
                                                onClick={() => removeLine(index)}
                                                className="justify-self-start text-muted-foreground sm:justify-self-end"
                                            >
                                                Quitar
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>
                        </Field>

                        <Field>
                            <div className="flex items-center justify-between gap-3">
                                <FieldLabel>Productos y cantidades</FieldLabel>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => appendExtra(emptyExtra())}
                                >
                                    <Plus data-icon="inline-start" />
                                    Agregar producto
                                </Button>
                            </div>

                            <div className="space-y-2">
                                {extraFields.map((extra, index) => {
                                    const disabledIds = usedExtraProductIds(index);

                                    return (
                                        <div
                                            key={extra.id}
                                            className="grid gap-2 rounded-lg border bg-background p-3 sm:grid-cols-[1fr_auto_auto]"
                                        >
                                            <Controller
                                                name={`extras.${index}.extra_product_id`}
                                                control={control}
                                                render={({ field, fieldState }) => (
                                                    <Field data-invalid={fieldState.invalid}>
                                                        <ExtraProductSearchInput
                                                            value={field.value}
                                                            selectedProduct={
                                                                selectedExtraProducts[index] ??
                                                                (field.value &&
                                                                production.extras?.[index]
                                                                    ?.extra_product
                                                                    ? {
                                                                          id: production.extras[index]
                                                                              .extra_product!.id,
                                                                          name: production.extras[
                                                                              index
                                                                          ].extra_product!.name,
                                                                      }
                                                                    : null)
                                                            }
                                                            disabledIds={disabledIds}
                                                            onValueChange={(productId, product) => {
                                                                field.onChange(productId);
                                                                setSelectedExtraProducts((prev) => {
                                                                    const next = { ...prev };
                                                                    if (product) {
                                                                        next[index] = {
                                                                            id: product.id,
                                                                            name: product.name,
                                                                        };
                                                                    } else {
                                                                        delete next[index];
                                                                    }
                                                                    return next;
                                                                });
                                                            }}
                                                        />
                                                        {fieldState.invalid && (
                                                            <FieldError errors={[fieldState.error]} />
                                                        )}
                                                    </Field>
                                                )}
                                            />

                                            <Controller
                                                name={`extras.${index}.quantity`}
                                                control={control}
                                                render={({ field }) => (
                                                    <Field>
                                                        <div className="flex items-center gap-1">
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="icon-sm"
                                                                onClick={() =>
                                                                    field.onChange(
                                                                        Math.max(1, Number(field.value) - 1),
                                                                    )
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
                                                                    field.onChange(
                                                                        Number(event.target.value || 1),
                                                                    )
                                                                }
                                                                className="h-8 w-16 text-center"
                                                                aria-label="Cantidad"
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="icon-sm"
                                                                onClick={() =>
                                                                    field.onChange(Number(field.value) + 1)
                                                                }
                                                                aria-label="Aumentar cantidad"
                                                            >
                                                                <Plus className="size-3.5" />
                                                            </Button>
                                                        </div>
                                                    </Field>
                                                )}
                                            />

                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                disabled={
                                                    extraFields.length === 1 &&
                                                    (lines?.filter((line) => line.menu_type_id).length ??
                                                        0) === 0
                                                }
                                                onClick={() => removeExtra(index)}
                                                className="justify-self-start text-muted-foreground sm:justify-self-end"
                                            >
                                                Quitar
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>
                        </Field>
                    </FieldGroup>
                </form>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancelar</Button>
                    </DialogClose>
                    <Button
                        variant="brand"
                        type="submit"
                        form="edit-daily-production-form"
                        disabled={isSubmitting}
                    >
                        <Save data-icon="inline-start" />
                        {isSubmitting ? "Guardando..." : "Guardar cambios"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
