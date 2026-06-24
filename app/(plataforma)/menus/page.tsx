import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Menús",
    description: "Gestioná los tipos de menú. Controlá nombres, precios y estado activo.",
};
import { PageHeader } from "../components/page-header";
import { MenusTableData } from "./components/menus-table-data";
import { CreateMenuDialog } from "./components/create-menu-dialog";
import { MenusTableSkeleton } from "./components/menus-table-skeleton";

type MenusPageProps = {
    searchParams: Promise<{ q?: string; active?: string; page?: string; limit?: string }>;
};

export default async function Page({ searchParams }: MenusPageProps) {
    const { q, active, page, limit } = await searchParams;

    return (
        <>
            <PageHeader
                title="Menús"
                description="Gestioná los tipos de menú. Controlá nombres, precios y estado activo."
                action={<CreateMenuDialog />}
            />

            <div className="flex flex-col gap-4 p-6">
                <Suspense fallback={<MenusTableSkeleton />}>
                    <MenusTableData q={q} active={active} page={page} limit={limit} />
                </Suspense>
            </div>
        </>
    );
}
