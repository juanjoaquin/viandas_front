"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type ToggleOption = {
    label: string;
    value: string | undefined;
};

const OPTIONS: ToggleOption[] = [
    { label: "Todas", value: undefined },
    { label: "Activas", value: "true" },
    { label: "Inactivas", value: "false" },
];

type ProductCategoriesActiveToggleProps = {
    active?: string;
};

export function ProductCategoriesActiveToggle({
    active,
}: ProductCategoriesActiveToggleProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    function handleSelect(value: string | undefined) {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set("active", value);
        } else {
            params.delete("active");
        }
        const qs = params.toString();
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }

    return (
        <div className="inline-flex h-8 items-center gap-0.5 rounded-lg border border-slate-200/70 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-800/60">
            {OPTIONS.map((option) => {
                const isActive = option.value === active;
                return (
                    <button
                        key={option.label}
                        onClick={() => handleSelect(option.value)}
                        className={[
                            "rounded-md px-3 py-1 text-sm font-medium transition-colors",
                            isActive
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:bg-background/60 hover:text-foreground",
                        ].join(" ")}
                    >
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
}
