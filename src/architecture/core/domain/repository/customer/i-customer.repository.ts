import { Result } from "@/src/libs/result";
import { TCustomer } from "../../entities/Customer";


export interface ICustomerRepository {
    getAll(accessToken: string): Promise<Result<TCustomer[]>>;

}