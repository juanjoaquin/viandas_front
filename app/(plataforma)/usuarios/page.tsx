import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Usuarios",
    description: "Consultá y gestioná el estado de los usuarios de la plataforma.",
};
import { PageHeader } from "../components/page-header";
import { UsersTableSkeleton } from "./components/users-table-skeleton";
import { UsersTableData } from "./components/users-data";

type UsuariosPageProps = {
    searchParams: Promise<{ q?: string; page?: string; limit?: string }>;
};

export default async function Page({ searchParams }: UsuariosPageProps) {
    const { q, page, limit } = await searchParams;

    return (
        <>
            <PageHeader
                title="Usuarios"
                description="Consultá y gestioná el estado de los usuarios de la plataforma."
            />

            <div className="flex flex-col gap-4 p-6">
                <Suspense fallback={<UsersTableSkeleton />}>
                    <UsersTableData q={q} page={page} limit={limit} />
                </Suspense>
            </div>
        </>
    );
}
