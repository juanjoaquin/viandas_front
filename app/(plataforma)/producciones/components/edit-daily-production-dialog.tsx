"use client";

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { deleteDailyProductionLineAction } from "@/src/architecture/actions/daily-production/delete-daily-production-line.action";
import { updateDailyProductionAction } from "@/src/architecture/actions/daily-production/update-daily-production.action";
import { upsertDailyProductionLineAction } from "@/src/architecture/actions/daily-production/upsert-daily-production-line.action";
import {
    TDailyProduction,
    TFulfillmentType,
} from "@/src/architecture/core/domain/entities/DailyProduction";
import { TDelivery } from "@/src/architecture/core/domain/entities/Delivery";
import { TMenuType } from "@/src/architecture/core/domain/entities/MenuType";

type EditLineForm = {
    line_id?: string;
    menu_type_id: string;
    quantity: number;
};

type EditDailyProductionForm = {
    fulfillment_type: TFulfillmentType;
    delivery_id: string;
    notes: string;
    lines: EditLineForm[];
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

type EditDailyProductionDialogProps = {
    production: TDailyProduction;
    deliveries: TDelivery[];
    menuTypes: TMenuType[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function EditDailyProductionDialog({
    production,
    deliveries,
    menuTypes,
    open,
    onOpenChange,
}: EditDailyProductionDialogProps) {
    const router = useRouter();

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
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "lines",
    });

    const fulfillmentType = useWatch({
        control,
        name: "fulfillment_type",
    });
    const lines = useWatch({
        control,
        name: "lines",
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

    async function onSubmit(data: EditDailyProductionForm) {
        if (data.fulfillment_type === "DELIVERY" && !data.delivery_id) {
            toast.error("Seleccioná un repartidor para el delivery");
            return;
        }

        const completeLines = data.lines.filter((line) => line.menu_type_id);
        if (completeLines.length === 0) {
            toast.error("Debe quedar al menos un menú cargado");
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
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Seleccionar repartidor" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {deliveries
                                                        .filter(
                                                            (delivery) =>
                                                                delivery.active ||
                                                                delivery.id === production.delivery?.id,
                                                        )
                                                        .map((delivery) => (
                                                            <SelectItem
                                                                key={delivery.id}
                                                                value={delivery.id}
                                                            >
                                                                {delivery.name}
                                                            </SelectItem>
                                                        ))}
                                                </SelectContent>
                                            </Select>
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
                                    onClick={() => append(emptyLine())}
                                >
                                    <Plus data-icon="inline-start" />
                                    Agregar menú
                                </Button>
                            </div>

                            <div className="space-y-2">
                                {fields.map((line, index) => {
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
                                                        <Select
                                                            value={field.value}
                                                            onValueChange={field.onChange}
                                                        >
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Seleccionar tipo de menú" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {menuTypes
                                                                    .filter(
                                                                        (menuType) =>
                                                                            menuType.active ||
                                                                            menuType.id === field.value,
                                                                    )
                                                                    .map((menuType) => (
                                                                        <SelectItem
                                                                            key={menuType.id}
                                                                            value={menuType.id}
                                                                            disabled={disabledIds.has(menuType.id)}
                                                                        >
                                                                            {menuType.name}
                                                                        </SelectItem>
                                                                    ))}
                                                            </SelectContent>
                                                        </Select>
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
                                                disabled={fields.length === 1}
                                                onClick={() => remove(index)}
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
