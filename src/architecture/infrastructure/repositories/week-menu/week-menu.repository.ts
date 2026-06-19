import { IWeekMenuRepository } from "@/src/architecture/core/domain/repository/week-menu/i-week-menu.repository";
import { HttpClient } from "../../http";
import {
    AddWeekMenuItemInput,
    CreateWeekMenuInput,
    TDayMenu,
    TWeekMenu,
    TWeekMenuItem,
    UpdateWeekMenuItemInput,
} from "@/src/architecture/core/domain/entities/WeekMenu";
import { Result } from "@/src/libs/result";

export class WeekMenuRepository implements IWeekMenuRepository {
    constructor(private readonly httpClient: HttpClient) {}

    async getAll(): Promise<Result<TWeekMenu[]>> {
        return await this.httpClient.get<TWeekMenu[]>("week-menus", {
            tags: ["week-menus"],
        });
    }

    async getById(id: string): Promise<Result<TWeekMenu>> {
        const params = new URLSearchParams({ weekMenuId: id });
        return await this.httpClient.get<TWeekMenu>(`week-menus/one?${params.toString()}`, {
            tags: ["week-menus", `week-menu-${id}`],
        });
    }

    async resolve(weekMenuId?: string): Promise<Result<TWeekMenu>> {
        const params = new URLSearchParams();
        if (weekMenuId) {
            params.set("weekMenuId", weekMenuId);
        }

        const query = params.toString();
        return await this.httpClient.get<TWeekMenu>(
            query ? `week-menus/resolved?${query}` : "week-menus/resolved",
            { tags: ["week-menus"] },
        );
    }

    async getMenuByDate(date: string): Promise<Result<TDayMenu>> {
        const params = new URLSearchParams({ date });
        return await this.httpClient.get<TDayMenu>(`week-menus/menu?${params.toString()}`, {
            tags: ["week-menus"],
        });
    }

    async create(data: CreateWeekMenuInput): Promise<Result<TWeekMenu>> {
        return await this.httpClient.post<TWeekMenu>("week-menus", data);
    }

    async delete(id: string): Promise<Result<void>> {
        return await this.httpClient.delete<void>(`week-menus/${id}`);
    }

    async addItem(weekMenuId: string, data: AddWeekMenuItemInput): Promise<Result<TWeekMenuItem>> {
        return await this.httpClient.post<TWeekMenuItem>(`week-menus/${weekMenuId}/items`, data);
    }

    async updateItem(weekMenuId: string, itemId: string, data: UpdateWeekMenuItemInput): Promise<Result<void>> {
        return await this.httpClient.put<void>(`week-menus/${weekMenuId}/items/${itemId}`, data);
    }

    async deleteItem(weekMenuId: string, itemId: string): Promise<Result<void>> {
        return await this.httpClient.delete<void>(`week-menus/${weekMenuId}/items/${itemId}`);
    }
}
