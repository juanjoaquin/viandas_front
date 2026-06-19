export type GetDishesFilters = {
    q?: string;
    menu_type_id?: string;
};

export function normalizeGetDishesFilters(
    filters?: GetDishesFilters,
): GetDishesFilters | undefined {
    const q = filters?.q?.trim() || undefined;
    const menu_type_id = filters?.menu_type_id?.trim() || undefined;
    if (!q && !menu_type_id) return undefined;
    return {
        ...(q && { q }),
        ...(menu_type_id && { menu_type_id }),
    };
}
