import { Result } from "@/src/libs/result";
import {
    AddWeekMenuItemInput,
    CreateWeekMenuInput,
    TDayMenu,
    TWeekMenu,
    TWeekMenuItem,
    UpdateWeekMenuItemInput,
} from "../../entities/WeekMenu";

export interface IWeekMenuRepository {
    getAll(): Promise<Result<TWeekMenu[]>>;
    getById(id: string): Promise<Result<TWeekMenu>>;
    resolve(weekMenuId?: string): Promise<Result<TWeekMenu>>;
    getMenuByDate(date: string): Promise<Result<TDayMenu>>;
    create(data: CreateWeekMenuInput): Promise<Result<TWeekMenu>>;
    delete(id: string): Promise<Result<void>>;
    addItem(weekMenuId: string, data: AddWeekMenuItemInput): Promise<Result<TWeekMenuItem>>;
    updateItem(weekMenuId: string, itemId: string, data: UpdateWeekMenuItemInput): Promise<Result<void>>;
    deleteItem(weekMenuId: string, itemId: string): Promise<Result<void>>;
}
