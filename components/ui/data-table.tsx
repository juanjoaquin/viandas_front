"use client";

import { LayoutGrid, SearchX, Table2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PaginationMeta } from "@/src/architecture/core/domain/pagination";
import {
  useDataTableViewMode,
  type DataTableViewMode,
} from "@/hooks/use-data-table-view-mode";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TablePagination } from "@/components/ui/table-pagination";

export type ColumnDef<T> = {
  key: string;
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
  /** Contenido alternativo en la vista de cards */
  mobileCell?: (row: T) => React.ReactNode;
  headerClassName?: string;
  cellClassName?: string;
  /** Ocultar en la vista de cards */
  hideOnMobile?: boolean;
  /** Label en card; por defecto usa `header` */
  mobileLabel?: string;
  /** Orden en card; por defecto el orden de la columna */
  mobileOrder?: number;
  /** Mostrar en el encabezado del card (junto a acciones) */
  mobilePrimary?: boolean;
};

type DataTableProps<T> = {
  columns: ColumnDef<T>[];
  data: T[];
  filters?: React.ReactNode;
  emptyMessage?: string;
  emptyDescription?: string;
  meta?: PaginationMeta;
  onPageChange?: (page: number) => void;
  /** Card personalizado; si no se define, se genera desde las columnas */
  mobileCard?: (row: T, rowIndex: number) => React.ReactNode;
};

function getCellContent<T>(
  col: ColumnDef<T>,
  row: T,
  cards = false,
): React.ReactNode {
  if (cards && col.mobileCell) {
    return col.mobileCell(row);
  }
  if (col.cell) {
    return col.cell(row);
  }
  if (col.accessorKey != null) {
    return String(row[col.accessorKey] ?? "—");
  }
  return "—";
}

function isActionsColumn(col: { key: string }): boolean {
  return col.key === "actions";
}

function isPrimaryColumn<T>(col: ColumnDef<T>): boolean {
  return (
    col.mobilePrimary === true ||
    col.key === "name" ||
    col.key === "customer"
  );
}

function getMobileFieldColumns<T>(columns: ColumnDef<T>[]) {
  return columns
    .filter(
      (col) =>
        !col.hideOnMobile && !isActionsColumn(col) && !isPrimaryColumn(col),
    )
    .sort((a, b) => {
      const orderA = a.mobileOrder ?? columns.indexOf(a);
      const orderB = b.mobileOrder ?? columns.indexOf(b);
      return orderA - orderB;
    });
}

function getPrimaryColumn<T>(columns: ColumnDef<T>[]) {
  return columns.find(
    (col) =>
      !col.hideOnMobile && !isActionsColumn(col) && isPrimaryColumn(col),
  );
}

function getActionsColumn<T>(columns: ColumnDef<T>[]) {
  return columns.find((col) => isActionsColumn(col));
}

function DataTableViewToggle({
  viewMode,
  onChange,
  className,
}: {
  viewMode: DataTableViewMode;
  onChange: (mode: DataTableViewMode) => void;
  className?: string;
}) {
  const options: {
    mode: DataTableViewMode;
    label: string;
    icon: React.ElementType;
  }[] = [
    { mode: "table", label: "Tabla", icon: Table2 },
    { mode: "cards", label: "Cards", icon: LayoutGrid },
  ];

  return (
    <div
      className={cn(
        "flex h-8 shrink-0 items-center gap-0.5 rounded-lg border border-slate-200/70 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-800/60",
        className,
      )}
      role="group"
      aria-label="Vista de datos"
    >
      {options.map(({ mode, label, icon: Icon }) => {
        const isActive = viewMode === mode;
        return (
          <button
            key={mode}
            type="button"
            onClick={() => onChange(mode)}
            aria-pressed={isActive}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:bg-background/60 hover:text-foreground",
            )}
          >
            <Icon className="size-3.5" />
            {label}
          </button>
        );
      })}
    </div>
  );
}

function DataTableEmptyState({
  message,
  description,
}: {
  message: string;
  description: string;
}) {
  return (
    <div className="flex h-40 flex-col items-center justify-center gap-2 px-4 text-center">
      <div className="flex size-10 items-center justify-center rounded-full bg-muted">
        <SearchX className="size-5 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium text-foreground">{message}</p>
      <p className="max-w-sm text-xs text-balance text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function DataTableCards<T>({
  columns,
  data,
  mobileCard,
}: {
  columns: ColumnDef<T>[];
  data: T[];
  mobileCard?: (row: T, rowIndex: number) => React.ReactNode;
}) {
  const primaryColumn = getPrimaryColumn(columns);
  const actionsColumn = getActionsColumn(columns);
  const fieldColumns = getMobileFieldColumns(columns);

  return (
    <div className="divide-y divide-border md:grid md:grid-cols-2 md:gap-4 md:divide-y-0 md:p-4 xl:grid-cols-3">
      {data.map((row, rowIndex) => {
        if (mobileCard) {
          return (
            <div
              key={rowIndex}
              className={cn(
                "p-4",
                rowIndex % 2 === 1 && "bg-muted/30 md:bg-card",
                "md:rounded-xl md:border md:border-border md:bg-card md:shadow-sm",
              )}
            >
              {mobileCard(row, rowIndex)}
            </div>
          );
        }

        return (
          <div
            key={rowIndex}
            className={cn(
              "space-y-3 p-4",
              rowIndex % 2 === 1 && "bg-muted/30 md:bg-card",
              "md:rounded-xl md:border md:border-border md:bg-card md:shadow-sm",
            )}
          >
            {(primaryColumn || actionsColumn) && (
              <div className="flex items-start justify-between gap-3">
                {primaryColumn ? (
                  <div className="min-w-0 flex-1">
                    {getCellContent(primaryColumn, row, true)}
                  </div>
                ) : null}
                {actionsColumn ? (
                  <div className="shrink-0">
                    {getCellContent(actionsColumn, row, true)}
                  </div>
                ) : null}
              </div>
            )}

            {fieldColumns.length > 0 ? (
              <div className="space-y-3 md:grid md:grid-cols-2 md:gap-x-4 md:gap-y-3 md:space-y-0">
                {fieldColumns.map((col) => (
                  <div key={col.key} className="space-y-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {col.mobileLabel ?? col.header}
                    </p>
                    <div className="text-sm">
                      {getCellContent(col, row, true)}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export function DataTableMobileListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="divide-y divide-border md:grid md:grid-cols-2 md:gap-4 md:divide-y-0 md:p-4 xl:grid-cols-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "space-y-3 p-4",
            i % 2 === 1 && "bg-muted/30 md:bg-card",
            "md:rounded-xl md:border md:border-border md:bg-card md:shadow-sm",
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div
              className="h-5 w-36 animate-pulse rounded bg-muted"
              style={{ opacity: 1 - i * 0.08 }}
            />
            <div
              className="size-8 animate-pulse rounded-md bg-muted"
              style={{ opacity: 1 - i * 0.08 }}
            />
          </div>
          <div className="space-y-2">
            <div
              className="h-3 w-20 animate-pulse rounded bg-muted"
              style={{ opacity: 1 - i * 0.08 }}
            />
            <div
              className="h-4 w-full animate-pulse rounded bg-muted"
              style={{ opacity: 1 - i * 0.08 }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function DataTable<T>({
  columns,
  data,
  filters,
  emptyMessage = "Sin resultados",
  emptyDescription = "No se encontraron registros para mostrar.",
  meta,
  onPageChange,
  mobileCard,
}: DataTableProps<T>) {
  const { viewMode, setViewMode } = useDataTableViewMode();
  const isEmpty = data.length === 0;
  const showCards = viewMode === "cards";

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="border-b bg-background px-4 py-3">
          <div className="flex flex-wrap items-center gap-3">
            {filters}
            <DataTableViewToggle
              viewMode={viewMode}
              onChange={setViewMode}
              className="ml-auto shrink-0"
            />
          </div>
        </div>

        {isEmpty ? (
          <DataTableEmptyState
            message={emptyMessage}
            description={emptyDescription}
          />
        ) : showCards ? (
          <DataTableCards
            columns={columns}
            data={data}
            mobileCard={mobileCard}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                {columns.map((col) => (
                  <TableHead
                    key={col.key}
                    className={cn(
                      "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
                      col.headerClassName,
                    )}
                  >
                    {col.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className="group even:bg-muted/30 even:hover:bg-muted/40"
                >
                  {columns.map((col) => (
                    <TableCell
                      key={col.key}
                      className={cn("text-sm", col.cellClassName)}
                    >
                      {getCellContent(col, row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
      {meta && onPageChange ? (
        <TablePagination meta={meta} onPageChange={onPageChange} />
      ) : data.length > 0 ? (
        <p className="text-xs text-muted-foreground">
          {data.length} {data.length === 1 ? "registro" : "registros"}
        </p>
      ) : null}
    </div>
  );
}
