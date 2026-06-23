"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { resetPageParam, buildPageHref } from "@/lib/pagination-params";

export function SearchInput({
  q,
  className,
}: {
  q?: string;
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(() => q ?? "");
  const isFocusedRef = useRef(false);

  useEffect(() => {
    if (isFocusedRef.current) return;
    setValue(searchParams.get("q") ?? "");
  }, [searchParams]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const trimmed = value.trim();
      const current = searchParams.get("q") ?? "";

      if (trimmed === current) return;

      const params = resetPageParam(new URLSearchParams(searchParams.toString()));
      if (trimmed) {
        params.set("q", trimmed);
      } else {
        params.delete("q");
      }

      router.replace(buildPageHref(pathname, params), {
        scroll: false,
      });
    }, 400);

    return () => clearTimeout(timeout);
  }, [value, pathname, router, searchParams]);

  return (
    <div className={cn("relative w-64", className)}>
      <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Buscar por nombre..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => {
          isFocusedRef.current = true;
        }}
        onBlur={() => {
          isFocusedRef.current = false;
        }}
        className="h-8 border-border bg-muted pl-8 text-sm focus-visible:bg-background"
      />
    </div>
  );
}
