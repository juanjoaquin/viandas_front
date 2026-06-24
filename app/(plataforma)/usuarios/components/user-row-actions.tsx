"use client";

import { useState } from "react";
import { Loader2, Pencil } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { TUser } from "@/src/architecture/core/domain/entities/User";
import { getUserByIdAction } from "@/src/architecture/actions/user/get-user-by-id.action";
import { EditUserDialog } from "./edit-user-dialog";

type UserRowActionsProps = {
    user: TUser;
};

export function UserRowActions({ user }: UserRowActionsProps) {
    const [editOpen, setEditOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState<TUser | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    async function handleEdit() {
        setIsLoading(true);

        const result = await getUserByIdAction(user.id);

        setIsLoading(false);

        if (!result.success) {
            toast.error(result.error);
            return;
        }

        setUserToEdit(result.data);
        setEditOpen(true);
    }

    function handleEditOpenChange(open: boolean) {
        setEditOpen(open);
        if (!open) setUserToEdit(null);
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
                            disabled={isLoading}
                            aria-label={`Editar ${user.name}`}
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
            </div>

            {userToEdit && (
                <EditUserDialog
                    user={userToEdit}
                    open={editOpen}
                    onOpenChange={handleEditOpenChange}
                />
            )}
        </>
    );
}
