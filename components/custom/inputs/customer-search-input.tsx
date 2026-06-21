"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { DEFAULT_PAGE_LIMIT } from "@/src/architecture/core/domain/pagination";
import { getAllCustomersAction } from "@/src/architecture/actions/customer/get-all-customers.action";
import { TCustomer } from "@/src/architecture/core/domain/entities/Customer";

const SEARCH_DEBOUNCE_MS = 400;

type CustomerSearchInputProps = {
    value: string;
    onValueChange: (customerId: string, customer?: TCustomer) => void;
    selectedCustomer?: Pick<TCustomer, "id" | "name" | "type"> | null;
    disabled?: boolean;
    id?: string;
    placeholder?: string;
};

export function CustomerSearchInput({
    value,
    onValueChange,
    selectedCustomer,
    disabled = false,
    id,
    placeholder = "Buscar cliente por nombre...",
}: CustomerSearchInputProps) {
    const listboxId = useId();
    const containerRef = useRef<HTMLDivElement>(null);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<TCustomer[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!value) {
                setQuery("");
                return;
            }

            if (selectedCustomer?.id === value) {
                setQuery(selectedCustomer.name);
            }
        }, 0);

        return () => clearTimeout(timeout);
    }, [value, selectedCustomer]);

    useEffect(() => {
        if (!isOpen) return;

        const trimmedQuery = query.trim();

        const timeout = setTimeout(() => {
            setIsLoading(true);

            const filters = {
                page: 1,
                limit: DEFAULT_PAGE_LIMIT,
                ...(trimmedQuery ? { q: trimmedQuery } : {}),
            };

            console.log("[CustomerSearchInput] GET customers", filters);

            getAllCustomersAction(filters)
                .then((result) => {
                    if (result.success) {
                        const items = result.data?.items ?? [];
                        console.log("[CustomerSearchInput] GET customers OK", {
                            recibidos: items.length,
                            meta: result.data?.meta,
                        });
                        setResults(items);
                    } else {
                        setResults([]);
                    }
                })
                .catch(() => setResults([]))
                .finally(() => {
                    setIsLoading(false);
                    setHasSearched(true);
                });
        }, trimmedQuery ? SEARCH_DEBOUNCE_MS : 0);

        return () => clearTimeout(timeout);
    }, [query, isOpen]);

    useEffect(() => {
        function handlePointerDown(event: MouseEvent) {
            if (!containerRef.current?.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("pointerdown", handlePointerDown);
        return () => document.removeEventListener("pointerdown", handlePointerDown);
    }, []);

    function handleQueryChange(nextQuery: string) {
        setQuery(nextQuery);
        setIsOpen(true);
        setHasSearched(false);

        if (value && nextQuery.trim() !== selectedCustomer?.name) {
            onValueChange("");
        }
    }

    function handleSelectCustomer(customer: TCustomer) {
        setQuery(customer.name);
        onValueChange(customer.id, customer);
        setIsOpen(false);
    }

    const showEmptyState = hasSearched && !isLoading && results.length === 0;

    return (
        <div ref={containerRef} className="relative w-full">
            <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                    id={id}
                    type="text"
                    role="combobox"
                    aria-expanded={isOpen}
                    aria-controls={listboxId}
                    aria-autocomplete="list"
                    autoComplete="off"
                    value={query}
                    disabled={disabled}
                    placeholder={placeholder}
                    onChange={(event) => handleQueryChange(event.target.value)}
                    onFocus={() => setIsOpen(true)}
                    className="pl-8"
                />
                {isLoading && (
                    <Loader2 className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 animate-spin text-muted-foreground" />
                )}
            </div>

            {isOpen && !disabled && (
                <div
                    id={listboxId}
                    role="listbox"
                    className="absolute z-50 mt-1 max-h-52 w-full overflow-y-auto rounded-lg border border-slate-200 bg-popover p-1 shadow-md dark:border-slate-700"
                >
                    {isLoading ? (
                        <p className="px-2.5 py-2 text-sm text-muted-foreground">
                            Buscando clientes...
                        </p>
                    ) : showEmptyState ? (
                        <p className="px-2.5 py-2 text-sm text-muted-foreground">
                            Sin coincidencias
                        </p>
                    ) : (
                        results.map((customer) => {
                            const isSelected = customer.id === value;

                            return (
                                <button
                                    key={customer.id}
                                    type="button"
                                    role="option"
                                    aria-selected={isSelected}
                                    onMouseDown={(event) => event.preventDefault()}
                                    onClick={() => handleSelectCustomer(customer)}
                                    className={cn(
                                        "flex w-full items-start gap-2 rounded-md px-2.5 py-2 text-left text-sm transition-colors hover:bg-slate-100 dark:hover:bg-slate-800",
                                        isSelected && "bg-slate-100 dark:bg-slate-800",
                                    )}
                                >
                                    <span className="min-w-0 flex-1">
                                        <span className="block font-medium text-slate-900 dark:text-slate-50">
                                            {customer.name}
                                        </span>
                                        <span className="mt-0.5 block text-xs text-muted-foreground">
                                            {customer.type === "COMPANY" ? "Empresa" : "Particular"}
                                        </span>
                                    </span>
                                    {isSelected ? (
                                        <Check className="mt-0.5 size-3.5 shrink-0 text-slate-600 dark:text-slate-300" />
                                    ) : null}
                                </button>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
}
