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
import { buildPageHref, resetPageParam } from "@/lib/pagination-params";
import { ProductionDateSelector } from "./production-date-selector";
import { DeliveryUrlFilter, MenuTypeUrlFilter } from "./production-url-filters";

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
};

export function DailyProductionFilters({
    date,
    filters,
}: DailyProductionFiltersProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    function navigate(params: URLSearchParams) {
        router.replace(buildPageHref(pathname, params), { scroll: false });
    }

    function updateParams(updater: (params: URLSearchParams) => void) {
        const params = resetPageParam(new URLSearchParams(searchParams.toString()));
        updater(params);
        navigate(params);
    }

    function handleFulfillmentChange(value: string) {
        updateParams((params) => {
            if (value === ALL_VALUE) {
                params.delete("fulfillment_type");
            } else {
                params.set("fulfillment_type", value);
            }

            if (value !== "DELIVERY") {
                params.delete("delivery_id");
            }
        });
    }

    function handleQuantitySortChange(value: string) {
        updateParams((params) => {
            if (value === ALL_VALUE) {
                params.delete("sort");
                params.delete("order");
            } else {
                params.set("sort", "quantity");
                params.set("order", value);
            }
        });
    }

    return (
        <div className="flex flex-col gap-3 rounded-xl border bg-card px-4 py-3 shadow-xs md:flex-row md:flex-wrap md:items-center">
            <ProductionDateSelector date={date} />

            <MenuTypeUrlFilter
                menuTypeId={filters?.menu_type_id}
                onChange={navigate}
            />

            <div className="w-full md:w-auto">
                <Select
                    value={filters?.fulfillment_type ?? ALL_VALUE}
                    onValueChange={handleFulfillmentChange}
                >
                    <SelectTrigger
                        size="sm"
                        className="h-8 w-full border-border bg-muted text-sm md:w-44"
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
            </div>

            <DeliveryUrlFilter
                deliveryId={filters?.delivery_id}
                onChange={navigate}
            />

            <div className="w-full md:w-auto">
                <Select
                    value={
                        filters?.sort === "quantity"
                            ? (filters.order ?? "desc")
                            : ALL_VALUE
                    }
                    onValueChange={handleQuantitySortChange}
                >
                    <SelectTrigger
                        size="sm"
                        className="h-8 w-full border-border bg-muted text-sm md:w-52"
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
            </div>

            <SearchInput q={filters?.q} className="w-full md:w-64" />
        </div>
    );
}
