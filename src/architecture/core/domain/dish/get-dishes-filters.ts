import type { PaginationFilters } from "../pagination";

export type GetDishesFilters = PaginationFilters & {
    q?: string;
    menu_type_id?: string;
};

export function normalizeGetDishesFilters(
    filters?: GetDishesFilters,
): GetDishesFilters | undefined {
    const q = filters?.q?.trim() || undefined;
    const menu_type_id = filters?.menu_type_id?.trim() || undefined;
    const page = filters?.page;
    const limit = filters?.limit;

    if (!q && !menu_type_id && page == null && limit == null) {
        return undefined;
    }

    return {
        ...(q && { q }),
        ...(menu_type_id && { menu_type_id }),
        ...(page != null && { page }),
        ...(limit != null && { limit }),
    };
}
