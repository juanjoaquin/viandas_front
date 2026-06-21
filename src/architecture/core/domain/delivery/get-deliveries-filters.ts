import type { PaginationFilters } from "../pagination";

export type GetDeliveriesFilters = PaginationFilters & {
    q?: string;
};

export function normalizeGetDeliveriesFilters(
    filters?: GetDeliveriesFilters,
): GetDeliveriesFilters | undefined {
    const q = filters?.q?.trim() || undefined;
    const page = filters?.page;
    const limit = filters?.limit;

    if (!q && page == null && limit == null) {
        return undefined;
    }

    return {
        ...(q && { q }),
        ...(page != null && { page }),
        ...(limit != null && { limit }),
    };
}
