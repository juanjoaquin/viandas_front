"use client";

import Link from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { forgotPasswordAction } from "@/src/architecture/actions/auth/forgot-password.action";
import {
  forgotPasswordInputSchema,
  type ForgotPasswordInput,
} from "@/src/architecture/core/domain/entities/Auth";

function RequiredMark() {
  return (
    <span className="text-destructive" aria-hidden="true">
      {" "}
      *
    </span>
  );
}

export function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordInputSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: ForgotPasswordInput) {
    try {
      const result = await forgotPasswordAction(data);

      if (!result.success && result.code !== "VALIDATION") {
        toast.error(result.error ?? "Error al enviar el link de recuperación");
        return;
      }

      // Siempre mostrar confirmación (no revelar si el email existe)
      setSubmitted(true);
    } catch (error) {
      console.error(error);
      toast.error("Error inesperado al enviar el link de recuperación");
    }
  }

  if (submitted) {
    return (
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center size-12 rounded-full bg-primary/10 mx-auto">
          <Mail className="size-6 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Revisá tu email</h2>
        <p className="text-sm text-muted-foreground">
          Si ese email está registrado, te enviamos un link para restablecer tu contraseña. El link es válido por 1 hora.
        </p>
        <Link
          href="/login"
          className="block text-sm font-medium text-primary hover:underline mt-2"
        >
          Volver al inicio de sesión
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="forgot-password-email">
                Email
                <RequiredMark />
              </FieldLabel>
              <Input
                {...field}
                id="forgot-password-email"
                type="email"
                autoComplete="email"
                placeholder="tu@email.com"
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
          <Mail data-icon="inline-start" />
          {isSubmitting ? "Enviando..." : "Enviar link de recuperación"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          <Link href="/login" className="font-medium text-primary hover:underline">
            Volver al inicio de sesión
          </Link>
        </p>
      </FieldGroup>
    </form>
  );
}
