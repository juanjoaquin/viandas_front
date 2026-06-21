import { Result } from "@/src/libs/result";
import { Paginated } from "../../pagination";
import { CreateDishInput, TDish, UpdateDishInput } from "../../entities/Dish";
import { GetDishesFilters } from "../../dish/get-dishes-filters";

export interface IDishRepository {
    getAll(filters?: GetDishesFilters): Promise<Result<Paginated<TDish>>>;
    create(data: CreateDishInput): Promise<Result<TDish>>;
    getById(id: string): Promise<Result<TDish>>;
    update(id: string, data: UpdateDishInput): Promise<Result<void>>;
    delete(id: string): Promise<Result<void>>;
}
