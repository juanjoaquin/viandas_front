"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { registerWithInviteAction } from "@/src/architecture/actions/auth/register-with-invite.action";
import {
  registerWithInviteInputSchema,
  type RegisterWithInviteInput,
} from "@/src/architecture/core/domain/entities/Auth";

type RegisterFormProps = {
  token: string;
};

function RequiredMark() {
  return (
    <span className="text-destructive" aria-hidden="true">
      {" "}
      *
    </span>
  );
}

function inviteErrorMessage(message: string): string {
  if (message.includes("expired")) {
    return "La invitación expiró. Pedile al administrador que genere una nueva.";
  }
  if (message.includes("accepted")) {
    return "Esta invitación ya fue utilizada.";
  }
  if (message.includes("invalid")) {
    return "La invitación no es válida.";
  }
  return message || "No se pudo crear la cuenta.";
}

export function RegisterForm({ token }: RegisterFormProps) {
  const router = useRouter();
  const [success, setSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<RegisterWithInviteInput>({
    resolver: zodResolver(registerWithInviteInputSchema),
    mode: "onBlur",
    defaultValues: {
      token,
      name: "",
      password: "",
    },
  });

  async function onSubmit(data: RegisterWithInviteInput) {
    try {
      const result = await registerWithInviteAction({
        ...data,
        token,
      });

      if (result.success) {
        setSuccess(true);
        toast.success("Cuenta creada correctamente");
        setTimeout(() => router.push("/login"), 1200);
        return;
      }

      if (result.code === "CONFLICT") {
        toast.error("Ya existe un usuario registrado con este email.");
        return;
      }

      toast.error(inviteErrorMessage(result.error));
    } catch (error) {
      console.error(error);
      toast.error("Error inesperado al crear la cuenta");
    }
  }

  if (!token) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2">
        <p className="text-sm text-destructive">
          La invitación no es válida o falta el token.
        </p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="space-y-4 text-center">
        <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 dark:border-green-900/50 dark:bg-green-950/20">
          <p className="text-sm text-green-700 dark:text-green-300">
            Cuenta creada correctamente. Te estamos llevando al login.
          </p>
        </div>
        <Link
          className="text-sm font-medium text-primary hover:underline"
          href="/login"
        >
          Ir al login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="register-name">
                Nombre
                <RequiredMark />
              </FieldLabel>
              <Input
                {...field}
                id="register-name"
                type="text"
                autoComplete="name"
                placeholder="Tu nombre"
                disabled={isSubmitting}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="register-password">
                Contraseña
                <RequiredMark />
              </FieldLabel>
              <Input
                {...field}
                id="register-password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                disabled={isSubmitting}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Button
          type="submit"
          variant="brand"
          className="w-full"
          disabled={isSubmitting}
        >
          <UserPlus data-icon="inline-start" />
          {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
        </Button>
      </FieldGroup>
    </form>
  );
}
