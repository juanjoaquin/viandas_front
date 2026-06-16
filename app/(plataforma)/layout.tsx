import { redirect } from "next/navigation";
import { getMeAction } from "@/src/architecture/actions/auth/getMe.action";
import { PlataformaShell } from "./components/plataforma-shell";

export default async function PlataformaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const result = await getMeAction();

  if (!result.success) {
    redirect("/login");
  }

  return <PlataformaShell user={result.data}>{children}</PlataformaShell>;
}
