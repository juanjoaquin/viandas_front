const DAYS = 5;
const TYPES = 3;
const GRID_TEMPLATE_COLUMNS = `120px repeat(${TYPES}, minmax(0, 1fr))`;

export function WeekMenuGridSkeleton() {
    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 shadow-sm">
                <div className="flex flex-col gap-1.5">
                    <div className="h-4 w-56 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-32 animate-pulse rounded bg-muted" />
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 animate-pulse rounded-md bg-muted" />
                    <div className="h-8 w-52 animate-pulse rounded-md bg-muted" />
                    <div className="h-8 w-8 animate-pulse rounded-md bg-muted" />
                </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
                <div
                    className="grid min-w-[820px] w-full text-sm"
                    style={{ gridTemplateColumns: GRID_TEMPLATE_COLUMNS }}
                >
                    <div className="border-b border-r border-border bg-muted/70 px-4 py-3">
                        <div className="h-3 w-12 animate-pulse rounded bg-muted" />
                    </div>
                    {Array.from({ length: TYPES }).map((_, i) => (
                        <div
                            key={i}
                            className={`border-b border-border px-4 py-3 text-center ${
                                i < TYPES - 1
                                    ? "border-r border-border "
                                    : ""
                            }`}
                        >
                            <div className="mx-auto flex flex-col items-center gap-1.5">
                                <div className="h-3.5 w-24 animate-pulse rounded bg-muted" />
                                <div className="h-3 w-14 animate-pulse rounded bg-muted opacity-70" />
                            </div>
                        </div>
                    ))}

                    {Array.from({ length: DAYS }).map((_, row) => {
                        const isLastRow = row === DAYS - 1;

                        return (
                            <div key={row} className="contents">
                                <div
                                    className={`min-w-0 border-r border-border bg-muted/70 px-4 py-5 ${
                                        !isLastRow
                                            ? "border-b border-border "
                                            : ""
                                    }`}
                                >
                                    <div className="flex flex-col gap-1">
                                        <div className="h-3.5 w-14 animate-pulse rounded bg-muted" />
                                        <div className="h-3 w-20 animate-pulse rounded bg-muted opacity-70" />
                                    </div>
                                </div>
                                {Array.from({ length: TYPES }).map((_, col) => (
                                    <div
                                        key={col}
                                        className={`min-w-0 px-3 py-2.5 ${
                                            col < TYPES - 1
                                                ? "border-r border-border "
                                                : ""
                                        } ${
                                            !isLastRow
                                                ? "border-b border-border "
                                                : ""
                                        }`}
                                    >
                                        <div
                                            className="min-h-[92px] w-full animate-pulse rounded-xl bg-muted"
                                            style={{ opacity: 1 - row * 0.07 }}
                                        />
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-muted px-4 py-4">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                    {Array.from({ length: TYPES }).map((_, i) => (
                        <div
                            key={i}
                            className="h-3.5 w-24 animate-pulse rounded bg-muted"
                        />
                    ))}
                </div>
                <div className="h-4 w-32 animate-pulse rounded bg-muted" />
            </div>
        </div>
    );
}
