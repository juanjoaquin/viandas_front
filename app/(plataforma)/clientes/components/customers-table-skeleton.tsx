import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const COLUMNS = ["Nombre", "Tipo", "Teléfono", "Dirección"];
const ROW_COUNT = 5;

export function CustomersTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="h-9 w-48 animate-pulse rounded-md bg-muted" />
        <div className="h-9 w-36 animate-pulse rounded-md bg-muted" />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {COLUMNS.map((col) => (
                <TableHead key={col}>{col}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: ROW_COUNT }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-40 animate-pulse rounded bg-muted" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
