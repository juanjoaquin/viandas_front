import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { getMeAction } from "@/src/architecture/actions/auth/get-me.action";
import { PlataformaShell } from "./components/plataforma-shell";

export default async function PlataformaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const result = await getMeAction();

  if (!result.success) {
    if (result.code === "UNAUTHORIZED") {
      const cookieStore = await cookies();
      if (cookieStore.get("refreshToken")?.value) {
        const pathname = (await headers()).get("x-pathname") ?? "/";
        redirect(`/api/refresh?redirect=${encodeURIComponent(pathname)}`);
      }
    }
    redirect("/login");
  }

  if (!result.data.active) {
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    redirect("/login?inactive=1");
  }

  return <PlataformaShell user={result.data}>{children}</PlataformaShell>;
}
