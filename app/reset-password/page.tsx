import { ResetPasswordForm } from "./reset-password-form";

type ResetPasswordPageProps = {
  searchParams: Promise<{
    token?: string | string[];
  }>;
};

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const params = await searchParams;
  const rawToken = params.token;
  const token = Array.isArray(rawToken) ? rawToken[0] ?? "" : rawToken ?? "";

  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-sm bg-card rounded-2xl shadow-sm border border-border p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-foreground">Nueva contraseña</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ingresá tu nueva contraseña para restablecer el acceso.
          </p>
        </div>

        <ResetPasswordForm token={token} />
      </div>
    </main>
  );
}
