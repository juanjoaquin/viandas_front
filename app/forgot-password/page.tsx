import { ForgotPasswordForm } from "./forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-sm bg-card rounded-2xl shadow-sm border border-border p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-foreground">Olvidé mi contraseña</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ingresá tu email y te enviamos un link para restablecerla.
          </p>
        </div>

        <ForgotPasswordForm />
      </div>
    </main>
  );
}
