"use client";

import { useState } from "react";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { TMenuType } from "@/src/architecture/core/domain/entities/MenuType";
import { getMenuTypeByIdAction } from "@/src/architecture/actions/menu-type/get-menu-type-by-id.action";
import { EditMenuTypeDialog } from "./edit-menu-type-dialog";
import { DeleteMenuTypeDialog } from "./delete-menu-type-dialog";

type MenuTypeRowActionsProps = {
    menuType: TMenuType;
};

export function MenuTypeID({ menuType }: MenuTypeRowActionsProps) {
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [menuTypeToEdit, setMenuTypeToEdit] = useState<TMenuType | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    async function handleEdit() {
        setIsLoading(true);

        const result = await getMenuTypeByIdAction(menuType.id);

        setIsLoading(false);

        if (!result.success) {
            toast.error(result.error);
            return;
        }

        setMenuTypeToEdit(result.data);
        setEditOpen(true);
    }

    function handleEditOpenChange(open: boolean) {
        setEditOpen(open);
        if (!open) setMenuTypeToEdit(null);
    }

    return (
        <>
            <div className="inline-flex items-center gap-1.5">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            type="button"
                            variant="outline"
                            size="icon-sm"
                            disabled={isLoading || isDeleting}
                            aria-label={`Editar ${menuType.name}`}
                            className="border-border text-muted-foreground hover:border-border hover:bg-accent hover:text-accent-foreground"
                            onClick={() => void handleEdit()}
                        >
                            {isLoading ? (
                                <Loader2 className="size-3.5 animate-spin" />
                            ) : (
                                <Pencil className="size-3.5" />
                            )}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Editar</TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            type="button"
                            variant="outline"
                            size="icon-sm"
                            disabled={isLoading || isDeleting}
                            aria-label={`Eliminar ${menuType.name}`}
                            className="border-border text-muted-foreground hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:hover:border-red-900/60 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                            onClick={() => setDeleteOpen(true)}
                        >
                            <Trash2 className="size-3.5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Eliminar</TooltipContent>
                </Tooltip>
            </div>

            {menuTypeToEdit && (
                <EditMenuTypeDialog
                    menuType={menuTypeToEdit}
                    open={editOpen}
                    onOpenChange={handleEditOpenChange}
                />
            )}

            <DeleteMenuTypeDialog
                menuType={menuType}
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                isDeleting={isDeleting}
                onDeletingChange={setIsDeleting}
            />
        </>
    );
}
