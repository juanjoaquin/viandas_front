"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PaginationMeta } from "@/src/architecture/core/domain/pagination";
import { getVisiblePageNumbers } from "@/lib/pagination-params";

type TablePaginationProps = {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
};

export function TablePagination({ meta, onPageChange }: TablePaginationProps) {
  const pageCount = Math.max(meta.page_count, 1);
  const currentPage = Math.min(Math.max(meta.page, 1), pageCount);
  const hasMultiplePages = pageCount > 1;
  const visiblePages = getVisiblePageNumbers(currentPage, pageCount);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-xs text-muted-foreground">
        {hasMultiplePages ? (
          <>
            Página {currentPage} de {pageCount} ·{" "}
          </>
        ) : null}
        {meta.total_count}{" "}
        {meta.total_count === 1 ? "registro" : "registros"}
      </p>

      <div className="ml-auto flex items-center gap-1">
        {hasMultiplePages ? (
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="Página anterior"
          >
            <ChevronLeft className="size-4" />
          </Button>
        ) : null}

        {visiblePages.map((page, index) =>
          page === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="px-1 text-xs text-muted-foreground"
              aria-hidden
            >
              …
            </span>
          ) : (
            <Button
              key={page}
              type="button"
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              className={cn(
                "min-w-8 px-2 tabular-nums",
                page === currentPage && "pointer-events-none",
              )}
              disabled={page === currentPage}
              onClick={() => onPageChange(page)}
              aria-label={`Página ${page}`}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </Button>
          ),
        )}

        {hasMultiplePages ? (
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            disabled={currentPage >= pageCount}
            onClick={() => onPageChange(currentPage + 1)}
            aria-label="Página siguiente"
          >
            <ChevronRight className="size-4" />
          </Button>
        ) : null}
      </div>
    </div>
  );
}
