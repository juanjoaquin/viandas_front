export type CustomerType = "COMPANY" | "PERSON";

export type GetCustomersFilters = {
    q?: string;
    type?: CustomerType;
};

export function normalizeGetCustomersFilters(
    filters?: GetCustomersFilters,
): GetCustomersFilters | undefined {
    const q = filters?.q?.trim() || undefined;
    const type = filters?.type;
    if (!q && !type) return undefined;
    return { ...(q && { q }), ...(type && { type }) };
}
