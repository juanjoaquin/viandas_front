import { RegisterForm } from "./register-form";

type RegisterPageProps = {
  searchParams: Promise<{
    token?: string | string[];
  }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams;
  const rawToken = params.token;
  const token = Array.isArray(rawToken) ? rawToken[0] ?? "" : rawToken ?? "";

  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-sm bg-card rounded-2xl shadow-sm border border-border p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-foreground">Crear cuenta</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Completá tus datos para aceptar la invitación
          </p>
        </div>

        <RegisterForm token={token} />
      </div>
    </main>
  );
}
