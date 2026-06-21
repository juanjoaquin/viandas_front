import type { PaginationFilters } from "../pagination";

export type GetProductCategoriesFilters = PaginationFilters & {
    q?: string;
    active?: boolean;
};

export function normalizeGetProductCategoriesFilters(
    filters?: GetProductCategoriesFilters,
): GetProductCategoriesFilters | undefined {
    const q = filters?.q?.trim() || undefined;
    const active = filters?.active;
    const page = filters?.page;
    const limit = filters?.limit;

    if (!q && active === undefined && page == null && limit == null) {
        return undefined;
    }

    return {
        ...(q && { q }),
        ...(active !== undefined && { active }),
        ...(page != null && { page }),
        ...(limit != null && { limit }),
    };
}
