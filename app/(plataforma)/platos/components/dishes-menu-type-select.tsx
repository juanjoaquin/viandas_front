"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MenuTypeSearchInput } from "@/components/custom/inputs/menu-type-search-input";
import { getMenuTypeByIdAction } from "@/src/architecture/actions/menu-type/get-menu-type-by-id.action";
import { TMenuType } from "@/src/architecture/core/domain/entities/MenuType";
import { buildPageHref, resetPageParam } from "@/lib/pagination-params";

type DishesMenuTypeSelectProps = {
    menuTypeId?: string;
};

export function DishesMenuTypeSelect({ menuTypeId }: DishesMenuTypeSelectProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [selectedMenuType, setSelectedMenuType] = useState<Pick<
        TMenuType,
        "id" | "name"
    > | null>(null);

    useEffect(() => {
        if (!menuTypeId) {
            setSelectedMenuType(null);
            return;
        }

        getMenuTypeByIdAction(menuTypeId).then((result) => {
            if (result.success && result.data) {
                setSelectedMenuType({ id: result.data.id, name: result.data.name });
            }
        });
    }, [menuTypeId]);

    function handleChange(id: string, menuType?: TMenuType) {
        const params = resetPageParam(new URLSearchParams(searchParams.toString()));
        if (!id) {
            params.delete("menu_type_id");
            setSelectedMenuType(null);
        } else {
            params.set("menu_type_id", id);
            setSelectedMenuType(
                menuType
                    ? { id: menuType.id, name: menuType.name }
                    : { id, name: selectedMenuType?.name ?? "" },
            );
        }
        router.replace(buildPageHref(pathname, params), { scroll: false });
    }

    return (
        <div className="flex w-full items-center gap-1 md:w-auto">
            <div className="min-w-0 flex-1 md:w-48 md:flex-none">
                <MenuTypeSearchInput
                    value={menuTypeId ?? ""}
                    selectedMenuType={selectedMenuType}
                    onValueChange={handleChange}
                    placeholder="Filtrar por menú..."
                />
            </div>
            {menuTypeId ? (
                <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleChange("")}
                    aria-label="Quitar filtro de menú"
                >
                    <X className="size-3.5" />
                </Button>
            ) : null}
        </div>
    );
}
