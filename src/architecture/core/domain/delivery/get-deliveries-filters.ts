export type GetDeliveriesFilters = {
    q?: string;
};

export function normalizeGetDeliveriesFilters(
    filters?: GetDeliveriesFilters,
): GetDeliveriesFilters | undefined {
    const q = filters?.q?.trim() || undefined;
    if (!q) return undefined;
    return { q };
}
