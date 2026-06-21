"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, FieldErrors, useFieldArray, useForm, useWatch } from "react-hook-form";
import { Minus, PackagePlus, Plus, Trash2, UtensilsCrossed } from "lucide-react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CustomerSearchInput } from "@/components/custom/inputs/customer-search-input";
import { DeliverySearchInput } from "@/components/custom/inputs/delivery-search-input";
import { ExtraProductSearchInput } from "@/components/custom/inputs/extra-product-search-input";
import { MenuTypeSearchInput } from "@/components/custom/inputs/menu-type-search-input";
import { createDailyProductionWithExtrasAction } from "@/src/architecture/actions/daily-production/create-daily-production-with-extras.action";
import {
    CreateDailyProductionFormInput,
    TFulfillmentType,
    createDailyProductionFormInputSchema,
} from "@/src/architecture/core/domain/entities/DailyProduction";
import { TCustomer } from "@/src/architecture/core/domain/entities/Customer";
import { TDelivery } from "@/src/architecture/core/domain/entities/Delivery";
import { TExtraProduct } from "@/src/architecture/core/domain/entities/ExtraProduct";
import { TMenuType } from "@/src/architecture/core/domain/entities/MenuType";

const fulfillmentLabels: Record<TFulfillmentType, string> = {
    PENDING: "Pendiente",
    DELIVERY: "Delivery",
    PICKUP: "Retiro en local",
};

function RequiredMark() {
    return (
        <span className="text-destructive" aria-hidden="true">
            {" "}
            *
        </span>
    );
}

function emptyLine() {
    return {
        menu_type_id: "",
        quantity: 1,
    };
}

function emptyExtra() {
    return {
        extra_product_id: "",
        quantity: 1,
    };
}

function hasOrderItemsError(errors: FieldErrors<CreateDailyProductionFormInput>): boolean {
    if (errors.lines?.[0]?.menu_type_id) {
        return true;
    }

    if (errors.extras?.[0]?.extra_product_id) {
        return true;
    }

    return false;
}

function getOrderItemsErrorMessage(
    errors: FieldErrors<CreateDailyProductionFormInput>,
): string | undefined {
    return (
        errors.lines?.[0]?.menu_type_id?.message ??
        errors.extras?.[0]?.extra_product_id?.message
    );
}

type CreateDailyProductionDialogProps = {
    initialDate: string;
};

export function CreateDailyProductionDialog({
    initialDate,
}: CreateDailyProductionDialogProps) {
    const [open, setOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] =
        useState<Pick<TCustomer, "id" | "name" | "type"> | null>(null);
    const [selectedDelivery, setSelectedDelivery] = useState<Pick<
        TDelivery,
        "id" | "name"
    > | null>(null);
    const [selectedMenuTypes, setSelectedMenuTypes] = useState<
        Record<number, Pick<TMenuType, "id" | "name">>
    >({});
    const [selectedExtraProducts, setSelectedExtraProducts] = useState<
        Record<number, Pick<TExtraProduct, "id" | "name">>
    >({});
    const router = useRouter();

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { isSubmitting, errors },
    } = useForm<CreateDailyProductionFormInput>({
        resolver: zodResolver(createDailyProductionFormInputSchema),
        mode: "onSubmit",
        reValidateMode: "onChange",
        shouldFocusError: true,
        defaultValues: {
            production_date: initialDate,
            customer_id: "",
            fulfillment_type: "PENDING",
            delivery_id: "",
            notes: "",
            lines: [emptyLine()],
            extras: [],
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

    function resetForm() {
        reset({
            production_date: initialDate,
            customer_id: "",
            fulfillment_type: "PENDING",
            delivery_id: "",
            notes: "",
            lines: [emptyLine()],
            extras: [],
        });
        setSelectedCustomer(null);
        setSelectedDelivery(null);
        setSelectedMenuTypes({});
        setSelectedExtraProducts({});
    }

    function handleOpenChange(value: boolean) {
        resetForm();
        setOpen(value);
    }

    const orderItemsErrorMessage = getOrderItemsErrorMessage(errors);
    const showOrderItemsError = hasOrderItemsError(errors);

    async function onSubmit(data: CreateDailyProductionFormInput) {
        const validation = createDailyProductionFormInputSchema.safeParse(data);
        if (!validation.success) {
            return;
        }

        try {
            const result = await createDailyProductionWithExtrasAction(data);

            if (result.success) {
                toast.success("Producción creada correctamente");
                router.refresh();
                handleOpenChange(false);
                return;
            }

            if (result.code === "PARTIAL") {
                toast.warning(result.error);
                router.refresh();
                handleOpenChange(false);
                return;
            }

            toast.error(result.error);
        } catch (error) {
            console.error(error);
            toast.error("Error inesperado al crear la producción");
        }
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

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="brand">
                    <Plus data-icon="inline-start" />
                    Nueva Producción
                </Button>
            </DialogTrigger>

            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="text-base font-semibold">
                        Crear Producción Diaria
                    </DialogTitle>
                    <DialogDescription>
                        Cargá el cliente, entrega y al menos una vianda o un producto.
                    </DialogDescription>
                </DialogHeader>

                <form
                    id="create-daily-production-form"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <FieldGroup>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <Controller
                                name="production_date"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Fecha de producción
                                            <RequiredMark />
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            type="date"
                                            aria-invalid={fieldState.invalid}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="customer_id"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor={field.name}>
                                            Cliente
                                            <RequiredMark />
                                        </FieldLabel>
                                        <CustomerSearchInput
                                            id={field.name}
                                            value={field.value}
                                            selectedCustomer={selectedCustomer}
                                            onValueChange={(customerId, customer) => {
                                                field.onChange(customerId);
                                                setSelectedCustomer(customer ?? null);
                                            }}
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <Controller
                                name="fulfillment_type"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>
                                            Tipo de entrega
                                            <RequiredMark />
                                        </FieldLabel>
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
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            {fulfillmentType === "DELIVERY" ? (
                                <Controller
                                    name="delivery_id"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel>
                                                Repartidor
                                                <RequiredMark />
                                            </FieldLabel>
                                            <DeliverySearchInput
                                                value={field.value ?? ""}
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
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />
                            ) : null}
                        </div>

                        <Controller
                            name="notes"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Notas</FieldLabel>
                                    <textarea
                                        id={field.name}
                                        value={field.value ?? ""}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                        name={field.name}
                                        placeholder="Ej. Sin sal, sin gluten, observaciones de entrega..."
                                        aria-invalid={fieldState.invalid}
                                        className="min-h-20 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Field
                            data-invalid={
                                showOrderItemsError || Boolean(errors.lines?.[0]?.menu_type_id)
                            }
                        >
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

                            {orderItemsErrorMessage && lineFields.length > 0 ? (
                                <FieldError
                                    errors={[{ message: orderItemsErrorMessage }]}
                                />
                            ) : null}

                            <div className="space-y-2">
                                {lineFields.map((line, index) => {
                                    const disabledIds = usedMenuTypeIds(index);
                                    const lineMenuError = errors.lines?.[index]?.menu_type_id;

                                    return (
                                        <div
                                            key={line.id}
                                            className="grid gap-2 rounded-lg border bg-background p-3 sm:grid-cols-[1fr_auto_auto]"
                                        >
                                                <Controller
                                                    name={`lines.${index}.menu_type_id`}
                                                    control={control}
                                                    render={({ field, fieldState }) => (
                                                        <Field
                                                            data-invalid={
                                                                fieldState.invalid ||
                                                                Boolean(lineMenuError)
                                                            }
                                                        >
                                                            <MenuTypeSearchInput
                                                                value={field.value ?? ""}
                                                                selectedMenuType={
                                                                    selectedMenuTypes[index] ??
                                                                    null
                                                                }
                                                                disabledIds={disabledIds}
                                                                activeOnly
                                                                onValueChange={(
                                                                    menuTypeId,
                                                                    menuType,
                                                                ) => {
                                                                    field.onChange(menuTypeId);
                                                                    setSelectedMenuTypes(
                                                                        (prev) => {
                                                                            const next = {
                                                                                ...prev,
                                                                            };
                                                                            if (menuType) {
                                                                                next[index] = {
                                                                                    id: menuType.id,
                                                                                    name: menuType.name,
                                                                                };
                                                                            } else {
                                                                                delete next[index];
                                                                            }
                                                                            return next;
                                                                        },
                                                                    );
                                                                }}
                                                            />
                                                            {fieldState.invalid && (
                                                                <FieldError
                                                                    errors={[fieldState.error]}
                                                                />
                                                            )}
                                                        </Field>
                                                    )}
                                                />

                                                <Controller
                                                    name={`lines.${index}.quantity`}
                                                    control={control}
                                                    render={({ field, fieldState }) => (
                                                        <Field data-invalid={fieldState.invalid}>
                                                            <div className="flex items-center gap-1">
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="icon-sm"
                                                                    onClick={() =>
                                                                        field.onChange(
                                                                            Math.max(
                                                                                1,
                                                                                Number(field.value) -
                                                                                    1,
                                                                            ),
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
                                                                            Number(
                                                                                event.target
                                                                                    .value || 1,
                                                                            ),
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
                                                                        field.onChange(
                                                                            Number(field.value) + 1,
                                                                        )
                                                                    }
                                                                    aria-label="Aumentar cantidad"
                                                                >
                                                                    <Plus className="size-3.5" />
                                                                </Button>
                                                            </div>
                                                            {fieldState.invalid && (
                                                                <FieldError
                                                                    errors={[fieldState.error]}
                                                                />
                                                            )}
                                                        </Field>
                                                    )}
                                                />

                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    disabled={lineFields.length === 1}
                                                    onClick={() => removeLine(index)}
                                                    aria-label="Eliminar línea"
                                                    className="justify-self-start text-muted-foreground hover:text-destructive sm:justify-self-end"
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </div>
                                        );
                                })}
                            </div>
                        </Field>

                        <Field
                            data-invalid={
                                showOrderItemsError ||
                                Boolean(errors.extras?.[0]?.extra_product_id)
                            }
                        >
                            <div className="flex items-center justify-between gap-3">
                                <FieldLabel>Productos y cantidades</FieldLabel>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => appendExtra(emptyExtra())}
                                >
                                    <PackagePlus data-icon="inline-start" />
                                    Agregar producto
                                </Button>
                            </div>

                            {orderItemsErrorMessage &&
                            extraFields.length > 0 &&
                            !errors.lines?.[0]?.menu_type_id ? (
                                <FieldError
                                    errors={[{ message: orderItemsErrorMessage }]}
                                />
                            ) : null}

                            <div className="space-y-2">
                                {extraFields.length === 0 ? (
                                    <p className="rounded-lg border border-dashed px-3 py-4 text-sm text-muted-foreground">
                                        Sin productos cargados. Podés agregar uno o cargar
                                        solo viandas.
                                    </p>
                                ) : (
                                    extraFields.map((extra, index) => {
                                        const disabledIds = usedExtraProductIds(index);
                                        const extraProductError =
                                            errors.extras?.[index]?.extra_product_id;

                                        return (
                                            <div
                                                key={extra.id}
                                                className="grid gap-2 rounded-lg border bg-background p-3 sm:grid-cols-[1fr_auto_auto]"
                                            >
                                                <Controller
                                                    name={`extras.${index}.extra_product_id`}
                                                    control={control}
                                                    render={({ field, fieldState }) => (
                                                        <Field
                                                            data-invalid={
                                                                fieldState.invalid ||
                                                                Boolean(extraProductError)
                                                            }
                                                        >
                                                            <ExtraProductSearchInput
                                                                value={field.value ?? ""}
                                                                selectedProduct={
                                                                    selectedExtraProducts[
                                                                        index
                                                                    ] ?? null
                                                                }
                                                                disabledIds={disabledIds}
                                                                onValueChange={(
                                                                    productId,
                                                                    product,
                                                                ) => {
                                                                    field.onChange(productId);
                                                                    setSelectedExtraProducts(
                                                                        (prev) => {
                                                                            const next = {
                                                                                ...prev,
                                                                            };
                                                                            if (product) {
                                                                                next[index] = {
                                                                                    id: product.id,
                                                                                    name: product.name,
                                                                                };
                                                                            } else {
                                                                                delete next[index];
                                                                            }
                                                                            return next;
                                                                        },
                                                                    );
                                                                }}
                                                            />
                                                            {fieldState.invalid && (
                                                                <FieldError
                                                                    errors={[fieldState.error]}
                                                                />
                                                            )}
                                                        </Field>
                                                    )}
                                                />

                                                <Controller
                                                    name={`extras.${index}.quantity`}
                                                    control={control}
                                                    render={({ field, fieldState }) => (
                                                        <Field data-invalid={fieldState.invalid}>
                                                            <div className="flex items-center gap-1">
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="icon-sm"
                                                                    onClick={() =>
                                                                        field.onChange(
                                                                            Math.max(
                                                                                1,
                                                                                Number(field.value) -
                                                                                    1,
                                                                            ),
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
                                                                            Number(
                                                                                event.target
                                                                                    .value || 1,
                                                                            ),
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
                                                                        field.onChange(
                                                                            Number(field.value) + 1,
                                                                        )
                                                                    }
                                                                    aria-label="Aumentar cantidad"
                                                                >
                                                                    <Plus className="size-3.5" />
                                                                </Button>
                                                            </div>
                                                            {fieldState.invalid && (
                                                                <FieldError
                                                                    errors={[fieldState.error]}
                                                                />
                                                            )}
                                                        </Field>
                                                    )}
                                                />

                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    onClick={() => removeExtra(index)}
                                                    aria-label="Eliminar producto"
                                                    className="justify-self-start text-muted-foreground hover:text-destructive sm:justify-self-end"
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </div>
                                        );
                                    })
                                )}
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
                        form="create-daily-production-form"
                        disabled={isSubmitting}
                    >
                        <UtensilsCrossed data-icon="inline-start" />
                        {isSubmitting ? "Guardando..." : "Guardar Producción"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
