"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { resetPasswordAction } from "@/src/architecture/actions/auth/reset-password.action";
import {
  resetPasswordFormSchema,
  type ResetPasswordFormInput,
} from "@/src/architecture/core/domain/entities/Auth";

type ResetPasswordFormProps = {
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

function resetErrorMessage(message: string): string {
  if (message.includes("invalid or expired")) {
    return "El link de recuperación expiró o no es válido. Pedí uno nuevo.";
  }
  if (message.includes("already used")) {
    return "Este link ya fue utilizado. Pedí uno nuevo desde la página de login.";
  }
  return message || "Ocurrió un error al restablecer la contraseña. Intentá de nuevo.";
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    setError,
    formState: { isSubmitting },
  } = useForm<ResetPasswordFormInput>({
    resolver: zodResolver(resetPasswordFormSchema),
    mode: "onBlur",
    defaultValues: {
      token,
      password: "",
      confirmPassword: "",
    },
  });

  if (!token) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 space-y-3">
        <p className="text-sm text-destructive">
          El link de recuperación no es válido. Asegurate de usar el link completo del email.
        </p>
        <Link
          href="/forgot-password"
          className="text-sm font-medium text-primary hover:underline block"
        >
          Solicitar nuevo link
        </Link>
      </div>
    );
  }

  async function onSubmit(data: ResetPasswordFormInput) {
    try {
      const result = await resetPasswordAction({
        token,
        password: data.password,
      });

      if (result.success) {
        toast.success("Contraseña restablecida correctamente");
        router.push("/login?reset=1");
        return;
      }

      if (result.code === "VALIDATION") {
        setError("password", { message: result.error });
        return;
      }

      toast.error(resetErrorMessage(result.error));
    } catch (error) {
      console.error(error);
      toast.error("Error inesperado al restablecer la contraseña");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="reset-password">
                Nueva contraseña
                <RequiredMark />
              </FieldLabel>
              <Input
                {...field}
                id="reset-password"
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

        <Controller
          name="confirmPassword"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="reset-password-confirm">
                Confirmá la contraseña
                <RequiredMark />
              </FieldLabel>
              <Input
                {...field}
                id="reset-password-confirm"
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
          <KeyRound data-icon="inline-start" />
          {isSubmitting ? "Guardando..." : "Restablecer contraseña"}
        </Button>
      </FieldGroup>
    </form>
  );
}
