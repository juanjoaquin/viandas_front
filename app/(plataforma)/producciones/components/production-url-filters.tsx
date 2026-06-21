"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MenuTypeSearchInput } from "@/components/custom/inputs/menu-type-search-input";
import { DeliverySearchInput } from "@/components/custom/inputs/delivery-search-input";
import { getMenuTypeByIdAction } from "@/src/architecture/actions/menu-type/get-menu-type-by-id.action";
import { getDeliveryByIdAction } from "@/src/architecture/actions/delivery/get-delivery-by-id.action";
import { TMenuType } from "@/src/architecture/core/domain/entities/MenuType";
import { TDelivery } from "@/src/architecture/core/domain/entities/Delivery";
import { buildPageHref, resetPageParam } from "@/lib/pagination-params";

type MenuTypeUrlFilterProps = {
    menuTypeId?: string;
    onChange: (params: URLSearchParams) => void;
};

export function MenuTypeUrlFilter({ menuTypeId, onChange }: MenuTypeUrlFilterProps) {
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
                menuType ? { id: menuType.id, name: menuType.name } : null,
            );
        }
        onChange(params);
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

type DeliveryUrlFilterProps = {
    deliveryId?: string;
    onChange: (params: URLSearchParams) => void;
};

export function DeliveryUrlFilter({ deliveryId, onChange }: DeliveryUrlFilterProps) {
    const searchParams = useSearchParams();
    const [selectedDelivery, setSelectedDelivery] = useState<Pick<
        TDelivery,
        "id" | "name"
    > | null>(null);

    useEffect(() => {
        if (!deliveryId) {
            setSelectedDelivery(null);
            return;
        }

        getDeliveryByIdAction(deliveryId).then((result) => {
            if (result.success && result.data) {
                setSelectedDelivery({ id: result.data.id, name: result.data.name });
            }
        });
    }, [deliveryId]);

    function handleChange(id: string, delivery?: TDelivery) {
        const params = resetPageParam(new URLSearchParams(searchParams.toString()));
        if (!id) {
            params.delete("delivery_id");
            setSelectedDelivery(null);
        } else {
            params.set("delivery_id", id);
            params.set("fulfillment_type", "DELIVERY");
            setSelectedDelivery(
                delivery ? { id: delivery.id, name: delivery.name } : null,
            );
        }
        onChange(params);
    }

    return (
        <div className="flex w-full items-center gap-1 md:w-auto">
            <div className="min-w-0 flex-1 md:w-48 md:flex-none">
                <DeliverySearchInput
                    value={deliveryId ?? ""}
                    selectedDelivery={selectedDelivery}
                    onValueChange={handleChange}
                    placeholder="Filtrar repartidor..."
                />
            </div>
            {deliveryId ? (
                <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleChange("")}
                    aria-label="Quitar filtro de repartidor"
                >
                    <X className="size-3.5" />
                </Button>
            ) : null}
        </div>
    );
}
