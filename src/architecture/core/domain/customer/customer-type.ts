import { CustomerType } from "./get-customers-filters";

export const CUSTOMER_TYPE_LABELS: Record<CustomerType, string> = {
    COMPANY: "Empresa",
    PERSON: "Particular",
};

export function getCustomerTypeLabel(type: CustomerType | string): string {
    const normalized = type.toUpperCase().trim();

    if (normalized === "COMPANY" || normalized === "PERSON") {
        return CUSTOMER_TYPE_LABELS[normalized];
    }

    return type;
}
