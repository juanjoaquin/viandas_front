export type GetWeekMenusFilters = Record<string, never>;

export function normalizeGetWeekMenusFilters(
    filters?: GetWeekMenusFilters,
): GetWeekMenusFilters | undefined {
    if (!filters) return undefined;
    return {};
}
