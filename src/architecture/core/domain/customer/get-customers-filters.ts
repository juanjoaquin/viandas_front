export type GetCustomersFilters = {
    q?: string;
};

export function normalizeGetCustomersFilters(
    filters?: GetCustomersFilters,
): GetCustomersFilters | undefined {
    const q = filters?.q?.trim();
    if (!q) return undefined;
    return { q };
}
