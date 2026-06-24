import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar sesión",
  description: "Ingresá tus credenciales para continuar",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
