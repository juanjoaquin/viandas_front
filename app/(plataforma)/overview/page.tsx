import { Suspense } from "react";
import { PageHeader } from "../components/page-header";
import { OverviewDateRangeFilter } from "./components/overview-date-range-filter";
import { ProductionOverviewData } from "./components/production-overview-data";
import { ProductionOverviewSkeleton } from "./components/production-overview-skeleton";

type OverviewPageProps = {
    searchParams: Promise<{
        from?: string;
        to?: string;
    }>;
};

function today(): Date {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    return date;
}

function toISODate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function currentMonthRange() {
    const now = today();
    const from = new Date(now.getFullYear(), now.getMonth(), 1, 12);
    const to = new Date(now.getFullYear(), now.getMonth() + 1, 0, 12);

    return {
        from: toISODate(from),
        to: toISODate(to),
    };
}

function isISODate(value?: string): value is string {
    return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value));
}

function normalizeRange(params: Awaited<OverviewPageProps["searchParams"]>) {
    const fallback = currentMonthRange();
    const from = isISODate(params.from) ? params.from : fallback.from;
    const to = isISODate(params.to) ? params.to : fallback.to;

    if (new Date(`${to}T12:00:00`) < new Date(`${from}T12:00:00`)) {
        return fallback;
    }

    return { from, to };
}

export default async function OverviewPage({ searchParams }: OverviewPageProps) {
    const params = await searchParams;
    const range = normalizeRange(params);

    return (
        <>
            <PageHeader
                title="Overview"
                description="Consultá cantidades y montos de menús y productos por rango de fechas."
            />

            <div className="flex flex-col gap-4 p-6">
                <OverviewDateRangeFilter from={range.from} to={range.to} />
                <Suspense
                    key={`${range.from}-${range.to}`}
                    fallback={<ProductionOverviewSkeleton />}
                >
                    <ProductionOverviewData from={range.from} to={range.to} />
                </Suspense>
            </div>
        </>
    );
}
