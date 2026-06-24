import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Producción Diaria",
    description: "Gestioná las viandas de cada día por cliente, entrega y tipo de menú.",
};
import {
    dailyProductionSortOptions,
    fulfillmentTypes,
    sortOrderOptions,
    TDailyProductionFilters,
} from "@/src/architecture/core/domain/entities/DailyProduction";
import { PageHeader } from "../components/page-header";
import { CreateDailyProductionDialog } from "./components/create-daily-production-dialog";
import { DailyProductionFilters } from "./components/daily-production-filters";
import { DailyProductionsData } from "./components/daily-productions-data";
import { DailyProductionsSkeleton } from "./components/daily-productions-skeleton";

type ProduccionesPageProps = {
    searchParams: Promise<{
        date?: string;
        q?: string;
        fulfillment_type?: string;
        menu_type_id?: string;
        delivery_id?: string;
        sort?: string;
        order?: string;
        page?: string;
        limit?: string;
    }>;
};

function todayISODate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function normalizeDate(date?: string): string {
    if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return date;
    }

    return todayISODate();
}

function isFulfillmentType(
    value?: string,
): value is TDailyProductionFilters["fulfillment_type"] {
    return fulfillmentTypes.some((fulfillmentType) => fulfillmentType === value);
}

function isDailyProductionSort(
    value?: string,
): value is NonNullable<TDailyProductionFilters["sort"]> {
    return dailyProductionSortOptions.some((sort) => sort === value);
}

function isSortOrder(
    value?: string,
): value is NonNullable<TDailyProductionFilters["order"]> {
    return sortOrderOptions.some((order) => order === value);
}

function normalizeFilters(params: Awaited<ProduccionesPageProps["searchParams"]>) {
    const filters: TDailyProductionFilters = {};
    const q = params.q?.trim();

    if (q) {
        filters.q = q;
    }

    if (isFulfillmentType(params.fulfillment_type)) {
        filters.fulfillment_type = params.fulfillment_type;
    }

    if (params.menu_type_id) {
        filters.menu_type_id = params.menu_type_id;
    }

    if (params.delivery_id) {
        filters.delivery_id = params.delivery_id;
    }

    if (isDailyProductionSort(params.sort)) {
        filters.sort = params.sort;
        filters.order = isSortOrder(params.order) ? params.order : "desc";
    }

    return Object.keys(filters).length > 0 ? filters : undefined;
}

export default async function ProduccionesPage({
    searchParams,
}: ProduccionesPageProps) {
    const params = await searchParams;
    const { date } = params;
    const selectedDate = normalizeDate(date);
    const filters = normalizeFilters(params);

    return (
        <>
            <PageHeader
                title="Producción Diaria"
                description="Gestioná las viandas de cada día por cliente, entrega y tipo de menú."
                action={<CreateDailyProductionDialog initialDate={selectedDate} />}
            />

            <div className="flex flex-col gap-4 p-6">
                <DailyProductionFilters date={selectedDate} filters={filters} />
                <Suspense
                    key={selectedDate}
                    fallback={<DailyProductionsSkeleton />}
                >
                    <DailyProductionsData
                        date={selectedDate}
                        filters={filters}
                        page={params.page}
                        limit={params.limit}
                    />
                </Suspense>
            </div>
        </>
    );
}
