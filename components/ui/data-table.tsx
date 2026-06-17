import { SearchX } from "lucide-react";
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
};

type DataTableProps<T> = {
  columns: ColumnDef<T>[];
  data: T[];
  toolbar?: React.ReactNode;
  emptyMessage?: string;
  emptyDescription?: string;
};

export function DataTable<T>({
  columns,
  data,
  toolbar,
  emptyMessage = "Sin resultados",
  emptyDescription = "No se encontraron registros para mostrar.",
}: DataTableProps<T>) {
  return (
    <div className="space-y-4">
      {toolbar && (
        <div className="flex items-center justify-between gap-4">{toolbar}</div>
      )}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length} className="h-40">
                  <div className="flex flex-col items-center justify-center gap-2 text-center">
                    <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                      <SearchX className="size-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      {emptyMessage}
                    </p>
                    <p className="text-xs text-muted-foreground max-w-48">
                      {emptyDescription}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, rowIndex) => (
                <TableRow key={rowIndex} className="group">
                  {columns.map((col) => (
                    <TableCell key={col.key} className="text-sm">
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
