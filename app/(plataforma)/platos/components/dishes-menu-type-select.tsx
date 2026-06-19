"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { TMenuType } from "@/src/architecture/core/domain/entities/MenuType";

const ALL_VALUE = "all";

type DishesMenuTypeSelectProps = {
    menuTypes: TMenuType[];
    menuTypeId?: string;
};

export function DishesMenuTypeSelect({
    menuTypes,
    menuTypeId,
}: DishesMenuTypeSelectProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    function handleChange(value: string) {
        const params = new URLSearchParams(searchParams.toString());
        if (value === ALL_VALUE) {
            params.delete("menu_type_id");
        } else {
            params.set("menu_type_id", value);
        }
        const qs = params.toString();
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }

    return (
        <Select
            value={menuTypeId ?? ALL_VALUE}
            onValueChange={handleChange}
            disabled={menuTypes.length === 0}
        >
            <SelectTrigger
                size="sm"
                className="h-8 w-48 border-slate-200/70 bg-slate-100 text-sm dark:border-slate-700 dark:bg-slate-800/60"
            >
                <SelectValue
                    placeholder={
                        menuTypes.length === 0
                            ? "Sin tipos de menú"
                            : "Tipo de menú"
                    }
                />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value={ALL_VALUE}>Todos los tipos</SelectItem>
                {menuTypes.map((menuType) => (
                    <SelectItem key={menuType.id} value={menuType.id}>
                        {menuType.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
