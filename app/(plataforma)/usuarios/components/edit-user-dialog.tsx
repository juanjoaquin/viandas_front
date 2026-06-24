"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { UserCircle } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { Switch } from "@/components/ui/switch";
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import {
    updateUserInputSchema,
    type TUser,
    type UpdateUserInput,
} from "@/src/architecture/core/domain/entities/User";
import { updateUserAction } from "@/src/architecture/actions/user/update-user.action";

type EditUserDialogProps = {
    user: TUser;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

function roleLabel(role: string): string {
    return role === "ADMIN" ? "Administrador" : "Empleado";
}

export function EditUserDialog({
    user,
    open,
    onOpenChange,
}: EditUserDialogProps) {
    const router = useRouter();

    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = useForm<UpdateUserInput>({
        resolver: zodResolver(updateUserInputSchema),
        mode: "onBlur",
        defaultValues: {
            active: user.active,
        },
    });

    async function onSubmit(data: UpdateUserInput) {
        try {
            const result = await updateUserAction(user.id, data);
            if (result.success) {
                toast.success("Usuario actualizado correctamente");
                router.refresh();
                onOpenChange(false);
                return;
            }

            toast.error(result.error);
        } catch (error) {
            console.error(error);
            toast.error("Error inesperado al actualizar el usuario");
        }
    }

    function handleOpenChange(value: boolean) {
        if (!value) reset();
        onOpenChange(value);
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-base font-semibold">
                        Editar usuario
                    </DialogTitle>
                    <DialogDescription>
                        Modificá el estado del usuario en la plataforma.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-3 rounded-lg border bg-muted/30 px-4 py-3 text-sm">
                    <div>
                        <span className="text-muted-foreground">Nombre: </span>
                        <span className="font-medium text-foreground">{user.name}</span>
                    </div>
                    <div>
                        <span className="text-muted-foreground">Email: </span>
                        <span className="font-medium text-foreground">{user.email}</span>
                    </div>
                    <div>
                        <span className="text-muted-foreground">Rol: </span>
                        <span className="font-medium text-foreground">{roleLabel(user.role)}</span>
                    </div>
                </div>

                <form id="edit-user-form" onSubmit={handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="active"
                            control={control}
                            render={({ field }) => (
                                <Field orientation="horizontal">
                                    <FieldContent>
                                        <FieldLabel htmlFor="user-active">
                                            Activo
                                        </FieldLabel>
                                        <FieldDescription>
                                            Los usuarios inactivos no pueden acceder a la plataforma.
                                        </FieldDescription>
                                    </FieldContent>
                                    <Switch
                                        id="user-active"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </Field>
                            )}
                        />
                    </FieldGroup>
                </form>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancelar</Button>
                    </DialogClose>
                    <Button
                        variant="brand"
                        type="submit"
                        form="edit-user-form"
                        disabled={isSubmitting}
                    >
                        <UserCircle data-icon="inline-start" />
                        {isSubmitting ? "Guardando..." : "Guardar cambios"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
