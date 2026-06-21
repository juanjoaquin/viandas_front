"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { buildPageHref, setPageParam } from "@/lib/pagination-params";

export function useTablePagination() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function goToPage(page: number) {
    const params = setPageParam(new URLSearchParams(searchParams.toString()), page);
    router.replace(buildPageHref(pathname, params), { scroll: false });
  }

  return { goToPage };
}
