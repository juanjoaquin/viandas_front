import { Result } from "@/src/libs/result";
import {
    CreateMenuTypeInput,
    TMenuType,
    UpdateMenuTypeInput,
} from "../../entities/MenuType";
import { GetMenuTypesFilters } from "../../menu-type/get-menu-types-filters";

export interface IMenuTypeRepository {
    getAll(filters?: GetMenuTypesFilters): Promise<Result<TMenuType[]>>;
    create(data: CreateMenuTypeInput): Promise<Result<TMenuType>>;
    getById(id: string): Promise<Result<TMenuType>>;
    update(id: string, data: UpdateMenuTypeInput): Promise<Result<void>>;
    delete(id: string): Promise<Result<void>>;
}
