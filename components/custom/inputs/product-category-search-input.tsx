"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { DEFAULT_PAGE_LIMIT } from "@/src/architecture/core/domain/pagination";
import { getAllProductCategoriesAction } from "@/src/architecture/actions/product-category/get-all-product-categories.action";
import { TProductCategory } from "@/src/architecture/core/domain/entities/ProductCategory";

const SEARCH_DEBOUNCE_MS = 400;

type ProductCategorySearchInputProps = {
    value: string;
    onValueChange: (categoryId: string, category?: TProductCategory) => void;
    selectedCategory?: Pick<TProductCategory, "id" | "name"> | null;
    activeOnly?: boolean;
    disabled?: boolean;
    id?: string;
    placeholder?: string;
};

export function ProductCategorySearchInput({
    value,
    onValueChange,
    selectedCategory,
    activeOnly = true,
    disabled = false,
    id,
    placeholder = "Buscar categoría...",
}: ProductCategorySearchInputProps) {
    const listboxId = useId();
    const containerRef = useRef<HTMLDivElement>(null);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<TProductCategory[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!value) {
                setQuery("");
                return;
            }

            if (selectedCategory?.id === value) {
                setQuery(selectedCategory.name);
            }
        }, 0);

        return () => clearTimeout(timeout);
    }, [value, selectedCategory]);

    useEffect(() => {
        if (!isOpen) return;

        const trimmedQuery = query.trim();

        const timeout = setTimeout(() => {
            setIsLoading(true);

            getAllProductCategoriesAction({
                page: 1,
                limit: DEFAULT_PAGE_LIMIT,
                ...(trimmedQuery ? { q: trimmedQuery } : {}),
                ...(activeOnly ? { active: true } : {}),
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

        if (value && nextQuery.trim() !== selectedCategory?.name) {
            onValueChange("");
        }
    }

    function handleSelectCategory(category: TProductCategory) {
        setQuery(category.name);
        onValueChange(category.id, category);
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
                            Buscando...
                        </p>
                    ) : showEmptyState ? (
                        <p className="px-2.5 py-2 text-sm text-muted-foreground">
                            Sin coincidencias
                        </p>
                    ) : (
                        results.map((category) => {
                            const isSelected = category.id === value;

                            return (
                                <button
                                    key={category.id}
                                    type="button"
                                    role="option"
                                    aria-selected={isSelected}
                                    onMouseDown={(event) => event.preventDefault()}
                                    onClick={() => handleSelectCategory(category)}
                                    className={cn(
                                        "flex w-full items-start gap-2 rounded-md px-2.5 py-2 text-left text-sm transition-colors hover:bg-slate-100 dark:hover:bg-slate-800",
                                        isSelected && "bg-slate-100 dark:bg-slate-800",
                                    )}
                                >
                                    <span className="min-w-0 flex-1 font-medium text-slate-900 dark:text-slate-50">
                                        {category.name}
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
