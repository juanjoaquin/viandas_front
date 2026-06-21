import { DEFAULT_PAGE_LIMIT } from "@/src/architecture/core/domain/pagination";

export function setPageParam(params: URLSearchParams, page: number): URLSearchParams {
  const next = new URLSearchParams(params.toString());
  if (page <= 1) {
    next.delete("page");
  } else {
    next.set("page", String(page));
  }
  next.set("limit", String(DEFAULT_PAGE_LIMIT));
  return next;
}

export function resetPageParam(params: URLSearchParams): URLSearchParams {
  const next = new URLSearchParams(params.toString());
  next.delete("page");
  next.set("limit", String(DEFAULT_PAGE_LIMIT));
  return next;
}

export function buildPageHref(pathname: string, params: URLSearchParams): string {
  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

/** Páginas visibles con elipsis cuando hay muchas (ej. 1 … 4 5 6 … 10). */
export function getVisiblePageNumbers(
  currentPage: number,
  pageCount: number,
  siblingCount = 1,
): Array<number | "ellipsis"> {
  const totalPages = Math.max(pageCount, 1);
  const current = Math.min(Math.max(currentPage, 1), totalPages);

  if (totalPages <= 1) {
    return [1];
  }

  const pages = new Set<number>([1, totalPages]);

  for (let page = current - siblingCount; page <= current + siblingCount; page++) {
    if (page >= 1 && page <= totalPages) {
      pages.add(page);
    }
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const result: Array<number | "ellipsis"> = [];

  for (let index = 0; index < sorted.length; index++) {
    const page = sorted[index];
    if (index > 0 && page - sorted[index - 1] > 1) {
      result.push("ellipsis");
    }
    result.push(page);
  }

  return result;
}
