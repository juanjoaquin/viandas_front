export type PaginationMeta = {
  total_count: number;
  page: number;
  per_page: number;
  page_count: number;
};

export type Paginated<T> = {
  items: T[];
  meta: PaginationMeta;
};

export type PaginationFilters = {
  page?: number;
  limit?: number;
};

/** Tamaño de página en tablas (siempre 10). */
export const DEFAULT_PAGE_LIMIT = 10;

export function parsePageParam(value?: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

export function parseLimitParam(value?: string): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_PAGE_LIMIT;
  }
  return parsed;
}

export function parsePaginationParams(page?: string, limit?: string) {
  return {
    page: parsePageParam(page),
    limit: parseLimitParam(limit),
  };
}

export function appendPaginationParams(
  params: URLSearchParams,
  filters?: PaginationFilters,
): void {
  if (filters?.page != null && filters.page > 0) {
    params.set("page", String(filters.page));
  }
  if (filters?.limit != null && filters.limit > 0) {
    params.set("limit", String(filters.limit));
  }
}
