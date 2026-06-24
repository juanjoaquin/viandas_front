import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Menú Semanal",
    description: "Configurá los platos de cada semana por tipo de menú.",
};
import { PageHeader } from "../components/page-header";
import { getAllWeekMenusAction } from "@/src/architecture/actions/week-menu/get-all-week-menus.action";
import { CreateWeekDialog } from "./components/create-week-dialog";
import { WeekMenuGridSkeleton } from "./components/week-menu-grid-skeleton";
import { WeekMenuGridData } from "./components/week-menu-grid-data";


type MenusSemanalesPageProps = {
    searchParams: Promise<{ weekMenuId?: string }>;
};

export default async function Page({ searchParams }: MenusSemanalesPageProps) {
    const { weekMenuId } = await searchParams;

    const menusResult = await getAllWeekMenusAction();
    const allMenus = menusResult.success ? (menusResult.data ?? []) : [];

    return (
        <>
            <PageHeader
                title="Menú Semanal"
                description="Configurá los platos de cada semana por tipo de menú."
                action={<CreateWeekDialog existingWeeks={allMenus} />}
            />

            <div className="flex flex-col gap-4 p-6">
                <Suspense fallback={<WeekMenuGridSkeleton />}>
                    <WeekMenuGridData
                        requestedWeekMenuId={weekMenuId}
                        allMenus={allMenus}
                    />
                </Suspense>
            </div>
        </>
    );
}
