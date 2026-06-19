"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SearchInput } from "@/components/custom/search-input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    TDailyProductionFilters,
    TSortOrder,
    TFulfillmentType,
} from "@/src/architecture/core/domain/entities/DailyProduction";
import { TDelivery } from "@/src/architecture/core/domain/entities/Delivery";
import { TMenuType } from "@/src/architecture/core/domain/entities/MenuType";
import { ProductionDateSelector } from "./production-date-selector";

const ALL_VALUE = "all";

const fulfillmentOptions: Array<{
    label: string;
    value: TFulfillmentType | typeof ALL_VALUE;
}> = [
    { label: "Entregas", value: ALL_VALUE },
    { label: "Pendientes", value: "PENDING" },
    { label: "Delivery", value: "DELIVERY" },
    { label: "Retiro en local", value: "PICKUP" },
];

const quantitySortOptions: Array<{
    label: string;
    value: TSortOrder;
}> = [
    { label: "Mayor cantidad primero", value: "desc" },
    { label: "Menor cantidad primero", value: "asc" },
];

type DailyProductionFiltersProps = {
    date: string;
    filters?: TDailyProductionFilters;
    menuTypes: TMenuType[];
    deliveries: TDelivery[];
};

export function DailyProductionFilters({
    date,
    filters,
    menuTypes,
    deliveries,
}: DailyProductionFiltersProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    function navigate(params: URLSearchParams) {
        const qs = params.toString();
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }

    function handleFulfillmentChange(value: string) {
        const params = new URLSearchParams(searchParams.toString());
        if (value === ALL_VALUE) {
            params.delete("fulfillment_type");
        } else {
            params.set("fulfillment_type", value);
        }

        if (value !== "DELIVERY") {
            params.delete("delivery_id");
        }

        navigate(params);
    }

    function handleMenuTypeChange(value: string) {
        const params = new URLSearchParams(searchParams.toString());
        if (value === ALL_VALUE) {
            params.delete("menu_type_id");
        } else {
            params.set("menu_type_id", value);
        }
        navigate(params);
    }

    function handleDeliveryChange(value: string) {
        const params = new URLSearchParams(searchParams.toString());
        if (value === ALL_VALUE) {
            params.delete("delivery_id");
        } else {
            params.set("delivery_id", value);
            params.set("fulfillment_type", "DELIVERY");
        }
        navigate(params);
    }

    function handleQuantitySortChange(value: string) {
        const params = new URLSearchParams(searchParams.toString());
        if (value === ALL_VALUE) {
            params.delete("sort");
            params.delete("order");
        } else {
            params.set("sort", "quantity");
            params.set("order", value);
        }
        navigate(params);
    }

    return (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-card px-4 py-3 shadow-xs">
            <ProductionDateSelector date={date} />

            <Select
                value={filters?.menu_type_id ?? ALL_VALUE}
                onValueChange={handleMenuTypeChange}
                disabled={menuTypes.length === 0}
            >
                <SelectTrigger
                    size="sm"
                    className="h-8 w-48 border-slate-200/70 bg-slate-100 text-sm dark:border-slate-700 dark:bg-slate-800/60"
                >
                    <SelectValue
                        placeholder={
                            menuTypes.length === 0 ? "Sin tipos de menú" : "Menú"
                        }
                    />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={ALL_VALUE}>Todos los menús</SelectItem>
                    {menuTypes.map((menuType) => (
                        <SelectItem key={menuType.id} value={menuType.id}>
                            {menuType.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={filters?.fulfillment_type ?? ALL_VALUE}
                onValueChange={handleFulfillmentChange}
            >
                <SelectTrigger
                    size="sm"
                    className="h-8 w-44 border-slate-200/70 bg-slate-100 text-sm dark:border-slate-700 dark:bg-slate-800/60"
                >
                    <SelectValue placeholder="Entrega" />
                </SelectTrigger>
                <SelectContent>
                    {fulfillmentOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={filters?.delivery_id ?? ALL_VALUE}
                onValueChange={handleDeliveryChange}
                disabled={deliveries.length === 0}
            >
                <SelectTrigger
                    size="sm"
                    className="h-8 w-48 border-slate-200/70 bg-slate-100 text-sm dark:border-slate-700 dark:bg-slate-800/60"
                >
                    <SelectValue
                        placeholder={
                            deliveries.length === 0 ? "Sin repartidores" : "Repartidor"
                        }
                    />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={ALL_VALUE}>Todos los repartidores</SelectItem>
                    {deliveries.map((delivery) => (
                        <SelectItem key={delivery.id} value={delivery.id}>
                            {delivery.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={
                    filters?.sort === "quantity" ? (filters.order ?? "desc") : ALL_VALUE
                }
                onValueChange={handleQuantitySortChange}
            >
                <SelectTrigger
                    size="sm"
                    className="h-8 w-52 border-slate-200/70 bg-slate-100 text-sm dark:border-slate-700 dark:bg-slate-800/60"
                >
                    <SelectValue placeholder="Orden" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={ALL_VALUE}>Orden de carga</SelectItem>
                    {quantitySortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <SearchInput q={filters?.q} />
        </div>
    );
}
