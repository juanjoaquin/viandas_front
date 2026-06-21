import type { PaginationFilters } from "../pagination";

export type CustomerType = "COMPANY" | "PERSON";

export type GetCustomersFilters = PaginationFilters & {
    q?: string;
    type?: CustomerType;
};

export function normalizeGetCustomersFilters(
    filters?: GetCustomersFilters,
): GetCustomersFilters | undefined {
    const q = filters?.q?.trim() || undefined;
    const type = filters?.type;
    const page = filters?.page;
    const limit = filters?.limit;

    if (!q && !type && page == null && limit == null) {
        return undefined;
    }

    return {
        ...(q && { q }),
        ...(type && { type }),
        ...(page != null && { page }),
        ...(limit != null && { limit }),
    };
}
