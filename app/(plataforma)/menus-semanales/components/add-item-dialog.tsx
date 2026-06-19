"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UtensilsCrossed } from "lucide-react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldLabel,
} from "@/components/ui/field";
import { DishSearchInput } from "@/components/custom/inputs/dish-search-input";
import { TMenuType } from "@/src/architecture/core/domain/entities/MenuType";
import { addWeekMenuItemAction } from "@/src/architecture/actions/week-menu/add-week-menu-item.action";

type AddItemDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    weekMenuId: string;
    menuDate: string;
    menuType: TMenuType;
};

export function AddItemDialog({
    open,
    onOpenChange,
    weekMenuId,
    menuDate,
    menuType,
}: AddItemDialogProps) {
    const [selectedDishId, setSelectedDishId] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (open) setSelectedDishId("");
    }, [open]);

    function handleOpenChange(value: boolean) {
        if (!value) setSelectedDishId("");
        onOpenChange(value);
    }

    async function handleSubmit() {
        if (!selectedDishId) return;

        setIsSubmitting(true);

        try {
            const result = await addWeekMenuItemAction(weekMenuId, {
                menu_date: menuDate,
                menu_type_id: menuType.id,
                dish_id: selectedDishId,
            });

            if (result.success) {
                toast.success("Plato asignado correctamente");
                onOpenChange(false);
                router.refresh();
                return;
            }

            toast.error(result.error);
        } catch (error) {
            console.error(error);
            toast.error("Error inesperado al asignar el plato");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle className="text-base font-semibold">
                        Asignar plato
                    </DialogTitle>
                    <DialogDescription>
                        {menuType.name} — {menuDate}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-2">
                    <Field>
                        <FieldLabel htmlFor="dish-search">Plato</FieldLabel>
                        <DishSearchInput
                            key={open ? menuType.id : "closed"}
                            id="dish-search"
                            menuTypeId={menuType.id}
                            value={selectedDishId}
                            onValueChange={setSelectedDishId}
                        />
                    </Field>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancelar</Button>
                    </DialogClose>
                    <Button
                        variant="brand"
                        disabled={!selectedDishId || isSubmitting}
                        onClick={() => void handleSubmit()}
                    >
                        <UtensilsCrossed data-icon="inline-start" />
                        {isSubmitting ? "Guardando..." : "Asignar plato"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
