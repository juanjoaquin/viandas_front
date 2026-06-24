import { getAllUsersAction } from "@/src/architecture/actions/user/get-all-users.action";
import { parsePaginationParams } from "@/src/architecture/core/domain/pagination";
import { UsersTable } from "./users-table";

type UsersTableDataProps = {
    q?: string;
    page?: string;
    limit?: string;
};

export async function UsersTableData({ q, page, limit }: UsersTableDataProps) {
    const { page: currentPage, limit: currentLimit } = parsePaginationParams(page, limit);
    const filters = {
        ...(q && { q }),
        page: currentPage,
        limit: currentLimit,
    };
    const result = await getAllUsersAction(filters);

    if (!result.success) {
        return <div>Error al obtener los usuarios</div>;
    }

    return (
        <UsersTable
            users={result.data?.items ?? []}
            meta={result.data?.meta}
            q={q}
        />
    );
}
