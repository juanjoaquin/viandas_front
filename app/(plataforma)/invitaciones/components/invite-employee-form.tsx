"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Copy, Mail, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createUserInviteAction } from "@/src/architecture/actions/user-invite/create-user-invite.action";
import {
  createUserInviteInputSchema,
  type CreateUserInviteInput,
  type TUserInvite,
} from "@/src/architecture/core/domain/entities/UserInvite";

function RequiredMark() {
  return (
    <span className="text-destructive" aria-hidden="true">
      {" "}
      *
    </span>
  );
}

function formatExpiresAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function InviteEmployeeForm() {
  const [lastInvite, setLastInvite] = useState<TUserInvite | null>(null);
  const [copied, setCopied] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<CreateUserInviteInput>({
    resolver: zodResolver(createUserInviteInputSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      role: "EMPLOYEE",
    },
  });

  async function onSubmit(data: CreateUserInviteInput) {
    try {
      const result = await createUserInviteAction(data);

      if (result.success) {
        setLastInvite(result.data);
        setCopied(false);
        toast.success("Invitación enviada correctamente");
        reset();
        return;
      }

      if (result.code === "CONFLICT") {
        toast.error("Ya existe un usuario o invitación para ese email.");
        return;
      }

      if (result.code === "FORBIDDEN") {
        toast.error("No tenés permisos para crear invitaciones.");
        return;
      }

      toast.error(result.error);
    } catch (error) {
      console.error(error);
      toast.error("Error inesperado al crear la invitación");
    }
  }

  async function handleCopyLink() {
    if (!lastInvite?.invite_url) return;

    try {
      await navigator.clipboard.writeText(lastInvite.invite_url);
      setCopied(true);
      toast.success("Enlace copiado al portapapeles");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("No se pudo copiar el enlace");
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <section className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="mb-6 flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <UserPlus className="size-5" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-semibold">Invitar empleado</h2>
            <p className="text-sm text-muted-foreground">
              Ingresá el email del empleado. Se enviará una invitación por correo
              y también podrás copiar el enlace manualmente.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="invite-email">
                    Email del empleado
                    <RequiredMark />
                  </FieldLabel>
                  <Input
                    {...field}
                    id="invite-email"
                    type="email"
                    autoComplete="email"
                    placeholder="empleado@empresa.com"
                    disabled={isSubmitting}
                  />
                  <FieldDescription>
                    El empleado recibirá un enlace para completar su registro.
                  </FieldDescription>
                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />

            <Button type="submit" variant="brand" disabled={isSubmitting}>
              <Mail data-icon="inline-start" />
              {isSubmitting ? "Enviando invitación..." : "Enviar invitación"}
            </Button>
          </FieldGroup>
        </form>
      </section>

      {lastInvite && (
        <section className="rounded-xl border border-green-200 bg-green-50/50 p-6 dark:border-green-900/50 dark:bg-green-950/20">
          <div className="mb-4 space-y-1">
            <h3 className="text-sm font-semibold text-green-900 dark:text-green-100">
              Invitación creada
            </h3>
            <p className="text-sm text-green-800/80 dark:text-green-200/80">
              Se envió un email a{" "}
              <span className="font-medium">{lastInvite.email}</span>. También
              podés compartir este enlace por WhatsApp u otro medio.
            </p>
            <p className="text-xs text-muted-foreground">
              Expira el {formatExpiresAt(lastInvite.expires_at)}
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              readOnly
              value={lastInvite.invite_url}
              className="bg-background font-mono text-xs"
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleCopyLink}
              className="shrink-0"
            >
              {copied ? (
                <>
                  <Check data-icon="inline-start" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy data-icon="inline-start" />
                  Copiar enlace
                </>
              )}
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
