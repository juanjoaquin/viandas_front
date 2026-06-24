import type { PaginationFilters } from "../pagination";

export type GetUsersFilters = PaginationFilters & {
    q?: string;
    active?: boolean;
};

export function normalizeGetUsersFilters(
    filters?: GetUsersFilters,
): GetUsersFilters | undefined {
    const q = filters?.q?.trim() || undefined;
    const page = filters?.page;
    const limit = filters?.limit;
    const active = filters?.active;

    if (!q && page == null && limit == null && active == null) {
        return undefined;
    }

    return {
        ...(q && { q }),
        ...(page != null && { page }),
        ...(limit != null && { limit }),
        ...(active != null && { active }),
    };
}
