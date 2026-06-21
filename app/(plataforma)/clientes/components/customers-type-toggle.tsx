"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { buildPageHref, resetPageParam } from "@/lib/pagination-params";

type ToggleOption = {
  label: string;
  value: string | undefined;
};

const OPTIONS: ToggleOption[] = [
  { label: "Todos",        value: undefined   },
  { label: "Empresas",     value: "COMPANY"   },
  { label: "Particulares", value: "PERSON"    },
];

type CustomersTypeToggleProps = {
  type?: string;
};

export function CustomersTypeToggle({ type }: CustomersTypeToggleProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleSelect(value: string | undefined) {
    const params = resetPageParam(new URLSearchParams(searchParams.toString()));
    if (value) {
      params.set("type", value);
    } else {
      params.delete("type");
    }
    router.replace(buildPageHref(pathname, params), { scroll: false });
  }

  return (
    <div className="flex h-8 w-full items-center gap-0.5 rounded-lg border border-slate-200/70 bg-slate-100 p-1 md:inline-flex md:w-auto dark:border-slate-700 dark:bg-slate-800/60">
      {OPTIONS.map((option) => {
        const isActive = option.value === type;
        return (
          <button
            key={option.label}
            onClick={() => handleSelect(option.value)}
            className={[
              "flex-1 rounded-md px-3 py-1 text-sm font-medium transition-colors md:flex-none",
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
