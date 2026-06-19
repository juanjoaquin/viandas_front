export type GetMenuTypesFilters = {
    q?: string;
    active?: boolean;
};

export function normalizeGetMenuTypesFilters(
    filters?: GetMenuTypesFilters,
): GetMenuTypesFilters | undefined {
    const q = filters?.q?.trim() || undefined;
    const active = filters?.active;
    if (!q && active === undefined) return undefined;
    return { ...(q && { q }), ...(active !== undefined && { active }) };
}
