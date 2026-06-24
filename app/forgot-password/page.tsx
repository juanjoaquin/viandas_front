import type { Metadata } from "next";
import { ForgotPasswordForm } from "./forgot-password-form";

export const metadata: Metadata = {
  title: "Olvidé mi contraseña",
  description: "Ingresá tu email y te enviamos un link para restablecerla.",
};

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-sidebar px-4 py-12">
      <div className="w-full max-w-sm shrink-0 rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-foreground">
            Olvidé mi contraseña
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ingresá tu email y te enviamos un link para restablecerla.
          </p>
        </div>

        <ForgotPasswordForm />
      </div>
    </main>
  );
}
