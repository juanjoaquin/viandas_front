import { SearchX } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type ColumnDef<T> = {
  key: string;
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
  headerClassName?: string;
  cellClassName?: string;
};

type DataTableProps<T> = {
  columns: ColumnDef<T>[];
  data: T[];
  filters?: React.ReactNode;
  emptyMessage?: string;
  emptyDescription?: string;
};

export function DataTable<T>({
  columns,
  data,
  filters,
  emptyMessage = "Sin resultados",
  emptyDescription = "No se encontraron registros para mostrar.",
}: DataTableProps<T>) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        {filters && (
          <div
            data-slot="data-table-filters"
            className="border-b bg-background px-4 py-3"
          >
            <div className="flex flex-wrap items-center gap-3">{filters}</div>
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={cn(
                    "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
                    col.headerClassName
                  )}
                >
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={columns.length}
                  className="h-40 whitespace-normal text-center"
                >
                  <div className="mx-auto flex max-w-sm flex-col items-center justify-center gap-2">
                    <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                      <SearchX className="size-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      {emptyMessage}
                    </p>
                    <p className="text-xs text-balance text-muted-foreground">
                      {emptyDescription}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, rowIndex) => (
                <TableRow key={rowIndex} className="group">
                  {columns.map((col) => (
                    <TableCell
                      key={col.key}
                      className={cn("text-sm", col.cellClassName)}
                    >
                      {col.cell
                        ? col.cell(row)
                        : col.accessorKey != null
                          ? String(row[col.accessorKey] ?? "—")
                          : "—"}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {data.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {data.length} {data.length === 1 ? "registro" : "registros"}
        </p>
      )}
    </div>
  );
}
