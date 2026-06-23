"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TDish } from "@/src/architecture/core/domain/entities/Dish";
import { DEFAULT_PAGE_LIMIT } from "@/src/architecture/core/domain/pagination";
import { getAllDishesAction } from "@/src/architecture/actions/dish/get-all-dishes.action";
import { cn } from "@/lib/utils";

const SEARCH_DEBOUNCE_MS = 400;

type DishSearchInputProps = {
    menuTypeId: string;
    value: string;
    onValueChange: (dishId: string) => void;
    selectedDish?: Pick<TDish, "id" | "name"> | null;
    disabled?: boolean;
    id?: string;
    placeholder?: string;
};

export function DishSearchInput({
    menuTypeId,
    value,
    onValueChange,
    selectedDish,
    disabled = false,
    id,
    placeholder = "Buscar plato por nombre...",
}: DishSearchInputProps) {
    const listboxId = useId();
    const containerRef = useRef<HTMLDivElement>(null);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<TDish[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    useEffect(() => {
        if (!value) {
            setQuery("");
            return;
        }

        if (selectedDish?.id === value) {
            setQuery(selectedDish.name);
        }
    }, [value, selectedDish]);

    useEffect(() => {
        if (!menuTypeId || !isOpen) return;

        const trimmedQuery = query.trim();

        const timeout = setTimeout(() => {
            setIsLoading(true);

            getAllDishesAction({
                menu_type_id: menuTypeId,
                page: 1,
                limit: DEFAULT_PAGE_LIMIT,
                ...(trimmedQuery ? { q: trimmedQuery } : {}),
            })
                .then((result) => {
                    if (result.success) {
                        setResults(result.data?.items ?? []);
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
    }, [menuTypeId, query, isOpen]);

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

        if (value && nextQuery.trim() !== selectedDish?.name) {
            onValueChange("");
        }
    }

    function handleSelectDish(dish: TDish) {
        setQuery(dish.name);
        onValueChange(dish.id);
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
                            Buscando platos...
                        </p>
                    ) : showEmptyState ? (
                        <p className="px-2.5 py-2 text-sm text-muted-foreground">
                            Sin coincidencias
                        </p>
                    ) : (
                        results.map((dish) => {
                            const isSelected = dish.id === value;

                            return (
                                <button
                                    key={dish.id}
                                    type="button"
                                    role="option"
                                    aria-selected={isSelected}
                                    onMouseDown={(event) => event.preventDefault()}
                                    onClick={() => handleSelectDish(dish)}
                                    className={cn(
                                        "flex w-full items-start gap-2 rounded-md px-2.5 py-2 text-left text-sm transition-colors hover:bg-accent",
                                        isSelected && "bg-accent",
                                    )}
                                >
                                    <span className="min-w-0 flex-1">
                                        <span className="block font-medium text-foreground">
                                            {dish.name}
                                        </span>
                                        {dish.description ? (
                                            <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                                                {dish.description}
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
