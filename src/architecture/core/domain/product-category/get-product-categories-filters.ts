export type GetProductCategoriesFilters = {
    q?: string;
    active?: boolean;
};

export function normalizeGetProductCategoriesFilters(
    filters?: GetProductCategoriesFilters,
): GetProductCategoriesFilters | undefined {
    const q = filters?.q?.trim() || undefined;
    const active = filters?.active;
    if (!q && active === undefined) return undefined;
    return { ...(q && { q }), ...(active !== undefined && { active }) };
}
