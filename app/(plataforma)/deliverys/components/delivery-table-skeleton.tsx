import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const COLUMNS = ["Nombre", "Teléfono", "Activo"];
const ROW_COUNT = 4;
const COL_WIDTHS = ["w-36", "w-16", "w-24"];

export function DeliverysTableSkeleton() {
    return (
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            <div
                data-slot="data-table-filters"
                className="border-b bg-background px-4 py-3"
            >
                <div className="h-8 w-64 animate-pulse rounded-md bg-muted" />
            </div>
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                        {COLUMNS.map((col) => (
                            <TableHead
                                key={col}
                                className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
                            >
                                {col}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from({ length: ROW_COUNT }).map((_, i) => (
                        <TableRow key={i}>
                            {COL_WIDTHS.map((w, j) => (
                                <TableCell key={j}>
                                    <div
                                        className={`h-4 ${w} animate-pulse rounded bg-muted`}
                                        style={{ opacity: 1 - i * 0.1 }}
                                    />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
