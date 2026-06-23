"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/src/architecture/actions/auth/login.action";
import type { LoginInput } from "@/src/architecture/core/domain/entities/Auth";

export default function LoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<LoginInput>>({});

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const form = e.currentTarget;
    const data: LoginInput = {
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      password: (form.elements.namedItem("password") as HTMLInputElement).value,
    };

    startTransition(async () => {
      const result = await loginAction(data);
      if (result.success) {
        router.push("/overview");
      } else {
        if (result.code === "VALIDATION") {
          setFieldErrors({ email: result.error });
        } else if (result.code === "UNAUTHORIZED") {
          setError("Email o contraseña incorrectos");
        } else {
          setError(result.error ?? "Error al iniciar sesión");
        }
      }
    });
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-sm bg-card rounded-2xl shadow-sm border border-border p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-foreground">Iniciar sesión</h1>
          <p className="mt-1 text-sm text-muted-foreground">Ingresá tus credenciales para continuar</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium text-foreground">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              disabled={isPending}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring disabled:bg-muted disabled:text-muted-foreground"
              placeholder="tu@email.com"
            />
            {fieldErrors.email && (
              <p className="text-xs text-destructive">{fieldErrors.email}</p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-medium text-foreground">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              disabled={isPending}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring disabled:bg-muted disabled:text-muted-foreground"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/30 px-3 py-2">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </main>
  );
}
