"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { Pencil } from "lucide-react";
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
import { Field, FieldLabel } from "@/components/ui/field";
import { DishSearchInput } from "@/components/custom/inputs/dish-search-input";
import { TWeekMenuItem } from "@/src/architecture/core/domain/entities/WeekMenu";
import { updateWeekMenuItemAction } from "@/src/architecture/actions/week-menu/update-week-menu-item.action";

type EditItemDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    weekMenuId: string;
    item: TWeekMenuItem;
};

export function EditItemDialog({
    open,
    onOpenChange,
    weekMenuId,
    item,
}: EditItemDialogProps) {
    const [selectedDishId, setSelectedDishId] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!open) return;
        setSelectedDishId(item.dish?.id ?? "");
    }, [open, item.dish?.id]);

    function handleOpenChange(value: boolean) {
        if (!value) setSelectedDishId("");
        onOpenChange(value);
    }

    async function handleSubmit() {
        if (!selectedDishId) return;

        setIsSubmitting(true);

        try {
            const result = await updateWeekMenuItemAction(weekMenuId, item.id, {
                dish_id: selectedDishId,
            });

            if (result.success) {
                toast.success("Plato actualizado correctamente");
                onOpenChange(false);
                router.refresh();
                return;
            }

            toast.error(result.error);
        } catch (error) {
            console.error(error);
            toast.error("Error inesperado al actualizar el plato");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle className="text-base font-semibold">
                        Cambiar plato
                    </DialogTitle>
                    <DialogDescription>
                        {item.menu_type?.name} — {format(parseISO(item.menu_date), "dd/MM/yyyy")}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-2">
                    <Field>
                        <FieldLabel htmlFor="edit-dish-search">Plato</FieldLabel>
                        <DishSearchInput
                            key={open ? item.id : "closed"}
                            id="edit-dish-search"
                            menuTypeId={item.menu_type?.id ?? ""}
                            value={selectedDishId}
                            onValueChange={setSelectedDishId}
                            selectedDish={item.dish}
                            disabled={!item.menu_type?.id}
                        />
                    </Field>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancelar</Button>
                    </DialogClose>
                    <Button
                        variant="brand"
                        disabled={!selectedDishId || isSubmitting || selectedDishId === item.dish?.id}
                        onClick={() => void handleSubmit()}
                    >
                        <Pencil data-icon="inline-start" />
                        {isSubmitting ? "Guardando..." : "Guardar cambio"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
