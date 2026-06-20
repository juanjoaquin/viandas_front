export type GetExtraProductsFilters = {
    q?: string;
};

export function normalizeGetExtraProductsFilters(
    filters?: GetExtraProductsFilters,
): GetExtraProductsFilters | undefined {
    const q = filters?.q?.trim() || undefined;
    if (!q) return undefined;
    return { q };
}
