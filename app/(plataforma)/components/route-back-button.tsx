"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function getCanGoBack() {
  const idx = window.history.state?.idx;
  return typeof idx === "number" ? idx > 0 : window.history.length > 1;
}

type RouteBackButtonProps = {
  showSeparator?: boolean;
};

export function RouteBackButton({ showSeparator = true }: RouteBackButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    const update = () => setCanGoBack(getCanGoBack());
    update();
    window.addEventListener("popstate", update);
    return () => window.removeEventListener("popstate", update);
  }, [pathname]);

  if (!canGoBack) {
    return null;
  }

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="shrink-0 cursor-pointer"
            onClick={() => router.back()}
            aria-label="Volver atrás"
          >
            <ArrowLeft className="size-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Volver atrás</TooltipContent>
      </Tooltip>
      {showSeparator && (
        <Separator orientation="vertical" className="hidden h-9 md:block" />
      )}
    </>
  );
}
