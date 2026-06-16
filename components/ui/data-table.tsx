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
};

export function DataTable<T>({ columns, data, toolbar }: DataTableProps<T>) {
  return (
    <div className="space-y-4">
      {toolbar && (
        <div className="flex items-center justify-between gap-4">
          {toolbar}
        </div>
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key}>{col.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  Sin resultados.
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((col) => (
                    <TableCell key={col.key}>
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
    </div>
  );
}
