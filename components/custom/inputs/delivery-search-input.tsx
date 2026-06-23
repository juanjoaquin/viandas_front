"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { DEFAULT_PAGE_LIMIT } from "@/src/architecture/core/domain/pagination";
import { getAllDeliveriesAction } from "@/src/architecture/actions/delivery/get-all-deliveries.action";
import { TDelivery } from "@/src/architecture/core/domain/entities/Delivery";

const SEARCH_DEBOUNCE_MS = 400;

type DeliverySearchInputProps = {
    value: string;
    onValueChange: (deliveryId: string, delivery?: TDelivery) => void;
    selectedDelivery?: Pick<TDelivery, "id" | "name"> | null;
    activeOnly?: boolean;
    disabled?: boolean;
    id?: string;
    placeholder?: string;
};

export function DeliverySearchInput({
    value,
    onValueChange,
    selectedDelivery,
    activeOnly = true,
    disabled = false,
    id,
    placeholder = "Buscar repartidor...",
}: DeliverySearchInputProps) {
    const listboxId = useId();
    const containerRef = useRef<HTMLDivElement>(null);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<TDelivery[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!value) {
                setQuery("");
                return;
            }

            if (selectedDelivery?.id === value) {
                setQuery(selectedDelivery.name);
            }
        }, 0);

        return () => clearTimeout(timeout);
    }, [value, selectedDelivery]);

    useEffect(() => {
        if (!isOpen) return;

        const trimmedQuery = query.trim();

        const timeout = setTimeout(() => {
            setIsLoading(true);

            getAllDeliveriesAction({
                page: 1,
                limit: DEFAULT_PAGE_LIMIT,
                ...(trimmedQuery ? { q: trimmedQuery } : {}),
            })
                .then((result) => {
                    if (result.success) {
                        const items = result.data?.items ?? [];
                        setResults(activeOnly ? items.filter((d) => d.active) : items);
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
    }, [query, isOpen, activeOnly]);

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

        if (value && nextQuery.trim() !== selectedDelivery?.name) {
            onValueChange("");
        }
    }

    function handleSelectDelivery(delivery: TDelivery) {
        setQuery(delivery.name);
        onValueChange(delivery.id, delivery);
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
                    className="absolute z-50 mt-1 max-h-52 w-full overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-md"
                >
                    {isLoading ? (
                        <p className="px-2.5 py-2 text-sm text-muted-foreground">
                            Buscando...
                        </p>
                    ) : showEmptyState ? (
                        <p className="px-2.5 py-2 text-sm text-muted-foreground">
                            Sin coincidencias
                        </p>
                    ) : (
                        results.map((delivery) => {
                            const isSelected = delivery.id === value;

                            return (
                                <button
                                    key={delivery.id}
                                    type="button"
                                    role="option"
                                    aria-selected={isSelected}
                                    onMouseDown={(event) => event.preventDefault()}
                                    onClick={() => handleSelectDelivery(delivery)}
                                    className={cn(
                                        "flex w-full items-start gap-2 rounded-md px-2.5 py-2 text-left text-sm transition-colors hover:bg-accent",
                                        isSelected && "bg-accent",
                                    )}
                                >
                                    <span className="min-w-0 flex-1">
                                        <span className="block font-medium text-foreground">
                                            {delivery.name}
                                        </span>
                                        {delivery.phone ? (
                                            <span className="mt-0.5 block text-xs text-muted-foreground">
                                                {delivery.phone}
                                            </span>
                                        ) : null}
                                    </span>
                                    {isSelected ? (
                                        <Check className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
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
